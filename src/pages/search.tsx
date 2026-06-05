import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { LOCAL_PRODUCTS, searchLocal } from "@/data/products";
import { productsWord } from "@/utils/pluralize";
import s from "./catalog.module.css";

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const [input, setInput] = useState(query);
  const [prev, setPrev] = useState(query);
  if (prev !== query) {
    setPrev(query);
    setInput(query);
  }

  const results = useMemo(
    () => (query ? searchLocal(LOCAL_PRODUCTS, query) : []),
    [query],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    const v = input.trim();
    if (v) next.set("q", v);
    else next.delete("q");
    setParams(next, { replace: true });
  };

  return (
    <div className="page-container">
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>
        {query ? <>Результаты поиска по запросу «{query}»</> : "Поиск"}
      </h1>
      <Breadcrumbs
        items={[{ label: "Главная", to: "/" }, { label: "Поиск" }]}
      />

      <form
        onSubmit={submit}
        className={s.toolbar}
        role="search"
        style={{ marginTop: 12 }}
      >
        <div className={s.toolbarRight} style={{ width: "100%" }}>
          <input
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Что вы ищете?"
            className={s.searchField}
            style={{ flex: 1, minWidth: 240 }}
            autoFocus
          />
          <button
            type="submit"
            className={s.sortField}
            style={{
              background: "var(--color-primary)",
              color: "var(--color-primary-fg)",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <SearchIcon size={16} /> Найти
          </button>
        </div>
      </form>

      {query && (
        <p
          style={{
            fontSize: 14,
            color: "var(--color-muted-fg)",
            marginBottom: 16,
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
