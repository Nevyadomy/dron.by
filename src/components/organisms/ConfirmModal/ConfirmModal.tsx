import { useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import s from "./ConfirmModal.module.css";

export interface ConfirmModalProps {
  open: boolean;
  title?: string;
  text?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  open,
  title = "Подтвердите действие",
  text,
  confirmLabel = "Подтвердить",
  cancelLabel = "Отмена",
  destructive,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className={s.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={s.title}>{title}</h2>
        {text && <p className={s.text}>{text}</p>}
        <div className={s.actions}>
          <Button variant="secondary" type="button" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            style={
              destructive
                ? { background: "var(--color-destructive)", color: "#fff" }
                : undefined
            }
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
