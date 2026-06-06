import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FilterSidebar,
  type PriceRange,
} from "@/components/organisms/FilterSidebar";
import { FilterModal } from "@/components/organisms/FilterModal";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { Pagination } from "@/components/molecules/Pagination";
import { fetchProducts } from "@/services/productService";
import { useCurrency } from "@/hooks/useCurrency";
import s from "./catalog.module.css";

/**
 * Price boundaries are kept in BYN — currency is only used for display labels.
 * Conversion happens at render time via the active currency.
 */
const PRICE_BOUNDS: { min: number; max: number }[] = [
  { min: 0, max: 200 },
  { min: 200, max: 600 },
  { min: 600, max: 1500 },
  { min: 1500, max: Infinity },
];

const sortOptions = [
  { value: "price-asc", labelKey: "sort.priceAsc" },
  { value: "price-desc", labelKey: "sort.priceDesc" },
  { value: "name-asc", labelKey: "sort.nameAsc" },
  { value: "name-desc", labelKey: "sort.nameDesc" },
];

const CatalogPage = () => {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const { format } = useCurrency();
  const priceRanges: PriceRange[] = useMemo(
    () =>
      PRICE_BOUNDS.map((b) => {
        let label: string;
        if (b.min === 0)
          label = t("catalog.upTo", { price: format(b.max, { decimals: 0 }) });
        else if (b.max === Infinity)
          label = t("catalog.over", { price: format(b.min, { decimals: 0 }) });
        else
          label = t("catalog.range", {
            min: format(b.min, { decimals: 0 }),
            max: format(b.max, { decimals: 0 }),
          });
        return { label, min: b.min, max: b.max };
      }),
    [format, t],
  );
  const search = params.get("q") ?? "";
  const [searchInput, setSearchInput] = useState(search);

  const [prevSearch, setPrevSearch] = useState(search);
  if (prevSearch !== search) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(
    null,
  );
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("price-asc");

  // Responsive page size: 40 on desktop, 20 on mobile.
  const [pageSize, setPageSize] = useState(() =>
    typeof window !== "undefined" && window.innerWidth <= 768 ? 20 : 40,
  );
  useEffect(() => {
    const onResize = () => setPageSize(window.innerWidth <= 768 ? 20 : 40);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);

  const productsQuery = useQuery({
    queryKey: ["products", { search }],
    queryFn: () => fetchProducts({ limit: 1000, search: search || undefined }),
  });

  const allProducts = useMemo(
    () => productsQuery.data?.products ?? [],
    [productsQuery.data],
  );

  const categories = useMemo(
    () => Array.from(new Set(allProducts.map((p) => p.category))).sort(),
    [allProducts],
  );
  const brands = useMemo(
    () =>
      Array.from(
        new Set(allProducts.map((p) => p.brand).filter(Boolean)),
      ).sort(),
    [allProducts],
  );

  const filtered = useMemo(() => {
    let result = [...allProducts];
    if (selectedCategories.length)
      result = result.filter((p) => selectedCategories.includes(p.category));
    if (selectedBrands.length)
      result = result.filter((p) => selectedBrands.includes(p.brand));
    if (selectedPriceRange !== null) {
      const r = priceRanges[selectedPriceRange];
      result = result.filter((p) => p.price >= r.min && p.price < r.max);
    }
    if (inStockOnly) result = result.filter((p) => (p.stock ?? 0) > 0);
    if (selectedRating !== null)
      result = result.filter((p) => (p.rating ?? 0) >= selectedRating);

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
    return result;
  }, [
    allProducts,
    selectedCategories,
    selectedBrands,
    selectedPriceRange,
    inStockOnly,
    selectedRating,
    sortBy,
    priceRanges,
  ]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filtered, currentPage, pageSize],
  );
  const filterKey = [
    search,
    selectedCategories.join("|"),
    selectedBrands.join("|"),
    selectedPriceRange,
    inStockOnly,
    selectedRating,
    sortBy,
    pageSize,
  ].join("§");
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    if (params.get("page")) {
      const next = new URLSearchParams(params);
      next.delete("page");
      setParams(next, { replace: true });
    }
  }
  const setPage = (p: number) => {
    const next = new URLSearchParams(params);
    if (p > 1) next.set("page", String(p));
    else next.delete("page");
    setParams(next, { replace: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggle = (arr: string[], val: string, set: (v: string[]) => void) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedPriceRange(null);
    setInStockOnly(false);
    setSelectedRating(null);
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length +
    (selectedPriceRange !== null ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (selectedRating !== null ? 1 : 0);

  return (
    <div className="page-container">
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>{t("catalog.title")}</h1>
      <Breadcrumbs
        items={[
          { label: t("breadcrumbs.home"), to: "/" },
          { label: t("catalog.title") },
        ]}
      />

      <div className={s.layout}>
        <FilterModal activeCount={activeFilterCount}>
          <FilterSidebar
            categories={categories}
            brands={brands}
            priceRanges={priceRanges}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            selectedPriceRange={selectedPriceRange}
            inStockOnly={inStockOnly}
            selectedRating={selectedRating}
            onCategoryToggle={(c) =>
              toggle(selectedCategories, c, setSelectedCategories)
            }
            onBrandToggle={(b) => toggle(selectedBrands, b, setSelectedBrands)}
            onPriceRangeChange={setSelectedPriceRange}
            onInStockChange={setInStockOnly}
            onRatingChange={setSelectedRating}
            onReset={resetFilters}
          />
        </FilterModal>

        <div className={s.main}>
          <div className={s.toolbar}>
            <p style={{ fontSize: 14, color: "var(--color-muted-fg)" }}>
              {t("catalog.found")}{" "}
              <strong style={{ color: "var(--color-fg)" }}>
                {filtered.length}
              </strong>{" "}
              {t("catalog.items", { count: filtered.length })}
            </p>
            <div className={s.toolbarRight}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const next = new URLSearchParams(params);
                  const v = searchInput.trim();
                  if (v) next.set("q", v);
                  else next.delete("q");
                  setParams(next, { replace: true });
                }}
              >
                <input
                  type="search"
                  placeholder={t("catalog.searchPlaceholder")}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className={s.searchField}
                />
              </form>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={s.sortField}
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {t(o.labelKey)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ProductGrid
            products={pageItems}
            isLoading={productsQuery.isLoading}
            error={
              productsQuery.error
                ? (productsQuery.error as Error).message
                : null
            }
            skeletonCount={pageSize}
          />

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
