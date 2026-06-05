import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
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
}: FilterSidebarProps) => (
  <aside className={styles.sidebar}>
    <h3 className={styles.title}>Фильтры</h3>

    <Section title="Категория">
      {categories.map((c) => (
        <FilterCheckbox
          key={c}
          label={c}
          checked={selectedCategories.includes(c)}
          onChange={() => onCategoryToggle(c)}
        />
      ))}
    </Section>

    <Section title="Бренд">
      {brands.map((b) => (
        <FilterCheckbox
          key={b}
          label={b}
          checked={selectedBrands.includes(b)}
          onChange={() => onBrandToggle(b)}
        />
      ))}
    </Section>

    <Section title="Цена">
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

    <Section title="Наличие">
      <FilterCheckbox
        label="Только в наличии"
        checked={inStockOnly}
        onChange={() => onInStockChange(!inStockOnly)}
      />
    </Section>

    <Section title="Рейтинг">
      {[4, 3, 2].map((r) => (
        <FilterCheckbox
          key={r}
          name="rating"
          type="radio"
          label={`От ${r} и выше`}
          checked={selectedRating === r}
          onChange={() => onRatingChange(selectedRating === r ? null : r)}
        />
      ))}
    </Section>

    <button type="button" className={styles.resetBtn} onClick={onReset}>
      Сбросить фильтры
    </button>
  </aside>
);
