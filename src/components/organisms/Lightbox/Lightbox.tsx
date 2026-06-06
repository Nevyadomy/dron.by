import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import s from "./Lightbox.module.css";

export interface LightboxProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

export const Lightbox = ({ src, alt, onClose }: LightboxProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.classList.add("no-scroll");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
    };
  }, [onClose]);

  return createPortal(
    <div
      className={s.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <img
        src={src}
        alt={alt ?? ""}
        className={s.img}
        onClick={(e) => e.stopPropagation()}
      />
      <button
        type="button"
        className={s.close}
        onClick={onClose}
        aria-label="Закрыть"
        title="Закрыть"
      >
        <X size={22} />
      </button>
    </div>,
    document.body,
  );
};
