import type { ReactNode } from "react";
import styles from "./FormField.module.css";

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  children: ReactNode;
}

export const FormField = ({
  label,
  htmlFor,
  error,
  children,
}: FormFieldProps) => (
  <div className={styles.field}>
    <label htmlFor={htmlFor} className={styles.label}>
      {label}
    </label>
    {children}
    <span className={styles.error}>{error ?? ""}</span>
  </div>
);
