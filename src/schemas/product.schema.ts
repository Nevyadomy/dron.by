import { z } from "zod";
import type { ProductSpecs } from "./productSpecs.schema";

export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional().default(""),
  price: z.number(),
  brand: z.string().optional().default("Unbranded"),
  category: z.string(),
  thumbnail: z.string().url().optional(),
  images: z.array(z.string()).optional().default([]),
  stock: z.number().optional().default(0),
  rating: z.number().optional().default(0),
  /**
   * Detailed product spec used by the comparison page. Optional — only
   * present on products we have authored detailed data for.
   */
  spec: z
    .custom<ProductSpecs>((v) => typeof v === "object" && v !== null)
    .optional(),
});

export const productListSchema = z.object({
  products: z.array(productSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type Product = z.infer<typeof productSchema>;
export type ProductList = z.infer<typeof productListSchema>;
