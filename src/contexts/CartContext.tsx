import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import type { ReactNode } from "react";
import {
  cartReducer,
  initialCart,
  type CartItem,
  type CartState,
} from "@/store/cartReducer";

const STORAGE_KEY = "cart_state";

interface CartContextValue {
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

const CartContext = createContext<CartContextValue | undefined>(undefined);

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

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
