import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ru from "@/locales/ru/translation.json";
import be from "@/locales/be/translation.json";
import en from "@/locales/en/translation.json";
import pl from "@/locales/pl/translation.json";

export const SUPPORTED_LANGS = ["ru", "be", "en", "pl"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

function detectLang(): Lang {
  if (typeof window === "undefined") return "ru";
  const url = new URLSearchParams(window.location.search).get("lng");
  if (url && (SUPPORTED_LANGS as readonly string[]).includes(url))
    return url as Lang;
  const stored = localStorage.getItem("lng");
  if (stored && (SUPPORTED_LANGS as readonly string[]).includes(stored))
    return stored as Lang;
  return "ru";
}

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    be: { translation: be },
    en: { translation: en },
    pl: { translation: pl },
  },
  lng: detectLang(),
  fallbackLng: "ru",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  try {
    localStorage.setItem("lng", lng);
    const url = new URL(window.location.href);
    url.searchParams.set("lng", lng);
    window.history.replaceState({}, "", url.toString());
    document.documentElement.lang = lng;
  } catch {
    /* ignore */
  }
});

document.documentElement.lang = i18n.language;

export default i18n;
