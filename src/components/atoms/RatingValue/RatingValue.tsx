import { Star } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./RatingValue.module.css";
import { useTranslation } from "react-i18next";

export interface RatingValueProps {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}

/**
 * Single filled star + numeric rating value. No outline.
 * Optionally shows the review count next to the rating.
 */
export const RatingValue = ({
  value,
  count,
  size = 14,
  className,
}: RatingValueProps) => {
  const { t } = useTranslation();
  const clamped = Math.max(0, Math.min(5, value));
  const label = clamped.toFixed(1).replace(".", ",");

  const getRatingWord = (n: number) => {
    return t("rating.count", { count: n });
  };

  return (
    <span
      className={cn(styles.wrap, className)}
      aria-label={t("rating.aria_label", { value: label, max: 5 })}
    >
      <span className={styles.star}>
        <Star size={size} strokeWidth={0} fill="currentColor" />
      </span>
      <span className={styles.value}>{label}</span>
      {typeof count === "number" && count > 0 && (
        <span className={styles.count}>
          · {count} {getRatingWord(count)}
        </span>
      )}
    </span>
  );
};
