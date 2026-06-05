import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  CurrencyContext,
  type CurrencyCode,
  type CurrencyInfo,
} from "./currency-context";

const STORAGE_KEY = "currency";

function readEnvRate(name: string, fallback: number): number {
  const raw = (import.meta.env as Record<string, string | undefined>)[name];
  const n = raw ? parseFloat(raw) : NaN;
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

const RATES_DEFAULT = {
  USD: 2.9,
  EUR: 3.36,
  PLN: 0.75,
  /** 1 RUB -> BYN (100 RUB = 3.8 BYN). */
  RUB: 0.038,
};

function buildList(): CurrencyInfo[] {
  return [
    { code: "BYN", symbol: "Br", name: "Белорусский рубль", rate: 1 },
    {
      code: "USD",
      symbol: "$",
      name: "Доллар США",
      rate: readEnvRate("VITE_USD_RATE", RATES_DEFAULT.USD),
    },
    {
      code: "EUR",
      symbol: "€",
      name: "Евро",
      rate: readEnvRate("VITE_EUR_RATE", RATES_DEFAULT.EUR),
    },
    {
      code: "PLN",
      symbol: "zł",
      name: "Польский злотый",
      rate: readEnvRate("VITE_PLN_RATE", RATES_DEFAULT.PLN),
    },
    {
      code: "RUB",
      symbol: "₽",
      name: "Российский рубль",
      rate: readEnvRate("VITE_RUB_RATE", RATES_DEFAULT.RUB),
    },
  ];
}

function readStored(): CurrencyCode {
  if (typeof window === "undefined") return "BYN";
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw && ["BYN", "USD", "EUR", "PLN", "RUB"].includes(raw))
    return raw as CurrencyCode;
  return "BYN";
}

function formatNumber(n: number, decimals: number) {
  return n.toLocaleString("ru-RU", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const list = useMemo(() => buildList(), []);
  const [currency, setCurrencyState] = useState<CurrencyCode>(() =>
    readStored(),
  );

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      /* ignore quota */
    }
  }, []);

  const info = useMemo(
    () => list.find((c) => c.code === currency) ?? list[0],
    [list, currency],
  );

  const convert = useCallback((byn: number) => byn / info.rate, [info]);
  const format = useCallback(
    (byn: number, opts?: { decimals?: number }) => {
      const value = convert(byn);
      const decimals = opts?.decimals ?? 2;
      return `${formatNumber(value, decimals)} ${info.symbol}`;
    },
    [convert, info],
  );

  const value = useMemo(
    () => ({ currency, setCurrency, list, info, convert, format }),
    [currency, setCurrency, list, info, convert, format],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}
