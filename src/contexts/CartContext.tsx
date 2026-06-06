import { useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import { cartReducer, initialCart, type CartState } from "@/store/cartReducer";
import { CartContext, type CartContextValue } from "./cart-context";

const STORAGE_KEY = "cart_state";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCart);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw)
        dispatch({ type: "HYDRATE", payload: JSON.parse(raw) as CartState });
    } catch {
      /* ignore */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const value = useMemo<CartContextValue>(() => {
    const totalCount = state.items.reduce((s, i) => s + i.quantity, 0);
    const totalPrice = state.items.reduce(
      (s, i) => s + i.quantity * i.price,
      0,
    );
    return {
      state,
      totalCount,
      totalPrice,
      add: (item, quantity) =>
        dispatch({ type: "ADD", payload: { ...item, quantity } }),
      remove: (id) => dispatch({ type: "REMOVE", payload: { id } }),
      increment: (id) => dispatch({ type: "INCREMENT", payload: { id } }),
      decrement: (id) => dispatch({ type: "DECREMENT", payload: { id } }),
      setQuantity: (id, quantity) =>
        dispatch({ type: "SET_QUANTITY", payload: { id, quantity } }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
