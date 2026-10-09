import { Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { shareApp } from "../../../lib/share";

const MESSAGES = { shared: null, copied: "Lien copié.", failed: "Impossible de partager : copie l'adresse depuis le navigateur." } as const;

export function ShareSection() {
  const [message, setMessage] = useState<string | null>(null);
  return (
    <Card icon={Share2} title="Partager l'app">
      <p>Envoie le lien à d'autres micro-entrepreneurs. Seule l'app est partagée : tes données restent sur ton appareil.</p>
      <div><Button onClick={async () => setMessage(MESSAGES[await shareApp(window.location.origin)])}>Partager le lien</Button></div>
      {message && <p role="status">{message}</p>}
    </Card>
  );
}
