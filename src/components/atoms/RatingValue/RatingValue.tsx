import { Star } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./RatingValue.module.css";

export interface RatingValueProps {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}

function ratingsWord(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "оценка";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "оценки";
  return "оценок";
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
  const clamped = Math.max(0, Math.min(5, value));
  const label = clamped.toFixed(1).replace(".", ",");
  return (
    <span
      className={cn(styles.wrap, className)}
      aria-label={`Рейтинг ${label} из 5`}
    >
      <span className={styles.star}>
        <Star size={size} strokeWidth={0} fill="currentColor" />
      </span>
      <span className={styles.value}>{label}</span>
      {typeof count === "number" && count > 0 && (
        <span className={styles.count}>
          · {count} {ratingsWord(count)}
        </span>
      )}
    </span>
  );
};
