import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { LayoutCard } from "@/components/atoms/LayoutCard";
import { SmartImage } from "@/components/atoms/SmartImage";
import { Button } from "@/components/atoms/Button";
import { PROMOTIONS } from "@/data/promotions";

const PromotionsPage = () => (
  <div className="page-container">
    <h1 style={{ fontSize: 24, fontWeight: 700 }}>Акции</h1>
    <Breadcrumbs items={[{ label: "Главная", to: "/" }, { label: "Акции" }]} />
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {PROMOTIONS.map((p) => (
        <LayoutCard key={p.id} padded>
          <div className="promoRow">
            <SmartImage
              src={p.image}
              alt={p.title}
              loading="lazy"
              style={{
                width: "100%",
                maxHeight: 220,
                objectFit: "cover",
                borderRadius: "var(--radius)",
              }}
            />
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
                {p.title}
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-primary)",
                  marginBottom: 12,
                  fontWeight: 500,
                }}
              >
                {p.period}
              </p>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--color-muted-fg)",
                  lineHeight: 1.6,
                  marginBottom: 16,
                }}
              >
                {p.description}
              </p>
              <Link
                to={
                  p.productIds[0] ? `/product/${p.productIds[0]}` : "/catalog"
                }
              >
                <Button size="sm">К товарам</Button>
              </Link>
            </div>
          </div>
        </LayoutCard>
      ))}
    </div>
  </div>
);

export default PromotionsPage;
