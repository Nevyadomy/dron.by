import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { ComparisonContext } from "./Comparison-context";
import { type ComparisonValue } from "./Comparison-context";

export const COMPARE_LIMIT = 5;
const STORAGE_KEY = "comparison_list";

type State = { ids: number[] };
type Action =
  | { type: "HYDRATE"; payload: State }
  | { type: "ADD"; id: number }
  | { type: "REMOVE"; id: number }
  | { type: "CLEAR" };

function reducer(state: State, a: Action): State {
  switch (a.type) {
    case "HYDRATE":
      return a.payload;
    case "ADD":
      if (state.ids.includes(a.id) || state.ids.length >= COMPARE_LIMIT)
        return state;
      return { ids: [...state.ids, a.id] };
    case "REMOVE":
      return { ids: state.ids.filter((x) => x !== a.id) };
    case "CLEAR":
      return { ids: [] };
    default:
      return state;
  }
}

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { ids: [] });
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const ids = JSON.parse(raw) as number[];
        if (Array.isArray(ids)) dispatch({ type: "HYDRATE", payload: { ids } });
      }
    } catch {
      /* ignore */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids));
    } catch {
      /* ignore */
    }
  }, [state.ids]);

  const add = useCallback<ComparisonValue["add"]>(
    (id) => {
      if (state.ids.includes(id)) return "exists";
      if (state.ids.length >= COMPARE_LIMIT) return "full";
      dispatch({ type: "ADD", id });
      return "added";
    },
    [state.ids],
  );

  return (
    <ComparisonContext.Provider
      value={{
        ids: state.ids,
        count: state.ids.length,
        isFull: state.ids.length >= COMPARE_LIMIT,
        isInComparison: (id) => state.ids.includes(id),
        add,
        remove: (id) => dispatch({ type: "REMOVE", id }),
        clear: () => dispatch({ type: "CLEAR" }),
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}
