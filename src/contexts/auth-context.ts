import { createContext } from "react";
export interface AuthUser {
  id: number | string;
  email: string;
  name?: string;
}
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}
export interface AuthContextValue extends AuthState {
  isHydrated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
