import { LOCAL_PRODUCTS, paginateLocal, searchLocal } from "@/data/products";
import {
  type Product,
  type ProductList,
} from "@/schemas/product.schema";

export interface FetchProductsParams {
  limit?: number;
  skip?: number;
  search?: string;
  category?: string;
}

/**
 * Local catalog of quadcopters & accessories.
 * Network calls intentionally removed — items are curated locally.
 */
const simulate = <T,>(value: T, ms = 150): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export async function fetchProducts(params: FetchProductsParams = {}): Promise<ProductList> {
  const { limit = 30, skip = 0, search, category } = params;
  let items = [...LOCAL_PRODUCTS];
  if (category) items = items.filter((p) => p.category === category);
  if (search) items = searchLocal(items, search);
  return simulate(paginateLocal(items, limit, skip));
}

export async function fetchProduct(id: number | string): Promise<Product> {
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;
  const product = LOCAL_PRODUCTS.find((p) => p.id === numericId);
  if (!product) throw new Error("Товар не найден");
  return simulate(product);
}

export async function fetchCategories(): Promise<string[]> {
  return simulate(Array.from(new Set(LOCAL_PRODUCTS.map((p) => p.category))).sort());
}