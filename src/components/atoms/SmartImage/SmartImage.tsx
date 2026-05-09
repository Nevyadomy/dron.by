import { type ImgHTMLAttributes, useState } from "react";
import { cn } from "@/utils/cn";
import placeholderLight from "@/assets/images/common/img_placeholder-light.png";
import placeholderDark from "@/assets/images/common/img_placeholder-dark.png";
import styles from "./SmartImage.module.css";

/**
 * Img wrapper that shows a theme-aware placeholder image while loading.
 * Falls back to the placeholder if the source fails to load.
 */
export const SmartImage = ({
  className,
  onLoad,
  onError,
  src,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement>) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark";
  const finalSrc = errored
    ? isDark
      ? placeholderDark
      : placeholderLight
    : src;

  return (
    <img
      {...rest}
      src={finalSrc}
      data-loaded={loaded || undefined}
      className={cn(styles.smart, className)}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      onError={(e) => {
        setErrored(true);
        setLoaded(true);
        onError?.(e);
      }}
    />
  );
};
