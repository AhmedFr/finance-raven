import { X } from "lucide-react";
import type { ToastProps } from "./Toast.types";
import styles from "./Toast.module.css";

export function Toast({ message, actionLabel, onAction, onClose }: ToastProps) {
  return (
    <div className={styles.toast} role="status">
      <span>{message}</span>
      {actionLabel && onAction && (
        <button type="button" className={styles.action} onClick={onAction}>{actionLabel}</button>
      )}
      <button type="button" className={styles.close} onClick={onClose} aria-label="Fermer">
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
