import { useRegisterSW } from "virtual:pwa-register/react";
import { Toast } from "../../components/Toast";

export function UpdatePrompt() {
  const { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW();
  if (!needRefresh) return null;
  return (
    <Toast
      message="Nouvelle version disponible"
      actionLabel="Recharger"
      onAction={() => void updateServiceWorker(true)}
      onClose={() => setNeedRefresh(false)}
    />
  );
}
