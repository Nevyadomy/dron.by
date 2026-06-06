import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { ToastContext } from "@/contexts/ToastContext";
import s from "./Toast.module.css";
import { cn } from "@/utils/cn";
import { useTranslation } from "react-i18next";

interface ToastItem {
  id: number;
  text: string;
  actionTo?: string;
  actionLabel?: string;
  variant?: "info" | "warning";
  duration?: number;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const { t } = useTranslation();

  const show = useCallback((t: Omit<ToastItem, "id">) => {
    setItems((prev) => [...prev, { ...t, id: Date.now() + Math.random() }]);
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    const last = items[items.length - 1];
    const tm = setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== last.id));
    }, last.duration ?? 4000);
    return () => clearTimeout(tm);
  }, [items]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className={s.host} role="status" aria-live="polite">
        {items.map((it) => (
          <div
            key={it.id}
            className={cn(s.toast, it.variant === "warning" && s.warning)}
          >
            <span className={s.text}>{it.text}</span>
            {it.actionTo && it.actionLabel && (
              <Link
                to={it.actionTo}
                className={s.link}
                onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))}
              >
                {it.actionLabel}
              </Link>
            )}
            <button
              type="button"
              className={s.close}
              aria-label={t("common.close")}
              onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
