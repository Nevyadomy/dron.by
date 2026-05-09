import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  FilterSidebar,
  type PriceRange,
} from "@/components/organisms/FilterSidebar";
import { FilterModal } from "@/components/organisms/FilterModal";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { fetchProducts } from "@/services/productService";
import { productsWord } from "@/utils/pluralize";
import s from "./catalog.module.css";

const priceRanges: PriceRange[] = [
  { label: "До 200 BYN", min: 0, max: 200 },
  { label: "200 – 600 BYN", min: 200, max: 600 },
  { label: "600 – 1500 BYN", min: 600, max: 1500 },
  { label: "Свыше 1500 BYN", min: 1500, max: Infinity },
];

const sortOptions = [
  { value: "price-asc", label: "Цена: по возрастанию" },
  { value: "price-desc", label: "Цена: по убыванию" },
  { value: "name-asc", label: "Название: А–Я" },
  { value: "name-desc", label: "Название: Я–А" },
];

const CatalogPage = () => {
  const [params, setParams] = useSearchParams();
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
  const [sortBy, setSortBy] = useState("price-asc");

  const productsQuery = useQuery({
    queryKey: ["products", { search }],
    queryFn: () => fetchProducts({ limit: 100, search: search || undefined }),
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
    sortBy,
  ]);

  const toggle = (arr: string[], val: string, set: (v: string[]) => void) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedPriceRange(null);
    setInStockOnly(false);
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length +
    (selectedPriceRange !== null ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  return (
    <div className="page-container">
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Каталог</h1>
      <Breadcrumbs
        items={[{ label: "Главная", to: "/" }, { label: "Каталог" }]}
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
            onCategoryToggle={(c) =>
              toggle(selectedCategories, c, setSelectedCategories)
            }
            onBrandToggle={(b) => toggle(selectedBrands, b, setSelectedBrands)}
            onPriceRangeChange={setSelectedPriceRange}
            onInStockChange={setInStockOnly}
            onReset={resetFilters}
          />
        </FilterModal>

        <div className={s.main}>
          <div className={s.toolbar}>
            <p style={{ fontSize: 14, color: "var(--color-muted-fg)" }}>
              Найдено:{" "}
              <strong style={{ color: "var(--color-fg)" }}>
                {filtered.length}
              </strong>{" "}
              {productsWord(filtered.length)}
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
                  placeholder="Поиск в каталоге"
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
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ProductGrid
            products={filtered}
            isLoading={productsQuery.isLoading}
            error={
              productsQuery.error
                ? (productsQuery.error as Error).message
                : null
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
