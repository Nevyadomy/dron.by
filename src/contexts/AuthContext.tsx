import { useReducer, type ReactNode } from "react";
import { AuthContext, type AuthState, type AuthUser } from "./auth-context";

type AuthAction =
  | { type: "LOGIN"; payload: AuthUser }
  | { type: "LOGOUT" }
  | { type: "HYDRATE"; payload: AuthUser | null };

const STORAGE_KEY = "auth_user";

const initialState: AuthState = { user: null, isAuthenticated: false };

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
    case "HYDRATE":
      if (action.payload)
        return { user: action.payload, isAuthenticated: true };
      return state;
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
}

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    reducer,
    undefined as unknown as AuthState,
    () => {
      const user = readStoredUser();
      return user ? { user, isAuthenticated: true } : initialState;
    },
  );
  const isHydrated = true;

  const login = (user: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    dispatch({ type: "LOGIN", payload: user });
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, isHydrated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
