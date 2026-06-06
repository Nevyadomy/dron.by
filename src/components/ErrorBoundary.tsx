import { Component, type ReactNode } from "react";
import { withTranslation, type WithTranslation } from "react-i18next";

interface Props extends WithTranslation {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  copyErrorToClipboard = () => {
    const { error, errorInfo } = this.state;
    const { componentName, t } = this.props;
    const errorText = `
========== ERROR IN DRON.BY ==========
Component: ${componentName || "Not specified"}
Time: ${new Date().toLocaleString()}
Error: ${error?.toString()}
Component Stack: ${errorInfo?.componentStack}
=====================================
    `;
    navigator.clipboard.writeText(errorText);
    alert(t("errorBoundary.copied"));
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, componentName, t } = this.props;

    if (hasError) {
      if (fallback) return fallback;

      return (
        <div
          style={{
            padding: "40px 24px",
            maxWidth: 800,
            margin: "40px auto",
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 48,
              marginBottom: 16,
            }}
          ></div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 8,
              color: "var(--color-fg)",
            }}
          >
            {t("errorBoundary.title")}
          </h2>
          {componentName && (
            <p
              style={{
                fontSize: 14,
                color: "var(--color-muted-fg)",
                marginBottom: 16,
              }}
            >
              {t("errorBoundary.componentError", { component: componentName })}
            </p>
          )}
          <p
            style={{
              fontSize: 14,
              color: "var(--color-muted-fg)",
              marginBottom: 24,
              maxWidth: 500,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {t("errorBoundary.message")}
          </p>

          {/* Technical details (collapsible) */}
          <details
            style={{
              marginBottom: 24,
              textAlign: "left",
              background: "var(--color-muted)",
              padding: 12,
              borderRadius: "var(--radius)",
              fontSize: 12,
              fontFamily: "monospace",
            }}
          >
            <summary style={{ cursor: "pointer", fontWeight: 600 }}>
              {t("errorBoundary.details")}
            </summary>
            <p style={{ marginTop: 12, wordBreak: "break-word" }}>
              <strong>{t("errorBoundary.errorLabel")}</strong>{" "}
              {error?.toString()}
            </p>
            <p style={{ marginTop: 8, wordBreak: "break-word" }}>
              <strong>{t("errorBoundary.stackLabel")}</strong>
              <br />
              <span style={{ whiteSpace: "pre-wrap", fontSize: 11 }}>
                {errorInfo?.componentStack}
              </span>
            </p>
          </details>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 20px",
                background: "var(--color-primary)",
                color: "var(--color-primary-fg)",
                border: "none",
                borderRadius: "var(--radius)",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {t("errorBoundary.reload")}
            </button>
            <button
              onClick={this.copyErrorToClipboard}
              style={{
                padding: "10px 20px",
                background: "var(--color-muted)",
                color: "var(--color-fg)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius)",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              {t("errorBoundary.copy")}
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              style={{
                padding: "10px 20px",
                background: "transparent",
                color: "var(--color-muted-fg)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius)",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              {t("errorBoundary.toHome")}
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

// Оборачиваем withTranslation для доступа к t()
export const ErrorBoundary = withTranslation()(ErrorBoundaryClass);
