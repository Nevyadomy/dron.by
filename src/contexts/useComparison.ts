import { useContext } from "react";
import { ComparisonContext } from "./Comparison-context";

export function useComparison() {
  const c = useContext(ComparisonContext);
  if (!c)
    throw new Error("useComparison must be used within ComparisonProvider");
  return c;
}
