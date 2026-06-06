import s from "./SkeletonCard.module.css";
import { cn } from "@/utils/cn";

export const SkeletonCard = () => (
  <div className={cn(s.card, s.pulse)} aria-hidden>
    <div className={s.image} />
    <div className={s.body}>
      <div className={cn(s.line, s.lineFull)} />
      <div className={cn(s.line, s.lineMid)} />
      <div className={cn(s.line, s.lineShort)} />
      <div className={s.footer}>
        <div className={s.price} />
        <div className={s.btn} />
      </div>
    </div>
  </div>
);

export const ProductPageSkeleton = () => (
  <div className={cn(s.productLayout, s.pulse)} aria-hidden>
    <div className={s.productImage} />
    <div className={s.productInfo}>
      <div className={s.lineHeading} />
      <div className={cn(s.line, s.lineShort)} />
      <div className={s.linePrice} />
      <div className={s.lineDesc} />
      <div className={s.lineDesc} />
      <div className={cn(s.lineDesc, s.lineMid)} />
      <div className={s.btnLg} />
    </div>
  </div>
);
