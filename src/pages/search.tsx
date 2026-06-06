import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { LOCAL_PRODUCTS, searchLocal } from "@/data/products";

const SearchPage = () => {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";

  const results = useMemo(
    () => (query ? searchLocal(LOCAL_PRODUCTS, query) : []),
    [query],
  );

  return (
    <div className="page-container">
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>
        {query ? t("search.resultsTitle", { query }) : t("search.title")}
      </h1>
      <Breadcrumbs
        items={[
          { label: t("breadcrumbs.home"), to: "/" },
          { label: t("search.title") },
        ]}
      />

      {query && (
        <p
          style={{
            fontSize: 14,
            color: "var(--color-muted-fg)",
            margin: "16px 0",
          }}
        >
          {t("search.found")}{" "}
          <strong style={{ color: "var(--color-fg)" }}>{results.length}</strong>{" "}
          {t("catalog.items", { count: results.length })}
        </p>
      )}

      {query ? (
        results.length > 0 ? (
          <ProductGrid products={results} />
        ) : (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              color: "var(--color-muted-fg)",
            }}
          >
            <p
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "var(--color-fg)",
                marginBottom: 8,
              }}
            >
              {t("search.nothingFound")}
            </p>
            <p>{t("search.nothingFoundHint")}</p>
          </div>
        )
      ) : (
        <div
          style={{
            padding: 48,
            textAlign: "center",
            color: "var(--color-muted-fg)",
          }}
        >
          {t("search.enterQuery")}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
