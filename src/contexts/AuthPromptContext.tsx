import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import { AuthRequiredModal } from "@/components/organisms/AuthRequiredModal";

interface AuthPromptValue {
  prompt: () => void;
}

const AuthPromptContext = createContext<AuthPromptValue | undefined>(undefined);

export function AuthPromptProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const prompt = useCallback(() => setOpen(true), []);
  return (
    <AuthPromptContext.Provider value={{ prompt }}>
      {children}
      <AuthRequiredModal open={open} onClose={() => setOpen(false)} />
    </AuthPromptContext.Provider>
  );
}

export function useAuthPrompt() {
  const ctx = useContext(AuthPromptContext);
  if (!ctx)
    throw new Error("useAuthPrompt must be used within AuthPromptProvider");
  return ctx;
}
