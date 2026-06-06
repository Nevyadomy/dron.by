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
  RUB: 0.038,
};

/**
 * Форматирование числа с правильными разделителями для текущей локали
 */
function formatNumber(n: number, decimals: number) {
  return n.toLocaleString("ru-RU", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Компонент для отображения символа белорусского рубля через шрифт NBRB
 */
const BynSymbol = () => (
  <span className="nbrb-icon nbrb-icon-byn" aria-label="белорусский рубль">
    {/* Иконка подставляется через ::before из CSS */}
  </span>
);

/**
 * Получить символ валюты с поддержкой NBRB для BYN
 */
const getCurrencySymbol = (code: CurrencyCode): ReactNode => {
  switch (code) {
    case "BYN":
      return <BynSymbol />;
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "PLN":
      return "zł";
    case "RUB":
      return "₽";
    default:
      return code;
  }
};

function buildList(): CurrencyInfo[] {
  return [
    {
      code: "BYN",
      symbol: "Br",
      symbolNode: <BynSymbol />,
      name: "Белорусский рубль",
      rate: 1,
    },
    {
      code: "USD",
      symbol: "$",
      symbolNode: "$",
      name: "Доллар США",
      rate: readEnvRate("VITE_USD_RATE", RATES_DEFAULT.USD),
    },
    {
      code: "EUR",
      symbol: "€",
      symbolNode: "€",
      name: "Евро",
      rate: readEnvRate("VITE_EUR_RATE", RATES_DEFAULT.EUR),
    },
    {
      code: "PLN",
      symbol: "zł",
      symbolNode: "zł",
      name: "Польский злотый",
      rate: readEnvRate("VITE_PLN_RATE", RATES_DEFAULT.PLN),
    },
    {
      code: "RUB",
      symbol: "₽",
      symbolNode: "₽",
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
    (byn: number, opts?: { decimals?: number }): ReactNode => {
      const value = convert(byn);
      const decimals = opts?.decimals ?? 2;
      const formattedNumber = formatNumber(value, decimals);
      const symbol = getCurrencySymbol(currency);

      return (
        <>
          {formattedNumber} {symbol}
        </>
      );
    },
    [convert, currency],
  );

  const formatString = useCallback(
    (byn: number, opts?: { decimals?: number }): string => {
      const value = convert(byn);
      const decimals = opts?.decimals ?? 2;
      const formattedNumber = formatNumber(value, decimals);
      // Для строкового представления используем обычный символ
      const symbol = currency === "BYN" ? "Br" : info.symbol;
      return `${formattedNumber} ${symbol}`;
    },
    [convert, currency, info.symbol],
  );

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      list,
      info,
      convert,
      format,
      formatString,
    }),
    [currency, setCurrency, list, info, convert, format, formatString],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}
