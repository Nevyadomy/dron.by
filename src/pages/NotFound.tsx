import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/atoms/Button";

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 200px)",
        padding: 40,
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at top, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 60%), var(--color-bg)",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.25,
          maskImage:
            "radial-gradient(ellipse at center, black, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "relative",
          textAlign: "center",
          maxWidth: 560,
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: 16,
          padding: "48px 40px",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <h1
          style={{
            fontSize: 120,
            fontWeight: 700,
            lineHeight: 1,
            color: "var(--color-primary)",
            letterSpacing: "-4px",
            marginBottom: 8,
          }}
        >
          404
        </h1>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>
          {t("notFound.title")}
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "var(--color-muted-fg)",
            marginBottom: 28,
            lineHeight: 1.6,
          }}
        >
          {t("notFound.message")}
          <br />
          {t("notFound.checkAddress")}{" "}
          <code
            style={{
              background: "var(--color-muted)",
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 13,
            }}
          >
            {location.pathname}
          </code>
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button onClick={() => navigate(-1)} variant="secondary">
            <ArrowLeft size={16} /> {t("notFound.back")}
          </Button>
          <Link to="/">
            <Button>
              <Home size={16} /> {t("notFound.toHome")}
            </Button>
          </Link>
          <Link to="/catalog">
            <Button variant="ghost">
              <Search size={16} /> {t("notFound.toCatalog")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
