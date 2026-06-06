import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/useAuth";
import { findUserByEmail } from "@/services/userStorage";
import styles from "./OAuthButtons.module.css";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (cfg: {
            client_id: string;
            callback: (resp: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (
            callback?: (notification: {
              isNotDisplayed: () => boolean;
              getNotDisplayedReason: () => string;
              isSkippedMoment: () => boolean;
              getSkippedReason: () => string;
            }) => void,
          ) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme: "outline" | "filled_blue" | "filled_black";
              size: "large" | "medium" | "small";
              text: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape: "rectangular" | "pill" | "circle" | "square";
              logo_alignment: "left" | "center";
              width: string;
            },
          ) => void;
        };
      };
    };
  }
}

const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") return reject(new Error("no-doc"));
    if (window.google?.accounts?.id) return resolve();

    let s = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`,
    );
    if (!s) {
      s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    }

    s.addEventListener("load", () => resolve(), { once: true });
    s.addEventListener(
      "error",
      () => reject(new Error("Не удалось загрузить Google SDK")),
      { once: true },
    );
  });
}

function decodeJwt<T = Record<string, unknown>>(token: string): T | null {
  try {
    const [, payload] = token.split(".");
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
    <path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3C33.8 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.4 6.3 14.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.2 0 9.8-2 13.3-5.2l-6.1-5.2c-2 1.5-4.6 2.4-7.2 2.4-5.3 0-9.8-3.4-11.3-8.1l-6.5 5C9.3 39.6 16.1 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.5H42V20H24v8h11.3c-.7 2.1-2.1 3.9-3.9 5.1l6.1 5.2C39.2 35.6 44 30.3 44 24c0-1.3-.1-2.4-.4-3.5z"
    />
  </svg>
);

export interface GoogleButtonProps {
  label?: string;
  onError?: (msg: string) => void;
}

export const GoogleButton = ({ label, onError }: GoogleButtonProps) => {
  const { t } = useTranslation();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showFallbackButton, setShowFallbackButton] = useState(false);
  const initedRef = useRef(false);
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  // Проверяем наличие clientId
  useEffect(() => {
    if (!clientId) {
      console.warn(
        "[OAuth] VITE_GOOGLE_CLIENT_ID is not set — Google sign-in disabled.",
      );
    }
  }, [clientId]);

  // Обработка полученного токена от Google
  const handleCredential = (credential: string) => {
    const payload = decodeJwt<{
      email?: string;
      name?: string;
      picture?: string;
      sub?: string;
    }>(credential);

    if (!payload?.email) {
      onError?.(t("oauth.googleDataError"));
      return;
    }

    const existing = findUserByEmail(payload.email);
    const id = existing?.id ?? Date.now();

    login({
      id,
      email: payload.email,
      name: payload.name || existing?.name || payload.email.split("@")[0],
      picture: payload.picture,
      avatar: payload.picture,
    });

    navigate("/profile");
  };

  // Инициализация Google SDK
  const initGoogle = async (): Promise<boolean> => {
    if (!clientId) return false;
    if (initedRef.current) return true;

    try {
      await loadGoogleScript();
      if (!window.google?.accounts?.id)
        throw new Error(t("oauth.googleSdkError"));

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (resp) => handleCredential(resp.credential),
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      initedRef.current = true;
      return true;
    } catch (e) {
      console.error("Google init error:", e);
      onError?.(e instanceof Error ? e.message : t("oauth.googleErrorDefault"));
      return false;
    }
  };

  // Основная кнопка - вызывает Google One Tap
  const onClick = async () => {
    if (!clientId) return;
    setLoading(true);
    setShowFallbackButton(false);

    try {
      const initialized = await initGoogle();
      if (!initialized || !window.google?.accounts?.id) {
        setLoading(false);
        return;
      }

      // Пытаемся показать One Tap промпт
      window.google.accounts.id.prompt((notification) => {
        console.log("Google prompt notification:", notification);

        if (notification.isNotDisplayed()) {
          const reason = notification.getNotDisplayedReason();
          console.log("Google prompt not displayed, reason:", reason);

          // Если промпт не показался, показываем fallback кнопку
          setShowFallbackButton(true);
          setLoading(false);

          // Сообщаем пользователю, что нужно нажать на кнопку
          onError?.(t("oauth.googleClickButton"));
        } else if (notification.isSkippedMoment()) {
          const reason = notification.getSkippedReason();
          console.log("Google prompt skipped, reason:", reason);
          setShowFallbackButton(true);
          setLoading(false);
        }
      });

      // Таймаут - если через 3 секунды всё ещё loading, показываем fallback
      setTimeout(() => {
        if (loading) {
          setShowFallbackButton(true);
          setLoading(false);
        }
      }, 3000);
    } catch (e) {
      console.error("Google auth error:", e);
      onError?.(e instanceof Error ? e.message : t("oauth.googleErrorDefault"));
      setLoading(false);
      setShowFallbackButton(true);
    }
  };

  // Рендерим fallback кнопку Google (альтернативный вариант входа)
  useEffect(() => {
    if (
      !showFallbackButton ||
      !buttonContainerRef.current ||
      !window.google?.accounts?.id
    )
      return;

    // Очищаем контейнер перед рендером
    buttonContainerRef.current.innerHTML = "";

    window.google.accounts.id.renderButton(buttonContainerRef.current, {
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      logo_alignment: "left",
      width: "100%",
    });
  }, [showFallbackButton]);

  // Если нет clientId - не показываем кнопку
  if (!clientId) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className={styles.btn}
        onClick={onClick}
        disabled={loading}
        title={t("oauth.googleSignIn")}
      >
        <span className={styles.icon}>
          <GoogleIcon />
        </span>
        {loading ? "…" : (label ?? t("oauth.google"))}
      </button>

      {showFallbackButton && (
        <div style={{ marginTop: 12, width: "100%" }}>
          <div
            ref={buttonContainerRef}
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          />
          <p
            style={{
              fontSize: 12,
              color: "var(--color-muted-fg)",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            {t("oauth.googleFallbackHint")}
          </p>
        </div>
      )}
    </>
  );
};
