import { Smartphone } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { isIos, isStandalone, readDismissed, useInstallPrompt, writeDismissed } from "../useInstallPrompt";

export function InstallHint() {
  const { canPrompt, prompt } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(readDismissed);
  const ios = isIos();
  if (dismissed || isStandalone() || (!ios && !canPrompt)) return null;
  const dismiss = () => { writeDismissed(); setDismissed(true); };
  return (
    <Card tone="white" icon={Smartphone} title="Installer finance-raven" action={<Button size="sm" variant="ghost" onClick={dismiss}>Plus tard</Button>}>
      {ios ? (
        <p>Dans Safari, touche <strong>Partager</strong> puis <strong>« Sur l'écran d'accueil »</strong>. L'app s'ouvre en plein écran et marche hors ligne. Installe l'app d'abord : les données saisies dans Safari ne sont pas reprises par l'app installée (exporte/importe une sauvegarde si besoin).</p>
      ) : (
        <div>
          <p>Installe l'app d'abord : les données saisies dans Safari ne sont pas reprises par l'app installée (exporte/importe une sauvegarde si besoin).</p>
          <Button variant="primary" onClick={prompt}>Installer l'app</Button>
        </div>
      )}
    </Card>
  );
}
