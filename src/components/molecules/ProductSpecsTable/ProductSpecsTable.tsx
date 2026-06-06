import { useTranslation } from "react-i18next";
import type { ProductSpecs } from "@/schemas/productSpecs.schema";
import s from "./ProductSpecsTable.module.css";

export interface ProductSpecsTableProps {
  spec?: ProductSpecs;
}

type FieldDef = { key: string; unit?: string; bool?: boolean };

const FIELDS: FieldDef[] = [
  { key: "manufacturer" },
  { key: "model" },
  { key: "releaseYear" },
  { key: "weight", unit: "г" },
  { key: "dimensions" },
  { key: "colorOptions" },
  { key: "warrantyMonths", unit: "мес." },
  // Drone / FPV
  { key: "flightTime", unit: "мин" },
  { key: "maxSpeed", unit: "км/ч" },
  { key: "maxFlightDistance", unit: "м" },
  { key: "maxTransmissionRange", unit: "м" },
  { key: "cameraResolution" },
  { key: "sensorType" },
  { key: "gimbal", bool: true },
  { key: "obstacleAvoidance", bool: true },
  { key: "gps", bool: true },
  { key: "returnToHome", bool: true },
  { key: "batteryCapacity", unit: "mAh" },
  { key: "chargingTime", unit: "мин" },
  { key: "maxWindResistance", unit: "м/с" },
  { key: "storageTemperature" },
  { key: "foldable", bool: true },
  { key: "remoteControllerType" },
  // FPV-specific
  { key: "fpvGogglesIncluded", bool: true },
  { key: "fpvProtocol" },
  { key: "maxVideoLatency", unit: "мс" },
  // Accessory
  { key: "compatibleModels" },
  { key: "material" },
];

function renderValue(val: unknown, def: FieldDef) {
  if (val === undefined || val === null || val === "") return null;
  if (def.bool) {
    return val ? (
      <span className={s.yes}>✓</span>
    ) : (
      <span className={s.no}>✗</span>
    );
  }
  if (Array.isArray(val)) return val.join(", ");
  if (typeof val === "number" && def.unit)
    return `${val.toLocaleString("ru-RU")} ${def.unit}`;
  if (def.unit) return `${val} ${def.unit}`;
  return String(val);
}

export const ProductSpecsTable = ({ spec }: ProductSpecsTableProps) => {
  const { t } = useTranslation();
  if (!spec || Object.keys(spec).length === 0) return null;

  const rows = FIELDS.flatMap((f) => {
    const raw = (spec as Record<string, unknown>)[f.key];
    if (raw === undefined || raw === null || raw === "") return [];
    if (Array.isArray(raw) && raw.length === 0) return [];
    return [{ def: f, value: raw }];
  });
  if (rows.length === 0) return null;

  return (
    <section className={s.wrap}>
      <h2 className={s.title}>
        {t("spec.title", { defaultValue: "Характеристики" })}
      </h2>
      <div className={s.table}>
        {rows.map(({ def, value }) => (
          <div key={def.key} className={s.row}>
            <span className={s.label}>
              {t(`spec.${def.key}`, { defaultValue: def.key })}
            </span>
            <span className={s.value}>{renderValue(value, def)}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
