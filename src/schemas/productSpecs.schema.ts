/**
 * Detailed product specifications used for the comparison page.
 * All fields are optional so existing products without specs keep working.
 * Three category groups exist: drones, FPV drones, accessories. The union
 * type {@link ProductSpecs} accepts any combination of these fields.
 */

export interface CommonSpecs {
  manufacturer?: string;
  model?: string;
  releaseYear?: number;
  /** Weight in grams. */
  weight?: number;
  /** Example: "200×150×80 мм". */
  dimensions?: string;
  colorOptions?: string[];
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
  cameraResolution?: string;
  sensorType?: string;
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
  storageTemperature?: string;
  foldable?: boolean;
  remoteControllerType?: "в комплекте" | "опционально" | "только смартфон";
}

export interface FpvSpecs extends DroneSpecs {
  fpvGogglesIncluded?: boolean;
  fpvProtocol?: "DJI O3" | "HDZero" | "Analog" | "Walksnail" | "Caddx Vista";
  /** Milliseconds. */
  maxVideoLatency?: number;
}

export interface AccessorySpecs extends CommonSpecs {
  compatibleModels?: string[];
  material?: string;
  /** mAh — for batteries. */
  batteryCapacity?: number;
  /** Minutes — for batteries. */
  chargingTime?: number;
}

export type ProductSpecs = DroneSpecs | FpvSpecs | AccessorySpecs;
