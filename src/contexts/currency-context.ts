import { createContext } from "react";

export type CurrencyCode = "BYN" | "USD" | "EUR" | "PLN" | "RUB";

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  /** BYN per 1 unit of currency (e.g. USD -> 2.9 BYN). */
  rate: number;
}

export interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  list: CurrencyInfo[];
  info: CurrencyInfo;
  /** Convert a BYN amount to the active currency. */
  convert: (byn: number) => number;
  /** Format a BYN amount with the active currency symbol. */
  format: (byn: number, opts?: { decimals?: number }) => string;
}

export const CurrencyContext = createContext<CurrencyContextValue | undefined>(
  undefined,
);
