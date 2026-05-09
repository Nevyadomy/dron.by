import { Heart, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutCard } from "@/components/atoms/LayoutCard";
import { SmartImage } from "@/components/atoms/SmartImage";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/useAuth";
import { useAuthPrompt } from "@/contexts/AuthPromptContext";
import type { Product } from "@/schemas/product.schema";
import dronePlaceholder from "@/assets/images/common/drone-placeholder.png";
import { getProductPromo, applyDiscount } from "@/data/promotions";
import { cn } from "@/utils/cn";
import styles from "./ProductCard.module.css";

export interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { isFavorite, toggle } = useFavorites();
  const { state, add, remove } = useCart();
  const { isAuthenticated } = useAuth();
  const { prompt } = useAuthPrompt();
  const navigate = useNavigate();
  const inCart = state.items.some((i) => i.id === product.id);
  const fav = isFavorite(product.id);
  const inStock = (product.stock ?? 0) > 0;
  const image = product.thumbnail || dronePlaceholder;
  const promo = getProductPromo(product.id);
  const finalPrice =
    promo && promo.discount > 0
      ? applyDiscount(product.price, promo.discount)
      : product.price;

  return (
    <LayoutCard
      hoverable
      role="link"
      tabIndex={0}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("button, a")) return;
        navigate(`/product/${product.id}`);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate(`/product/${product.id}`);
      }}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.imageArea}>
        {promo && (
          <span className={styles.saleBadge}>{promo.badge ?? "Акция"}</span>
        )}
        <SmartImage src={image} alt={product.title} loading="lazy" />
      </div>
      <div className={styles.body}>
        <p className={styles.name}>
          <Link to={`/product/${product.id}`}>{product.title}</Link>
        </p>
        <p
          className={cn(
            styles.price,
            promo && promo.discount > 0 && styles.salePrice,
          )}
        >
          <span className={styles.priceWrap}>
            {promo && promo.discount > 0 && (
              <span className={styles.oldPrice}>
                {product.price} <i className="nbrb-icon">BYN</i>
              </span>
            )}
            <span>
              {finalPrice} <i className="nbrb-icon">BYN</i> <span>/ шт</span>
            </span>
          </span>
        </p>
        <div className={styles.footer}>
          <span
            className={cn(
              styles.stock,
              inStock ? styles.inStock : styles.outOfStock,
            )}
          >
            <span className={styles.dot} />
            {inStock ? "В наличии" : "Нет в наличии"}
          </span>
          <div className={styles.actions}>
            <button
              type="button"
              aria-label="В избранное"
              title="В избранное"
              onClick={() => toggle(product.id)}
              className={cn(styles.favBtn, fav && styles.active)}
            >
              <Heart size={18} fill={fav ? "currentColor" : "none"} />
            </button>
            <button
              type="button"
              aria-label={
                !inStock
                  ? "Товар недоступен"
                  : inCart
                    ? "Удалить из корзины"
                    : "В корзину"
              }
              title={
                !inStock
                  ? "Товар недоступен"
                  : inCart
                    ? "Удалить из корзины"
                    : "В корзину"
              }
              disabled={!inStock}
              onClick={() => {
                if (!inStock) return;
                if (!isAuthenticated) {
                  prompt();
                  return;
                }
                if (inCart) {
                  remove(product.id);
                  return;
                }
                add({
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  thumbnail: product.thumbnail,
                });
              }}
              className={cn(styles.cartBtn, inCart && styles.active)}
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </LayoutCard>
  );
};
