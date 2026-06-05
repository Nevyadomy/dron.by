import { useContext } from "react";
import { CurrencyContext } from "@/contexts/currency-context";

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
