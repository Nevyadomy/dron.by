import { useCallback, useState, type ReactNode } from "react";
import { AuthRequiredModal } from "@/components/organisms/AuthRequiredModal";
import { AuthPromptContext } from "./auth-prompt-context";

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
