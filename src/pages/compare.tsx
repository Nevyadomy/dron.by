import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, X } from "lucide-react";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { Button } from "@/components/atoms/Button";
import { SmartImage } from "@/components/atoms/SmartImage";
import { useComparison } from "@/contexts/useComparison";
import { useCart } from "@/contexts/useCart";
import { useCurrency } from "@/hooks/useCurrency";
import { LOCAL_PRODUCTS } from "@/data/products";
import dronePlaceholder from "@/assets/images/common/drone-placeholder.png";
import { cn } from "@/utils/cn";
import s from "./compare.module.css";

const SPEC_FIELDS: {
  key: string;
  label: string;
  bool?: boolean;
  unit?: string;
}[] = [
  { key: "brand", label: "Бренд" },
  { key: "category", label: "Категория" },
  { key: "price", label: "Цена", unit: "BYN" },
  { key: "manufacturer", label: "Производитель" },
  { key: "model", label: "Модель" },
  { key: "releaseYear", label: "Год выпуска" },
  { key: "weight", label: "Вес", unit: "г" },
  { key: "dimensions", label: "Габариты" },
  { key: "warrantyMonths", label: "Гарантия", unit: "мес." },
  { key: "flightTime", label: "Время полёта", unit: "мин" },
  { key: "maxSpeed", label: "Макс. скорость", unit: "км/ч" },
  { key: "maxFlightDistance", label: "Дальность полёта", unit: "м" },
  { key: "maxTransmissionRange", label: "Передача сигнала", unit: "м" },
  { key: "cameraResolution", label: "Камера" },
  { key: "sensorType", label: "Сенсор" },
  { key: "gimbal", label: "Подвес", bool: true },
  { key: "obstacleAvoidance", label: "Обход препятствий", bool: true },
  { key: "gps", label: "GPS", bool: true },
  { key: "returnToHome", label: "Возврат домой", bool: true },
  { key: "batteryCapacity", label: "Аккумулятор", unit: "mAh" },
  { key: "chargingTime", label: "Время зарядки", unit: "мин" },
  { key: "maxWindResistance", label: "Ветроустойчивость", unit: "м/с" },
  { key: "foldable", label: "Складной", bool: true },
  { key: "fpvGogglesIncluded", label: "FPV-очки в комплекте", bool: true },
  { key: "fpvProtocol", label: "FPV-протокол" },
  { key: "maxVideoLatency", label: "Задержка видео", unit: "мс" },
  { key: "material", label: "Материал" },
];

function getVal(p: Record<string, unknown>, key: string): unknown {
  if (key in p) return p[key];
  const spec = (p as { spec?: Record<string, unknown> }).spec;
  return spec?.[key];
}

function fmt(v: unknown, bool?: boolean, unit?: string): string {
  if (v === undefined || v === null || v === "") return "—";
  if (bool) return v ? "✓" : "✗";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "number" && unit)
    return `${v.toLocaleString("ru-RU")} ${unit}`;
  if (unit) return `${v} ${unit}`;
  return String(v);
}

