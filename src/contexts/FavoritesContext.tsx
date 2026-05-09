import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import type { ReactNode } from "react";

interface FavoritesState {
  ids: number[];
}

type Action =
  | { type: "HYDRATE"; payload: FavoritesState }
  | { type: "TOGGLE"; payload: number }
  | { type: "REMOVE"; payload: number }
  | { type: "CLEAR" };

const STORAGE_KEY = "favorites_state";
const initial: FavoritesState = { ids: [] };

function reducer(state: FavoritesState, action: Action): FavoritesState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "TOGGLE":
      return state.ids.includes(action.payload)
        ? { ids: state.ids.filter((id) => id !== action.payload) }
        : { ids: [...state.ids, action.payload] };
    case "REMOVE":
      return { ids: state.ids.filter((id) => id !== action.payload) };
    case "CLEAR":
      return initial;
    default:
      return state;
  }
}

interface FavoritesContextValue {
  ids: number[];
  count: number;
  isFavorite: (id: number) => boolean;
  toggle: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw)
        dispatch({
          type: "HYDRATE",
          payload: JSON.parse(raw) as FavoritesState,
        });
    } catch {
      /* ignore */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <FavoritesContext.Provider
      value={{
        ids: state.ids,
        count: state.ids.length,
        isFavorite: (id) => state.ids.includes(id),
        toggle: (id) => dispatch({ type: "TOGGLE", payload: id }),
        remove: (id) => dispatch({ type: "REMOVE", payload: id }),
        clear: () => dispatch({ type: "CLEAR" }),
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
