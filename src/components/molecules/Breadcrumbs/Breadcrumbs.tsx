import { Link } from "react-router-dom";
import styles from "./Breadcrumbs.module.css";

export interface Crumb {
  label: string;
  to?: string;
}

export interface BreadcrumbsProps {
  items: Crumb[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
  <nav aria-label="breadcrumb" className={styles.crumbs}>
    {items.map((c, i) => {
      const last = i === items.length - 1;
      return (
        <span key={`${c.label}-${i}`} style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
          {i > 0 && <span className={styles.sep}>/</span>}
          {c.to && !last ? (
            <Link to={c.to} className={styles.link}>
              {c.label}
            </Link>
          ) : (
            <span className={styles.current}>{c.label}</span>
          )}
        </span>
      );
    })}
  </nav>
);