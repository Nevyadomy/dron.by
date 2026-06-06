import { createContext } from "react";

export interface ComparisonValue {
  ids: number[];
  count: number;
  isFull: boolean;
  isInComparison: (id: number) => boolean;
  add: (id: number) => "added" | "exists" | "full";
  remove: (id: number) => void;
  clear: () => void;
}

export const ComparisonContext = createContext<ComparisonValue | undefined>(
  undefined,
);
