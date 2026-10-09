import { NavLink } from "react-router";
import type { TabDockProps } from "./TabDock.types";
import { cx } from "../../lib/cx";
import { TAB_ITEMS } from "./TabDock.constants";
import styles from "./TabDock.module.css";

export function TabDock({ items = TAB_ITEMS }: TabDockProps) {
  return (
    <nav className={styles.dock} aria-label="Navigation principale">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => cx(styles.item, isActive && styles.active)}>
          <Icon size={20} aria-hidden="true" />
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
