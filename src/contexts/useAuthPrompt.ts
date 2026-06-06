import { useContext } from "react";
import { AuthPromptContext } from "./auth-prompt-context";

export function useAuthPrompt() {
  const ctx = useContext(AuthPromptContext);
  if (!ctx)
    throw new Error("useAuthPrompt must be used within AuthPromptProvider");
  return ctx;
}
