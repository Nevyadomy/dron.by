import { useQuery } from "@tanstack/react-query";
import { Check, ChevronLeft, Heart, ShoppingCart } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/atoms/Button";
import { LayoutCard } from "@/components/atoms/LayoutCard";
import { SmartImage } from "@/components/atoms/SmartImage";
import { RatingStars } from "@/components/atoms/RatingStars";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { fetchProduct } from "@/services/productService";
import dronePlaceholder from "@/assets/images/common/drone-placeholder.png";
import { getProductPromo, applyDiscount } from "@/data/promotions";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
  });

  const { isFavorite, toggle } = useFavorites();
  const { state, add, remove } = useCart();

  if (isLoading)
    return (
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: 40,
          textAlign: "center",
        }}
      >
        Загрузка…
      </div>
    );
  if (error || !data)
    return (
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: 40,
          textAlign: "center",
        }}
      >
        Товар не найден.
      </div>
    );

  const fav = isFavorite(data.id);
  const image = data.thumbnail || dronePlaceholder;
  const promo = getProductPromo(data.id);
  const hasDiscount = !!(promo && promo.discount > 0);
  const finalPrice = hasDiscount
    ? applyDiscount(data.price, promo!.discount)
    : data.price;
  const inCart = state.items.some((i) => i.id === data.id);
  const inStock = (data.stock ?? 0) > 0;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <Link
        to="/catalog"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontSize: 14,
          color: "var(--color-muted-fg)",
          marginBottom: 16,
        }}
      >
        <ChevronLeft size={16} /> Назад в каталог
      </Link>

      <div className="collapse-md">
        <LayoutCard padded>
          <SmartImage
            src={image}
            alt={data.title}
            loading="lazy"
            style={{ width: "100%", objectFit: "contain" }}
          />
        </LayoutCard>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>{data.title}</h1>
          <p style={{ color: "var(--color-muted-fg)" }}>
            {data.brand} · {data.category}
          </p>
          {data.rating > 0 && (
            <RatingStars value={data.rating} size={16} showValue />
          )}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <p
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "var(--color-primary)",
              }}
            >
              {finalPrice} <i className="nbrb-icon">BYN</i>
            </p>
            {hasDiscount && (
              <p
                style={{
                  fontSize: 18,
                  color: "var(--color-muted-fg)",
                  textDecoration: "line-through",
                }}
              >
                {data.price} <i className="nbrb-icon">BYN</i>
              </p>
            )}
            {promo && (
              <span
                style={{
                  background: "var(--color-primary)",
                  color: "var(--color-primary-fg)",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "3px 8px",
                  borderRadius: 4,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {promo.badge ?? "Акция"}
              </span>
            )}
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>{data.description}</p>

          {!inStock && (
            <p
              style={{
                color: "var(--color-destructive)",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Товара нет в наличии
            </p>
          )}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {inStock && (
              <Button
                disabled={!inStock}
                title={inCart ? "Удалить из корзины" : "Добавить в корзину"}
                aria-label={
                  inCart ? "Удалить из корзины" : "Добавить в корзину"
                }
                style={
                  inCart
                    ? {
                        background: "var(--color-success)",
                        borderColor: "var(--color-success)",
                      }
                    : undefined
                }
                onClick={() => {
                  if (inCart) {
                    remove(data.id);
                    return;
                  }
                  add({
                    id: data.id,
                    title: data.title,
                    price: data.price,
                    thumbnail: data.thumbnail,
                  });
                }}
              >
                {inCart ? (
                  <>
                    <Check size={16} /> В корзине
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} /> В корзину
                  </>
                )}
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => toggle(data.id)}
              style={{ color: fav ? "var(--color-primary)" : undefined }}
            >
              <Heart
                size={16}
                fill={fav ? "currentColor" : "none"}
                color={fav ? "var(--color-primary)" : "currentColor"}
              />
              {fav ? "В избранном" : "В избранное"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
