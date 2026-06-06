import { Star } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./RatingStars.module.css";
import { useTranslation } from "react-i18next";

export interface RatingStarsProps {
  value: number;
  max?: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}

/**
 * Renders 5 outline stars with a clipped overlay of filled stars to support
 * fractional ratings (e.g. 4.7). Uses currentColor for the filled portion so
 * the accent color can be set via CSS.
 */
export const RatingStars = ({
  value,
  max = 5,
  size = 14,
  showValue = false,
  className,
}: RatingStarsProps) => {
  const { t } = useTranslation();
  const clamped = Math.max(0, Math.min(max, value));
  const pct = (clamped / max) * 100;

  return (
    <span
      className={cn(styles.wrap, className)}
      aria-label={t("rating.aria_label", { value: clamped.toFixed(1), max })}
    >
      <span
        className={styles.stack}
        style={{ width: size * max + (max - 1) * 2 }}
      >
        <span className={styles.base}>
          {Array.from({ length: max }).map((_, i) => (
            <Star key={i} size={size} strokeWidth={1.6} />
          ))}
        </span>
        <span className={styles.fill} style={{ width: `${pct}%` }}>
          {Array.from({ length: max }).map((_, i) => (
            <Star key={i} size={size} strokeWidth={1.6} fill="currentColor" />
          ))}
        </span>
      </span>
      {showValue && <span className={styles.value}>{clamped.toFixed(1)}</span>}
    </span>
  );
};
