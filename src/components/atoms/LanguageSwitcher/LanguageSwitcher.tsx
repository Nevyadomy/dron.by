import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGS, type Lang } from "@/i18n";
import { cn } from "@/utils/cn";
import s from "./LanguageSwitcher.module.css";

const LABELS: Record<Lang, string> = { ru: "RU", be: "BE", en: "EN", pl: "PL" };
const FULL: Record<Lang, string> = {
  ru: "Русский",
  be: "Беларуская",
  en: "English",
  pl: "Polski",
};

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current =
    (i18n.language as Lang) in LABELS ? (i18n.language as Lang) : "ru";

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={s.wrap} ref={ref}>
      <button
        type="button"
        className={s.btn}
        onClick={() => setOpen((v) => !v)}
        aria-label="Сменить язык"
      >
        <Globe size={14} /> {LABELS[current]} <ChevronDown size={14} />
      </button>
      {open && (
        <div className={s.menu} role="menu">
          {SUPPORTED_LANGS.map((code) => (
            <button
              key={code}
              type="button"
              className={cn(s.item, code === current && s.itemActive)}
              onClick={() => {
                i18n.changeLanguage(code);
                setOpen(false);
              }}
            >
              <span>{LABELS[code]}</span>
              <span style={{ color: "var(--color-muted-fg)", fontSize: 12 }}>
                {FULL[code]}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
