import { FR } from "../../i18n/fr";
import { appStorage } from "../../store/safeStorage";
import styles from "./StorageBanner.module.css";

export function StorageBanner() {
  if (appStorage.isPersistent()) return null;
  return <p role="alert" className={styles.banner}>{FR.storageOff}</p>;
}
