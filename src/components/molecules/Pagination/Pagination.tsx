import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./Pagination.module.css";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function range(a: number, b: number) {
  const out: number[] = [];
  for (let i = a; i <= b; i++) out.push(i);
  return out;
}

/**
 * Produces a compact list of page numbers with ellipses around the current page.
 * E.g. for 10 pages, current 5 -> [1, "...", 4, 5, 6, "...", 10]
 */
function buildPages(page: number, total: number): (number | "...")[] {
  if (total <= 7) return range(1, total);
  const pages: (number | "...")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  if (start > 2) pages.push("...");
  pages.push(...range(start, end));
  if (end < total - 1) pages.push("...");
  pages.push(total);
  return pages;
}

export const Pagination = ({ page, totalPages, onChange }: PaginationProps) => {
  if (totalPages <= 1) return null;
  const pages = buildPages(page, totalPages);

  return (
    <nav className={styles.nav} aria-label="Пагинация">
      <button
        type="button"
        className={styles.btn}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Предыдущая страница"
      >
        <ChevronLeft size={16} />
        <span className={styles.btnLabel}>Назад</span>
      </button>

      <ul className={styles.list}>
        {pages.map((p, i) =>
          p === "..." ? (
            <li key={`e${i}`} className={styles.ellipsis} aria-hidden>
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                className={cn(styles.page, p === page && styles.pageActive)}
                onClick={() => onChange(p)}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        className={styles.btn}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Следующая страница"
      >
        <span className={styles.btnLabel}>Вперёд</span>
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};
