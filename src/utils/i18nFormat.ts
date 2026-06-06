import i18n from "@/i18n";

const localeMap: Record<string, string> = {
  ru: "ru-RU",
  be: "be-BY",
  en: "en-US",
  pl: "pl-PL",
};

function locale(): string {
  return localeMap[i18n.language] ?? "ru-RU";
}

export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  try {
    return new Intl.NumberFormat(locale(), options).format(value);
  } catch {
    return String(value);
  }
}

export function formatDate(
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
): string {
  try {
    const d = value instanceof Date ? value : new Date(value);
    return new Intl.DateTimeFormat(locale(), options).format(d);
  } catch {
    return String(value);
  }
}

export function formatCurrency(
  value: number,
  currency: string,
  options?: Intl.NumberFormatOptions,
): string {
  try {
    return new Intl.NumberFormat(locale(), {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
      ...options,
    }).format(value);
  } catch {
    return `${value} ${currency}`;
  }
}
