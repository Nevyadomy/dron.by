import { X, SlidersHorizontal } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import styles from "./FilterModal.module.css";

export interface FilterModalProps {
  activeCount: number;
  children: ReactNode;
}

export const FilterModal = ({ activeCount, children }: FilterModalProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("no-scroll");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("no-scroll");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={styles.openBtn}
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal size={16} />
        Фильтры
        {activeCount > 0 && <span className={styles.count}>{activeCount}</span>}
      </button>

      <div className={styles.desktopOnly}>{children}</div>

      {open && (
        <div
          className={styles.overlay}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.head}>
              <span className={styles.title}>
                Фильтры{activeCount > 0 ? ` (${activeCount})` : ""}
              </span>
              <button
                type="button"
                className={styles.close}
                onClick={() => setOpen(false)}
                aria-label="Закрыть"
                title="Закрыть"
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.body}>{children}</div>
          </div>
        </div>
      )}
    </>
  );
};
