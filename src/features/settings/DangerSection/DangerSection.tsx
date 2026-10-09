import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { useAppStore } from "../../../store/appStore";

export function DangerSection() {
  const resetAll = useAppStore((s) => s.resetAll);
  const navigate = useNavigate();
  const [armed, setArmed] = useState(false);
  const onClick = () => {
    if (!armed) { setArmed(true); return; }
    resetAll();
    navigate("/bienvenue", { replace: true });
  };
  return (
    <Card title="Zone sensible">
      <p>Efface toutes les données de cet appareil. Exporte une sauvegarde avant si tu veux les garder.</p>
      <div><Button variant="danger" onClick={onClick}>{armed ? "Confirmer : tout effacer" : "Effacer toutes les données"}</Button></div>
    </Card>
  );
}
