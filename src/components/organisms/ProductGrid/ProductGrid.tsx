import { ProductCard } from "@/components/molecules/ProductCard";
import type { Product } from "@/schemas/product.schema";
import styles from "./ProductGrid.module.css";

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  error?: string | null;
}

export const ProductGrid = ({ products, isLoading, error }: ProductGridProps) => {
  if (isLoading) {
    return <div className={styles.loading}>Загрузка товаров…</div>;
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