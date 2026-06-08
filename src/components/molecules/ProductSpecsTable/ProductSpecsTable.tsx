import { useTranslation } from "react-i18next";
import type { ProductSpecs } from "@/schemas/productSpecs.schema";
import s from "./ProductSpecsTable.module.css";

export interface ProductSpecsTableProps {
  spec?: ProductSpecs;
}

type FieldDef = {
  key: string;
  unitKey?: string; // ключ для перевода единицы измерения
  bool?: boolean;
  isColor?: boolean; // переводимый цвет
  isSensor?: boolean; // переводимый тип сенсора
  isFpvProtocol?: boolean; // переводимый FPV протокол
  isRemote?: boolean; // переводимый тип пульта
  isMaterial?: boolean; // переводимый материал
};

const FIELDS: FieldDef[] = [
  { key: "manufacturer" },
  { key: "model" },
  { key: "releaseYear" },
  { key: "weight", unitKey: "g" },
  { key: "dimensions" },
  { key: "colorOptions", isColor: true },
  { key: "warrantyMonths", unitKey: "months" },
  // Drone / FPV
  { key: "flightTime", unitKey: "min" },
  { key: "maxSpeed", unitKey: "kmh" },
  { key: "maxFlightDistance", unitKey: "m" },
  { key: "maxTransmissionRange", unitKey: "m" },
  { key: "cameraResolution" },
  { key: "sensorType", isSensor: true },
  { key: "gimbal", bool: true },
  { key: "obstacleAvoidance", bool: true },
  { key: "gps", bool: true },
  { key: "returnToHome", bool: true },
  { key: "batteryCapacity", unitKey: "mAh" },
  { key: "chargingTime", unitKey: "min" },
  { key: "maxWindResistance", unitKey: "ms" },
  { key: "storageTemperature" },
  { key: "foldable", bool: true },
  { key: "remoteControllerType", isRemote: true },
  // FPV-specific
  { key: "fpvGogglesIncluded", bool: true },
  { key: "fpvProtocol", isFpvProtocol: true },
  { key: "maxVideoLatency", unitKey: "ms" },
  // Accessory
  { key: "compatibleModels" },
  { key: "material", isMaterial: true },
];

// Функция для перевода единиц измерения
const translateUnit = (
  t: (key: string) => string,
  unitKey?: string,
): string => {
  if (!unitKey) return "";
  const unitMap: Record<string, string> = {
    g: "specValues.units.g",
    kg: "specValues.units.kg",
    mm: "specValues.units.mm",
    cm: "specValues.units.cm",
    m: "specValues.units.m",
    mAh: "specValues.units.mAh",
    min: "specValues.units.min",
    kmh: "specValues.units.kmh",
    ms: "specValues.units.ms",
    months: "specValues.units.months",
  };
  const key = unitMap[unitKey];
  return key ? t(key) : unitKey;
};

// Функция для перевода цвета
const translateColor = (t: (key: string) => string, color: string): string => {
  const colorMap: Record<string, string> = {
    gray: "specValues.colors.gray",
    black: "specValues.colors.black",
    white: "specValues.colors.white",
    darkBlue: "specValues.colors.darkBlue",
    silver: "specValues.colors.silver",
    graphite: "specValues.colors.graphite",
  };
  const key = colorMap[color];
  return key ? t(key) : color;
};

// Функция для перевода типа сенсора
const translateSensor = (
  t: (key: string) => string,
  sensor: string,
): string => {
  const sensorMap: Record<string, string> = {
    cmos_1_1_3: "specValues.sensors.cmos_1_1_3",
    cmos_1: "specValues.sensors.cmos_1",
    cmos_4_3: "specValues.sensors.cmos_4_3",
    cmos_1_1_7: "specValues.sensors.cmos_1_1_7",
    cmos_1_2_3: "specValues.sensors.cmos_1_2_3",
    cmos_2_3: "specValues.sensors.cmos_2_3",
  };
  const key = sensorMap[sensor];
  return key ? t(key) : sensor;
};

