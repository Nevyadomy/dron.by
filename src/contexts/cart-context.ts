import { createContext } from "react";
import type { CartItem, CartState } from "@/store/cartReducer";

export interface CartContextValue {
  state: CartState;
  totalCount: number;
  totalPrice: number;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  remove: (id: number) => void;
  increment: (id: number) => void;
  decrement: (id: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  clear: () => void;
}

export const CartContext = createContext<CartContextValue | undefined>(
  undefined,
);
