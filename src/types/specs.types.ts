// Типы для перевода значений характеристик
export type UnitKey =
  | "mm"
  | "cm"
  | "g"
  | "kg"
  | "mAh"
  | "min"
  | "kmh"
  | "ms"
  | "m";

export const unitKeyMap: Record<UnitKey, string> = {
  mm: "units.mm",
  cm: "units.cm",
  g: "units.g",
  kg: "units.kg",
  mAh: "units.mAh",
  min: "units.min",
  kmh: "units.kmh",
  ms: "units.ms",
  m: "units.m",
};

export const colorKeyMap: Record<string, string> = {
  gray: "specValues.colors.gray",
  black: "specValues.colors.black",
  white: "specValues.colors.white",
  darkBlue: "specValues.colors.darkBlue",
  silver: "specValues.colors.silver",
  graphite: "specValues.colors.graphite",
};

export const sensorKeyMap: Record<string, string> = {
  cmos_1_1_3: "specValues.sensors.cmos_1_1_3",
  cmos_1: "specValues.sensors.cmos_1",
  cmos_4_3: "specValues.sensors.cmos_4_3",
  cmos_1_1_7: "specValues.sensors.cmos_1_1_7",
  cmos_1_2_3: "specValues.sensors.cmos_1_2_3",
  cmos_2_3: "specValues.sensors.cmos_2_3",
};

export const fpvProtocolKeyMap: Record<string, string> = {
  dji_o3: "specValues.fpvProtocols.dji_o3",
  dji_o4: "specValues.fpvProtocols.dji_o4",
  elrs_24: "specValues.fpvProtocols.elrs_24",
  elrs_900: "specValues.fpvProtocols.elrs_900",
  walksnail_avatar: "specValues.fpvProtocols.walksnail_avatar",
  caddx_vista: "specValues.fpvProtocols.caddx_vista",
};

export const remoteKeyMap: Record<string, string> = {
  included: "specValues.remotes.included",
  rc_2_screen: "specValues.remotes.rc_2_screen",
  rc_n3: "specValues.remotes.rc_n3",
  lite_radio_3: "specValues.remotes.lite_radio_3",
  tx16s: "specValues.remotes.tx16s",
  pocket: "specValues.remotes.pocket",
};

export const materialKeyMap: Record<string, string> = {
  plastic: "specValues.materials.plastic",
  carbon: "specValues.materials.carbon",
  aluminum: "specValues.materials.aluminum",
  polycarbonate: "specValues.materials.polycarbonate",
  composite: "specValues.materials.composite",
};