const ComparePage = () => {
  const { ids, remove, clear } = useComparison();
  const { state, add } = useCart();
  const { format } = useCurrency();
  const [onlyDiff, setOnlyDiff] = useState(true);

  const products = useMemo(
    () =>
      ids
        .map((id) => LOCAL_PRODUCTS.find((p) => p.id === id))
        .filter(Boolean) as typeof LOCAL_PRODUCTS,
    [ids],
  );

  const rows = useMemo(() => {
    return SPEC_FIELDS.map((f) => {
      const values = products.map((p) =>
        getVal(p as unknown as Record<string, unknown>, f.key),
      );
      const present = values.filter(
        (v) => v !== undefined && v !== null && v !== "",
      );
      if (present.length === 0) return null;
      const allSame =
        present.every(
          (v) => JSON.stringify(v) === JSON.stringify(present[0]),
        ) && present.length === values.length;
      return { field: f, values, differs: !allSame };
    }).filter(Boolean) as {
      field: (typeof SPEC_FIELDS)[number];
      values: unknown[];
      differs: boolean;
    }[];
  }, [products]);

  const visibleRows = onlyDiff ? rows.filter((r) => r.differs) : rows;

  if (products.length === 0) {
    return (
      <div className="page-container">
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Сравнение</h1>
        <Breadcrumbs
          items={[{ label: "Главная", to: "/" }, { label: "Сравнение" }]}
        />
        <div className={s.empty}>
          <p style={{ color: "var(--color-muted-fg)", marginBottom: 16 }}>
            Список сравнения пуст. Добавьте товары из каталога.
          </p>
          <Link to="/catalog">
            <Button>Перейти в каталог</Button>
          </Link>
        </div>
      </div>
    );
  }

  const gridStyle = {
    gridTemplateColumns: `220px repeat(${products.length}, minmax(200px, 1fr))`,
  };

  return (
    <div className="page-container">
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Сравнение</h1>
      <Breadcrumbs
        items={[{ label: "Главная", to: "/" }, { label: "Сравнение" }]}
      />

      <div className={s.wrap}>
        <div className={s.toolbar}>
          <div className={s.toggle}>
            <button
              type="button"
              className={cn(onlyDiff && s.active)}
              onClick={() => setOnlyDiff(true)}
            >
              Только различия
            </button>
            <button
              type="button"
              className={cn(!onlyDiff && s.active)}
              onClick={() => setOnlyDiff(false)}
            >
              Все параметры
            </button>
          </div>
          <button type="button" className={s.clearBtn} onClick={clear}>
            Очистить всё
          </button>
        </div>

        {/* Desktop table */}
        <div className={s.scroll}>
          <div className={s.table} style={{ gridTemplateColumns: undefined }}>
            <div className={s.headerRow} style={gridStyle}>
              <div className={cn(s.cell, s.labelCol)} aria-hidden />
              {products.map((p) => {
                const inCart = state.items.some((i) => i.id === p.id);
                return (
                  <div key={p.id} className={cn(s.cell, s.productCell)}>
                    <button
                      type="button"
                      className={s.removeColBtn}
                      onClick={() => remove(p.id)}
                      aria-label="Убрать из сравнения"
                      title="Убрать"
                    >
                      <X size={14} />
                    </button>
                    <div className={s.productImg}>
                      <SmartImage
                        src={p.thumbnail || dronePlaceholder}
                        alt={p.title}
                        loading="lazy"
                      />
                    </div>
                    <Link to={`/product/${p.id}`} className={s.productName}>
                      {p.title}
                    </Link>
                    <div className={s.productPrice}>{format(p.price)}</div>
                    <Button
                      size="sm"
                      disabled={inCart}
                      onClick={() =>
                        add({
                          id: p.id,
                          title: p.title,
                          price: p.price,
                          thumbnail: p.thumbnail,
                        })
                      }
                    >
                      <ShoppingCart size={14} />{" "}
                      {inCart ? "В корзине" : "В корзину"}
                    </Button>
                  </div>
                );
              })}
            </div>
            {visibleRows.map((r) => (
              <div key={r.field.key} className={s.row} style={gridStyle}>
                <div className={cn(s.cell, s.labelCol)}>{r.field.label}</div>
                {r.values.map((v, i) => {
                  const isPrice = r.field.key === "price";
                  const display = isPrice
                    ? format(Number(v) || 0)
                    : fmt(v, r.field.bool, r.field.unit);
                  return (
                    <div key={i} className={cn(s.cell, r.differs && s.diff)}>
                      {display}
                    </div>
                  );
                })}
              </div>
            ))}
            {visibleRows.length === 0 && (
              <div className={s.row} style={{ gridTemplateColumns: `1fr` }}>
                <div
                  className={s.cell}
                  style={{
                    color: "var(--color-muted-fg)",
                    justifyContent: "center",
                  }}
                >
                  Все характеристики совпадают.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile vertical list */}
        <div className={s.mobileList}>
          {products.map((p) => {
            const inCart = state.items.some((i) => i.id === p.id);
            return (
              <div key={p.id} className={s.mobileCard}>
                <div className={s.mobileHeader}>
                  <div className={s.mobileThumb}>
                    <SmartImage
                      src={p.thumbnail || dronePlaceholder}
                      alt={p.title}
                      loading="lazy"
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/product/${p.id}`} className={s.mobileTitle}>
                      {p.title}
                    </Link>
                    <div className={s.mobilePrice}>{format(p.price)}</div>
                  </div>
                  <button
                    type="button"
                    className={s.removeColBtn}
                    style={{ position: "static" }}
                    onClick={() => remove(p.id)}
                    aria-label="Убрать"
                  >
                    <X size={14} />
                  </button>
                </div>
                {visibleRows.map((r) => {
                  const v = r.values[products.indexOf(p)];
                  const isPrice = r.field.key === "price";
                  const display = isPrice
                    ? format(Number(v) || 0)
                    : fmt(v, r.field.bool, r.field.unit);
                  return (
                    <div
                      key={r.field.key}
                      className={cn(s.mobileSpec, r.differs && s.diff)}
                    >
                      <span className="lbl">{r.field.label}</span>
                      <span>{display}</span>
                    </div>
                  );
                })}
                <div style={{ padding: 12 }}>
                  <Button
                    fullWidth
                    size="sm"
                    disabled={inCart}
                    onClick={() =>
                      add({
                        id: p.id,
                        title: p.title,
                        price: p.price,
                        thumbnail: p.thumbnail,
                      })
                    }
                  >
                    <ShoppingCart size={14} />{" "}
                    {inCart ? "В корзине" : "В корзину"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComparePage;
