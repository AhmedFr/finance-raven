import type { ButtonProps } from "./Button.types";
import { cx } from "../../lib/cx";
import styles from "./Button.module.css";

export function Button({ variant = "secondary", size = "md", block = false, className, type = "button", ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(styles.button, styles[variant], size === "sm" && styles.sm, block && styles.block, className)}
      {...rest}
    />
  );
}
