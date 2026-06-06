import { useState } from "react";
import { useTranslation } from "react-i18next";
import { GoogleButton } from "./GoogleButton";
import { AppleButton } from "./AppleButton";
import styles from "./OAuthButtons.module.css";

export const OAuthRow = () => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  return (
    <div>
      <div className={styles.divider}>{t("oauth.or")}</div>
      <div className={styles.row}>
        <GoogleButton onError={setError} />
        <AppleButton />
      </div>
      {error && (
        <p
          style={{
            color: "var(--color-destructive)",
            fontSize: 12,
            marginTop: 8,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};
