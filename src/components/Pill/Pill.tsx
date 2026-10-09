import type { PillProps } from "./Pill.types";
import { cx } from "../../lib/cx";
import styles from "./Pill.module.css";

export function Pill({ tone = "neutral", children }: PillProps) {
  return <span className={cx(styles.pill, styles[tone])}>{children}</span>;
}
