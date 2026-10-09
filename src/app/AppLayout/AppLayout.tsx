import { Outlet } from "react-router";
import { TabDock } from "../../components/TabDock";
import { UpdatePrompt } from "../../pwa/UpdatePrompt";
import { StorageBanner } from "../../pwa/StorageBanner";
import styles from "./AppLayout.module.css";

export function AppLayout() {
  return (
    <>
      <StorageBanner />
      <main className={styles.main}>
        <Outlet />
      </main>
      <TabDock />
      <UpdatePrompt />
    </>
  );
}
