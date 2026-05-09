export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail?: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: "HYDRATE"; payload: CartState }
  | { type: "ADD"; payload: Omit<CartItem, "quantity"> & { quantity?: number } }
  | { type: "REMOVE"; payload: { id: number } }
  | { type: "INCREMENT"; payload: { id: number } }
  | { type: "DECREMENT"; payload: { id: number } }
  | { type: "SET_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR" };

export const initialCart: CartState = { items: [] };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "ADD": {
      const qty = action.payload.quantity ?? 1;
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + qty } : i,
          ),
        };
      }
      return { items: [...state.items, { ...action.payload, quantity: qty }] };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.payload.id) };
    case "INCREMENT":
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      };
    case "DECREMENT":
      return {
        items: state.items
          .map((i) => (i.id === action.payload.id ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0),
      };
    case "SET_QUANTITY":
      return {
        items: state.items
          .map((i) =>
            i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i,
          )
          .filter((i) => i.quantity > 0),
      };
    case "CLEAR":
      return initialCart;
    default:
      return state;
  }
}