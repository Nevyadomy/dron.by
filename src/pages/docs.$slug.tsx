import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { LayoutCard } from "@/components/atoms/LayoutCard";

const DOCS: Record<string, { titleKey: string; bodyKeys: string[] }> = {
  delivery: {
    titleKey: "docs.delivery.title",
    bodyKeys: [
      "docs.delivery.body1",
      "docs.delivery.body2",
      "docs.delivery.body3",
      "docs.delivery.body4",
    ],
  },
  payment: {
    titleKey: "docs.payment.title",
    bodyKeys: [
      "docs.payment.body1",
      "docs.payment.body2",
      "docs.payment.body3",
      "docs.payment.body4",
    ],
  },
};

const DocsPage = () => {
  const { t } = useTranslation();
  const { slug = "" } = useParams<{ slug: string }>();
  const doc = DOCS[slug];

  if (!doc) {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>{t("docs.notFound")}</h1>
        <Breadcrumbs
          items={[
            { label: t("breadcrumbs.home"), to: "/" },
            { label: t("docs.title") },
          ]}
        />
        <LayoutCard padded>
          <p style={{ color: "var(--color-muted-fg)" }}>
            {t("docs.notFoundText")}{" "}
            <Link
              to="/"
              style={{
                color: "var(--color-primary)",
                textDecoration: "underline",
              }}
            >
              {t("docs.backToHome")}
            </Link>
            .
          </p>
        </LayoutCard>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>{t(doc.titleKey)}</h1>
      <Breadcrumbs
        items={[
          { label: t("breadcrumbs.home"), to: "/" },
          { label: t(doc.titleKey) },
        ]}
      />
      <LayoutCard padded>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            lineHeight: 1.6,
            fontSize: 15,
          }}
        >
          {doc.bodyKeys.map((key, i) => (
            <p key={i}>{t(key)}</p>
          ))}
          <p
            style={{
              fontSize: 13,
              color: "var(--color-muted-fg)",
              marginTop: 8,
            }}
          >
            {t("docs.questions")}{" "}
            <a
              href="mailto:info@dron.by"
              style={{
                color: "var(--color-primary)",
                textDecoration: "underline",
              }}
            >
              info@dron.by
            </a>
            .
          </p>
        </div>
      </LayoutCard>
    </div>
  );
};

export default DocsPage;
