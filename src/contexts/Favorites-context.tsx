import { createContext } from "react";

export interface FavoritesValue {
  ids: number[];
  count: number;
  isFavorite: (id: number) => boolean;
  toggle: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
}

export const FavoritesContext = createContext<FavoritesValue | undefined>(
  undefined,
);
