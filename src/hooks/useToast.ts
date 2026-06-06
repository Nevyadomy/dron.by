import { useContext } from "react";
import { ToastContext } from "@/contexts/ToastContext";

export function useToast() {
  const c = useContext(ToastContext);
  if (!c) throw new Error("useToast must be used within ToastProvider");
  return c;
}
