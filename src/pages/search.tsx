import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { LOCAL_PRODUCTS, searchLocal } from "@/data/products";
import { productsWord } from "@/utils/pluralize";

const SearchPage = () => {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";

  const results = useMemo(
    () => (query ? searchLocal(LOCAL_PRODUCTS, query) : []),
    [query],
  );

  return (
    <div className="page-container">
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>
        {query ? <>Результаты поиска по запросу «{query}»</> : "Поиск"}
      </h1>
      <Breadcrumbs
        items={[{ label: "Главная", to: "/" }, { label: "Поиск" }]}
      />

      {query && (
        <p
          style={{
            fontSize: 14,
            color: "var(--color-muted-fg)",
            margin: "16px 0",
          }}
        >
          Найдено:{" "}
          <strong style={{ color: "var(--color-fg)" }}>{results.length}</strong>{" "}
          {productsWord(results.length)}
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
              Ничего не найдено
            </p>
            <p>
              Попробуйте изменить запрос или поискать по другим ключевым словам.
            </p>
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
          Введите запрос, чтобы найти товары.
        </div>
      )}
    </div>
  );
};

export default SearchPage;
