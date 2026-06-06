import { createContext } from "react";

export interface AuthPromptValue {
  prompt: () => void;
}

export const AuthPromptContext = createContext<AuthPromptValue | undefined>(
  undefined,
);
