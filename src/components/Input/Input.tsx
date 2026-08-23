import type { InputHTMLAttributes } from "react";

import styles from "./Input.module.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = ({
  label,
  error,
  id,
  className,
  ...props
}: InputProps) => {
  return (
    <div className={styles.inputGroup}>
      {label && (
        <label
          htmlFor={id}
          className={styles.label}
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`${styles.input} ${
          error ? styles.inputError : ""
        } ${className ?? ""}`}
        {...props}
      />

      {error && (
        <span className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;