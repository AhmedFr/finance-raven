import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { Button } from "../../../components/Button";
import { ScreenHeader } from "../../../components/ScreenHeader";
import { useToday } from "../../../hooks/useToday";
import { useAppStore } from "../../../store/appStore";
import { ImportBackupButton } from "../../backup/ImportBackupButton";
import { ActivityStep } from "../ActivityStep";
import { ProfileStep } from "../ProfileStep";
import { SourcesStep } from "../SourcesStep";
import { useOnboardingDraft } from "../useOnboardingDraft";
import { STEPS } from "./OnboardingScreen.constants";
import styles from "./OnboardingScreen.module.css";

export function OnboardingScreen() {
  const onboarded = useAppStore((s) => s.onboarded);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const loadDemo = useAppStore((s) => s.loadDemo);
  const navigate = useNavigate();
  const today = useToday();
  const draft = useOnboardingDraft(today);
  const [step, setStep] = useState(0);

  if (onboarded) return <Navigate to="/" replace />;
  const goHome = () => navigate("/", { replace: true });
  const finish = () => { completeOnboarding(draft.profile, draft.cleanSources()); goHome(); };
  const isLast = step === STEPS.length - 1;

  return (
    <main className={styles.main}>
      <ScreenHeader eyebrow={`Étape ${step + 1} sur ${STEPS.length} · ${STEPS[step]}`} title="Bienvenue" />
      <p className={styles.lede}>finance-raven calcule ce que tu dois garder pour l'URSSAF et les impôts. Tout reste sur cet appareil.</p>
      {step === 0 && <ActivityStep value={draft.profile.activity} onChange={(activity) => draft.patchProfile({ activity })} />}
      {step === 1 && <ProfileStep profile={draft.profile} onChange={draft.patchProfile} />}
      {step === 2 && <SourcesStep sources={draft.sources} onAdd={draft.addSource} onUpdate={draft.updateSource} onRemove={draft.removeSource} />}
      <div className={styles.nav}>
        {step > 0 && <Button onClick={() => setStep(step - 1)}>Retour</Button>}
        {isLast
          ? <Button variant="primary" onClick={finish}>Terminer</Button>
          : <Button variant="primary" onClick={() => setStep(step + 1)}>Continuer</Button>}
      </div>
      <div className={styles.alt}>
        <Button variant="ghost" onClick={() => { loadDemo(today); goHome(); }}>Essayer avec des données de démo</Button>
        <ImportBackupButton label="J'ai une sauvegarde" onImported={goHome} />
      </div>
    </main>
  );
}
