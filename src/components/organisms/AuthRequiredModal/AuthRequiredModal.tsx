import { X } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/atoms/Button";
import styles from "./AuthRequiredModal.module.css";

export interface AuthRequiredModalProps {
  open: boolean;
  onClose: () => void;
}

export const AuthRequiredModal = ({
  open,
  onClose,
}: AuthRequiredModalProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label={t("common.close")}
          title={t("common.close")}
        >
          <X size={18} />
        </button>
        <h2 className={styles.title}>{t("auth.needAccount")}</h2>
        <p className={styles.text}>{t("auth.needAccountText")}</p>
        <div className={styles.actions}>
          <Button onClick={() => go("/login")} fullWidth>
            {t("auth.login")}
          </Button>
          <Button variant="secondary" onClick={() => go("/register")} fullWidth>
            {t("auth.register")}
          </Button>
        </div>
      </div>
    </div>
  );
};
