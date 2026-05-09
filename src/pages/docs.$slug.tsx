import { useParams, Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { LayoutCard } from "@/components/atoms/LayoutCard";

const DOCS: Record<string, { title: string; body: string[] }> = {
  delivery: {
    title: "Условия доставки",
    body: [
      "Доставка по г. Минску — курьером в течение 1-2 рабочих дней. Стоимость уточняется при оформлении заказа.",
      "Доставка по Республике Беларусь — Белпочтой или СДЭК в течение 3-7 рабочих дней.",
      "Самовывоз из офиса г. Минск, пр-т Независимости, 50, офис 12 — бесплатно.",
      "Документ носит ознакомительный характер. Полная редакция готовится в ближайшее время.",
    ],
  },
  payment: {
    title: "Способы оплаты",
    body: [
      "Оплата картой онлайн (Visa, MasterCard, Белкарт) — на сайте при оформлении заказа.",
      "Оплата при получении — наличными или картой курьеру / в офисе.",
      "Безналичный расчёт для юридических лиц — по выставленному счёту.",
      "Документ носит ознакомительный характер. Полная редакция готовится в ближайшее время.",
    ],
  },
};

const DocsPage = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const doc = DOCS[slug];

  if (!doc) {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Документ не найден</h1>
        <Breadcrumbs items={[{ label: "Главная", to: "/" }, { label: "Документ" }]} />
        <LayoutCard padded>
          <p style={{ color: "var(--color-muted-fg)" }}>
            Запрошенный документ отсутствует. Вернитесь на{" "}
            <Link to="/" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>
              главную
            </Link>
            .
          </p>
        </LayoutCard>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>{doc.title}</h1>
      <Breadcrumbs items={[{ label: "Главная", to: "/" }, { label: doc.title }]} />
      <LayoutCard padded>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, lineHeight: 1.6, fontSize: 15 }}>
          {doc.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p style={{ fontSize: 13, color: "var(--color-muted-fg)", marginTop: 8 }}>
            Если у вас есть вопросы — напишите на{" "}
            <a href="mailto:hello@dron.by" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>
              hello@dron.by
            </a>
            .
          </p>
        </div>
      </LayoutCard>
    </div>
  );
};

export default DocsPage;
