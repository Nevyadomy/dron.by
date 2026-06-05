import styles from "./FilterCheckbox.module.css";

export interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  type?: "checkbox" | "radio";
  name?: string;
}

export const FilterCheckbox = ({
  label,
  checked,
  onChange,
  type = "checkbox",
  name,
}: FilterCheckboxProps) => (
  <label className={styles.label}>
    <input
      type={type}
      name={name}
      checked={checked}
      onChange={onChange}
      className={type === "radio" ? "checkbox-radio" : "checkbox"}
    />
    {label}
  </label>
);