// Функция для перевода FPV протокола
const translateFpvProtocol = (
  t: (key: string) => string,
  protocol: string,
): string => {
  const protocolMap: Record<string, string> = {
    dji_o3: "specValues.fpvProtocols.dji_o3",
    dji_o4: "specValues.fpvProtocols.dji_o4",
    elrs_24: "specValues.fpvProtocols.elrs_24",
    elrs_900: "specValues.fpvProtocols.elrs_900",
    walksnail_avatar: "specValues.fpvProtocols.walksnail_avatar",
    caddx_vista: "specValues.fpvProtocols.caddx_vista",
  };
  const key = protocolMap[protocol];
  return key ? t(key) : protocol;
};

// Функция для перевода типа пульта
const translateRemote = (
  t: (key: string) => string,
  remote: string,
): string => {
  const remoteMap: Record<string, string> = {
    included: "specValues.remotes.included",
    rc_2_screen: "specValues.remotes.rc_2_screen",
    rc_n3: "specValues.remotes.rc_n3",
    lite_radio_3: "specValues.remotes.lite_radio_3",
    tx16s: "specValues.remotes.tx16s",
    pocket: "specValues.remotes.pocket",
  };
  const key = remoteMap[remote];
  return key ? t(key) : remote;
};

// Функция для перевода материала
const translateMaterial = (
  t: (key: string) => string,
  material: string,
): string => {
  const materialMap: Record<string, string> = {
    plastic: "specValues.materials.plastic",
    carbon: "specValues.materials.carbon",
    aluminum: "specValues.materials.aluminum",
    polycarbonate: "specValues.materials.polycarbonate",
    composite: "specValues.materials.composite",
  };
  const key = materialMap[material];
  return key ? t(key) : material;
};

// Основная функция рендеринга значения
const renderValue = (
  t: (key: string) => string,
  val: unknown,
  def: FieldDef,
): React.ReactNode => {
  if (val === undefined || val === null || val === "") return null;

  // Булевы значения
  if (def.bool) {
    const boolKey = val
      ? "specValues.booleans.true"
      : "specValues.booleans.false";
    return <span className={val ? s.yes : s.no}>{t(boolKey)}</span>;
  }

  // Массивы цветов
  if (def.isColor && Array.isArray(val)) {
    const translatedColors = val.map((c) => translateColor(t, String(c)));
    return translatedColors.join(", ");
  }

  // Одиночный цвет
  if (def.isColor && typeof val === "string") {
    return translateColor(t, val);
  }

  // Тип сенсора
  if (def.isSensor && typeof val === "string") {
    return translateSensor(t, val);
  }

  // FPV протокол
  if (def.isFpvProtocol && typeof val === "string") {
    return translateFpvProtocol(t, val);
  }

  // Тип пульта
  if (def.isRemote && typeof val === "string") {
    return translateRemote(t, val);
  }

  // Материал
  if (def.isMaterial && typeof val === "string") {
    return translateMaterial(t, val);
  }

  // Массивы (обычные строки)
  if (Array.isArray(val)) {
    return val.join(", ");
  }

  // Числа с единицами измерения
  if (typeof val === "number" && def.unitKey) {
    const unit = translateUnit(t, def.unitKey);
    return `${val.toLocaleString("ru-RU")} ${unit}`;
  }

  // Строки с единицами измерения
  if (def.unitKey && typeof val === "string") {
    const unit = translateUnit(t, def.unitKey);
    // Если строка уже содержит единицу измерения, не добавляем повторно
    if (val.includes(unit)) return val;
    return `${val} ${unit}`;
  }

  // Обычные строки
  return String(val);
};

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
      <h2 className={s.title}>{t("spec.title")}</h2>
      <div className={s.table}>
        {rows.map(({ def, value }) => (
          <div key={def.key} className={s.row}>
            <span className={s.label}>{t(`spec.${def.key}`)}</span>
            <span className={s.value}>{renderValue(t, value, def)}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
