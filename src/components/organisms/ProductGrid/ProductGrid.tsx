import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/molecules/ProductCard";
import { SkeletonCard } from "@/components/molecules/SkeletonCard";
import type { Product } from "@/schemas/product.schema";
import styles from "./ProductGrid.module.css";

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  error?: string | null;
  skeletonCount?: number;
}

export const ProductGrid = ({
  products,
  isLoading,
  error,
  skeletonCount = 20,
}: ProductGridProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.empty}>
        <p>{t("productGrid.error")}</p>
        <p>{error}</p>
      </div>
    );
  }
  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <p>{t("productGrid.notFound")}</p>
        <p>{t("productGrid.notFoundHint")}</p>
      </div>
    );
  }
  return (
    <div className={styles.grid}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};
