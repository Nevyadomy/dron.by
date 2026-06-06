import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./OAuthButtons.module.css";

const AppleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    aria-hidden
    fill="currentColor"
  >
    <path d="M16.4 12.6c0-2.5 2-3.7 2.1-3.8-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.6.9-.8 0-1.9-.9-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.1 1.2 9.5.8 1.2 1.7 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8s1.9.8 3.1.8c1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.6-3.5zM14.2 5.2c.7-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.2 1.8-1 2.9 1 .1 2-.5 2.7-1.3z" />
  </svg>
);

export interface AppleButtonProps {
  label?: string;
}

export const AppleButton = ({ label }: AppleButtonProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={styles.btn}
        onClick={() => setOpen(true)}
      >
        <span className={styles.icon}>
          <AppleIcon />
        </span>
        {label ?? t("oauth.apple")}
      </button>
      {open && (
        <div
          className={styles.modalBackdrop}
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <p style={{ fontSize: 15, marginBottom: 16 }}>
              {t("oauth.appleNotIntegrated")}
            </p>
            <button
              type="button"
              className={styles.btn}
              onClick={() => setOpen(false)}
              style={{ width: "auto", padding: "8px 18px" }}
            >
              {t("common.close")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
