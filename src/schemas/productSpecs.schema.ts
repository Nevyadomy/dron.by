/**
 * Detailed product specifications used for the comparison page.
 * All fields are optional so existing products without specs keep working.
 * Three category groups exist: drones, FPV drones, accessories. The union
 * type {@link ProductSpecs} accepts any combination of these fields.
 */

// ============ ТИПЫ ДЛЯ ПЕРЕВОДИМЫХ ЗНАЧЕНИЙ ============

/** Переводимый цвет */
export type TranslatableColor =
  | "gray"
  | "black"
  | "white"
  | "darkBlue"
  | "silver"
  | "graphite";

/** Переводимый тип сенсора */
export type TranslatableSensorType =
  | "cmos_1_1_3"
  | "cmos_1"
  | "cmos_4_3"
  | "cmos_1_1_7"
  | "cmos_1_2_3"
  | "cmos_2_3";

/** Переводимый протокол FPV */
export type TranslatableFpvProtocol =
  | "dji_o3"
  | "dji_o4"
  | "elrs_24"
  | "elrs_900"
  | "walksnail_avatar"
  | "caddx_vista";

/** Переводимый тип пульта */
export type TranslatableRemoteController =
  | "included"
  | "rc_2_screen"
  | "rc_n3"
  | "lite_radio_3"
  | "tx16s"
  | "pocket";

/** Переводимый материал */
export type TranslatableMaterial =
  | "plastic"
  | "carbon"
  | "aluminum"
  | "polycarbonate"
  | "composite";

/** Значение с единицей измерения */
export interface LocalizedValue {
  value: number;
  unitKey: string; // ключ для перевода единицы измерения
}

/** Переводимый цвет (массив ключей) */
export type LocalizedColors = TranslatableColor[];

/** Структурированные габариты */
export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unitKey: "mm" | "cm";
}

// ============ ОСНОВНЫЕ ТИПЫ ============

export interface CommonSpecs {
  manufacturer?: string; // бренд - обычно не переводится
  model?: string; // модель - не переводится
  releaseYear?: number;
  /** Weight in grams. */
  weight?: number;
  /** Габариты - либо строка (для простых случаев), либо структура */
  dimensions?: string | Dimensions;
  /** Цвета - либо строки (старый формат), либо массив ключей */
  colorOptions?: string[] | LocalizedColors;
  warrantyMonths?: number;
}

export interface DroneSpecs extends CommonSpecs {
  /** Minutes. */
  flightTime?: number;
  /** km/h. */
  maxSpeed?: number;
  /** meters. */
  maxFlightDistance?: number;
  /** meters. */
  maxTransmissionRange?: number;
  /** Разрешение камеры - может быть строкой (4K/60fps) или ключом */
  cameraResolution?: string;
  /** Тип сенсора - либо строка, либо ключ */
  sensorType?: string | TranslatableSensorType;
  gimbal?: boolean;
  obstacleAvoidance?: boolean;
  gps?: boolean;
  returnToHome?: boolean;
  /** mAh. */
  batteryCapacity?: number;
  /** Minutes. */
  chargingTime?: number;
  /** m/s. */
  maxWindResistance?: number;
  /** Температура хранения - строка */
  storageTemperature?: string;
  foldable?: boolean;
  /** Тип пульта - либо строка, либо ключ */
  remoteControllerType?: string | TranslatableRemoteController;
}

export interface FpvSpecs extends DroneSpecs {
  fpvGogglesIncluded?: boolean;
  /** Протокол FPV - либо строка, либо ключ */
  fpvProtocol?: string | TranslatableFpvProtocol;
  /** Milliseconds. */
  maxVideoLatency?: number;
}

export interface AccessorySpecs extends CommonSpecs {
  /** Совместимые модели - строки (бренды/модели) */
  compatibleModels?: string[];
  /** Материал - либо строка, либо ключ */
  material?: string | TranslatableMaterial;
  /** mAh — for batteries. */
  batteryCapacity?: number;
  /** Minutes — for batteries. */
  chargingTime?: number;
}

export type ProductSpecs = DroneSpecs | FpvSpecs | AccessorySpecs;
