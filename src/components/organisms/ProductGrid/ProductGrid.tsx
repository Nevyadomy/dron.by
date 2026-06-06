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
        <p>Ошибка загрузки</p>
        <p>{error}</p>
      </div>
    );
  }
  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Ничего не найдено</p>
        <p>Попробуйте изменить параметры фильтрации</p>
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
