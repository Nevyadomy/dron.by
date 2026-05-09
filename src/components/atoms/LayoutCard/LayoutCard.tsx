import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./LayoutCard.module.css";

export interface LayoutCardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padded?: boolean;
}

export const LayoutCard = ({
  hoverable,
  padded,
  className,
  ...props
}: LayoutCardProps) => (
  <div
    className={cn(
      styles.card,
      hoverable && styles.hoverable,
      padded && styles.padded,
      className,
    )}
    {...props}
  />
);
