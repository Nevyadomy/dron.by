import { useState } from "react";
import { GoogleButton } from "./GoogleButton";
import { AppleButton } from "./AppleButton";
import styles from "./OAuthButtons.module.css";

export const OAuthRow = () => {
  const [error, setError] = useState<string | null>(null);
  return (
    <div>
      <div className={styles.divider}>или</div>
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
