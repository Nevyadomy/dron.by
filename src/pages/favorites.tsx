import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/atoms/Button";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { useFavorites } from "@/contexts/useFavorites";
import { fetchProducts } from "@/services/productService";

const sortOptions = [
  { value: "name-asc", labelKey: "favorites.sortByNameAsc" },
  { value: "name-desc", labelKey: "favorites.sortByNameDesc" },
  { value: "price-asc", labelKey: "favorites.sortByPriceAsc" },
  { value: "price-desc", labelKey: "favorites.sortByPriceDesc" },
];

const FavoritesPage = () => {
  const { t } = useTranslation();
  const { ids, clear } = useFavorites();
  const [sortBy, setSortBy] = useState("name-asc");

  const { data, isLoading } = useQuery({
    queryKey: ["products", "all-for-favs"],
    queryFn: () => fetchProducts({ limit: 100 }),
  });

  const favorites = useMemo(() => {
    const items = (data?.products ?? []).filter((p) => ids.includes(p.id));
    switch (sortBy) {
      case "name-asc":
        return items.sort((a, b) => a.title.localeCompare(b.title));
      case "name-desc":
        return items.sort((a, b) => b.title.localeCompare(a.title));
      case "price-asc":
        return items.sort((a, b) => a.price - b.price);
      case "price-desc":
        return items.sort((a, b) => b.price - a.price);
      default:
        return items;
    }
  }, [data, ids, sortBy]);

  return (
    <div className="page-container">
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>{t("favorites.title")}</h1>
      <Breadcrumbs
        items={[
          { label: t("breadcrumbs.home"), to: "/" },
          { label: t("favorites.title") },
        ]}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 16,
          paddingBottom: 16,
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <p style={{ fontSize: 14, color: "var(--color-muted-fg)" }}>
          <strong style={{ color: "var(--color-fg)" }}>
            {favorites.length}
          </strong>{" "}
          {t("catalog.items", { count: favorites.length })}
        </p>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select
            id="fav-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            disabled={favorites.length === 0}
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 14,
              background: "var(--color-card)",
              color: "var(--color-fg)",
            }}
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {t(o.labelKey)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              if (favorites.length === 0) return;
              clear();
            }}
            disabled={favorites.length === 0}
            aria-label={t("favorites.removeAll")}
            title={t("favorites.removeAll")}
            style={{
              border: "none",
              borderRadius: 8,
              padding: "8px 14px",
              background: "var(--color-primary)",
              color: "var(--color-primary-fg)",
              cursor: favorites.length === 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              opacity: favorites.length === 0 ? 0.5 : 1,
            }}
          >
            <Trash2 size={16} /> {t("favorites.removeAll")}
          </button>
        </div>
      </div>

      {ids.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48 }}>
          <p style={{ color: "var(--color-muted-fg)", marginBottom: 16 }}>
            {t("favorites.emptyHint")}
          </p>
          <Link to="/catalog">
            <Button>{t("cart.goToCatalog")}</Button>
          </Link>
        </div>
      ) : (
        <ProductGrid products={favorites} isLoading={isLoading} />
      )}
    </div>
  );
};

export default FavoritesPage;
