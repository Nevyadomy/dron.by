import { createContext } from "react";

interface ToastCtx {
  show: (t: {
    text: string;
    actionTo?: string;
    actionLabel?: string;
    variant?: "info" | "warning";
    duration?: number;
  }) => void;
}

export const ToastContext = createContext<ToastCtx | undefined>(undefined);
