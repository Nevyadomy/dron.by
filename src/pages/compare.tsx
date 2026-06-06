import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, X } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  labelKey: string;
  bool?: boolean;
  unit?: string;
}[] = [
  { key: "brand", labelKey: "spec.manufacturer" },
  { key: "category", labelKey: "filter.category" },
  { key: "price", labelKey: "filter.price", unit: "BYN" },
  { key: "manufacturer", labelKey: "spec.manufacturer" },
  { key: "model", labelKey: "spec.model" },
  { key: "releaseYear", labelKey: "spec.releaseYear" },
  { key: "weight", labelKey: "spec.weight", unit: "г" },
  { key: "dimensions", labelKey: "spec.dimensions" },
  { key: "warrantyMonths", labelKey: "spec.warrantyMonths", unit: "мес." },
  { key: "flightTime", labelKey: "spec.flightTime", unit: "мин" },
  { key: "maxSpeed", labelKey: "spec.maxSpeed", unit: "км/ч" },
  { key: "maxFlightDistance", labelKey: "spec.maxFlightDistance", unit: "м" },
  {
    key: "maxTransmissionRange",
    labelKey: "spec.maxTransmissionRange",
    unit: "м",
  },
  { key: "cameraResolution", labelKey: "spec.cameraResolution" },
  { key: "sensorType", labelKey: "spec.sensorType" },
  { key: "gimbal", labelKey: "spec.gimbal", bool: true },
  { key: "obstacleAvoidance", labelKey: "spec.obstacleAvoidance", bool: true },
  { key: "gps", labelKey: "spec.gps", bool: true },
  { key: "returnToHome", labelKey: "spec.returnToHome", bool: true },
  { key: "batteryCapacity", labelKey: "spec.batteryCapacity", unit: "mAh" },
  { key: "chargingTime", labelKey: "spec.chargingTime", unit: "мин" },
  { key: "maxWindResistance", labelKey: "spec.maxWindResistance", unit: "м/с" },
  { key: "foldable", labelKey: "spec.foldable", bool: true },
  {
    key: "fpvGogglesIncluded",
    labelKey: "spec.fpvGogglesIncluded",
    bool: true,
  },
  { key: "fpvProtocol", labelKey: "spec.fpvProtocol" },
  { key: "maxVideoLatency", labelKey: "spec.maxVideoLatency", unit: "мс" },
  { key: "material", labelKey: "spec.material" },
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
  const { t } = useTranslation();
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
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>{t("compare.title")}</h1>
        <Breadcrumbs
          items={[
            { label: t("breadcrumbs.home"), to: "/" },
            { label: t("compare.title") },
          ]}
        />
        <div className={s.empty}>
          <p style={{ color: "var(--color-muted-fg)", marginBottom: 16 }}>
            {t("compare.empty")}
          </p>
          <Link to="/catalog">
            <Button>{t("cart.goToCatalog")}</Button>
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
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>{t("compare.title")}</h1>
      <Breadcrumbs
        items={[
          { label: t("breadcrumbs.home"), to: "/" },
          { label: t("compare.title") },
        ]}
      />

      <div className={s.wrap}>
        <div className={s.toolbar}>
          <div className={s.toggle}>
            <button
              type="button"
              className={cn(onlyDiff && s.active)}
              onClick={() => setOnlyDiff(true)}
            >
              {t("compare.onlyDifferences")}
            </button>
            <button
              type="button"
              className={cn(!onlyDiff && s.active)}
              onClick={() => setOnlyDiff(false)}
            >
              {t("compare.allParams")}
            </button>
          </div>
          <button type="button" className={s.clearBtn} onClick={clear}>
            {t("compare.clearAll")}
          </button>
        </div>

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
                      aria-label={t("compare.removeFromCompare")}
                      title={t("compare.removeFromCompare")}
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
                      {inCart ? t("compare.inCart") : t("compare.addToCart")}
                    </Button>
                  </div>
                );
              })}
            </div>
            {visibleRows.map((r) => (
              <div key={r.field.key} className={s.row} style={gridStyle}>
                <div className={cn(s.cell, s.labelCol)}>
                  {t(r.field.labelKey)}
                </div>
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
                  {t("compare.allSame")}
                </div>
              </div>
            )}
          </div>
        </div>

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
                    aria-label={t("compare.removeFromCompare")}
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
                      <span className="lbl">{t(r.field.labelKey)}</span>
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
                    {inCart ? t("compare.inCart") : t("compare.addToCart")}
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
