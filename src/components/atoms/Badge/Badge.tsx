import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./Badge.module.css";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "success" | "destructive" | "muted";
  floating?: boolean;
}

export const Badge = ({
  variant = "primary",
  floating,
  className,
  ...props
}: BadgeProps) => (
  <span
    className={cn(
      styles.badge,
      variant !== "primary" && styles[variant],
      floating && styles.floating,
      className,
    )}
    {...props}
  />
);
