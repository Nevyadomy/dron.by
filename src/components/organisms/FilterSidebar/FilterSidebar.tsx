import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { FilterCheckbox } from "@/components/molecules/FilterCheckbox";
import styles from "./FilterSidebar.module.css";

export interface PriceRange {
  label: string;
  min: number;
  max: number;
}

export interface FilterSidebarProps {
  categories: string[];
  brands: string[];
  priceRanges: PriceRange[];
  selectedCategories: string[];
  selectedBrands: string[];
  selectedPriceRange: number | null;
  inStockOnly: boolean;
  selectedRating: number | null;
  onCategoryToggle: (c: string) => void;
  onBrandToggle: (b: string) => void;
  onPriceRangeChange: (idx: number | null) => void;
  onInStockChange: (v: boolean) => void;
  onRatingChange: (r: number | null) => void;
  onReset: () => void;
}

const Section = ({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.section}>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className={styles.options}>{children}</div>}
    </div>
  );
};

export const FilterSidebar = ({
  categories,
  brands,
  priceRanges,
  selectedCategories,
  selectedBrands,
  selectedPriceRange,
  inStockOnly,
  selectedRating,
  onCategoryToggle,
  onBrandToggle,
  onPriceRangeChange,
  onInStockChange,
  onRatingChange,
  onReset,
}: FilterSidebarProps) => {
  const { t } = useTranslation();

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.title}>{t("filter.title")}</h3>

      <Section title={t("filter.category")}>
        {categories.map((c) => (
          <FilterCheckbox
            key={c}
            label={c}
            checked={selectedCategories.includes(c)}
            onChange={() => onCategoryToggle(c)}
          />
        ))}
      </Section>

      <Section title={t("filter.brand")}>
        {brands.map((b) => (
          <FilterCheckbox
            key={b}
            label={b}
            checked={selectedBrands.includes(b)}
            onChange={() => onBrandToggle(b)}
          />
        ))}
      </Section>

      <Section title={t("filter.price")}>
        {priceRanges.map((r, i) => (
          <FilterCheckbox
            key={r.label}
            name="price"
            type="radio"
            label={r.label}
            checked={selectedPriceRange === i}
            onChange={() =>
              onPriceRangeChange(selectedPriceRange === i ? null : i)
            }
          />
        ))}
      </Section>

      <Section title={t("filter.stock")}>
        <FilterCheckbox
          label={t("filter.inStockOnly")}
          checked={inStockOnly}
          onChange={() => onInStockChange(!inStockOnly)}
        />
      </Section>

      <Section title={t("filter.rating")}>
        {[4, 3, 2].map((r) => (
          <FilterCheckbox
            key={r}
            name="rating"
            type="radio"
            label={t("filter.ratingFrom", { value: r })}
            checked={selectedRating === r}
            onChange={() => onRatingChange(selectedRating === r ? null : r)}
          />
        ))}
      </Section>

      <button type="button" className={styles.resetBtn} onClick={onReset}>
        {t("filter.reset")}
      </button>
    </aside>
  );
};
