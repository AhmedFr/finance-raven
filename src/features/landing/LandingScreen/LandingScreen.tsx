import { ArrowRight, ShieldCheck } from "lucide-react";
import { Navigate, useNavigate } from "react-router";
import { Button } from "../../../components/Button";
import { useAppStore } from "../../../store/appStore";
import { ImportBackupButton } from "../../backup/ImportBackupButton";
import { FigureTile } from "../FigureTile";
import { POINTS } from "./LandingScreen.constants";
import styles from "./LandingScreen.module.css";

/** The first screen a new visitor sees, before the setup form. */
export function LandingScreen() {
  const onboarded = useAppStore((s) => s.onboarded);
  const navigate = useNavigate();
  if (onboarded) return <Navigate to="/" replace />;

  return (
    <main className={styles.main}>
      <header className={styles.brand}>
        <img src="/logo.svg" alt="" width={28} height={28} />
        <span>finance-raven</span>
      </header>

      <section className={styles.hero}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Pour les micro-entrepreneurs</p>
          <h1 className={styles.title}>Chaque euro encaissé, déjà trié.</h1>
          <p className={styles.lede}>
            Ce que tu peux dépenser, ce qui revient à l'URSSAF, ce qui part en impôt : le calcul est fait à chaque encaissement. Sans compte, sans serveur.
          </p>
        </div>
        <FigureTile />
      </section>

      <ul className={styles.points}>
        {POINTS.map(({ icon: Icon, title, text }) => (
          <li key={title} className={styles.point}>
            <span className={styles.icon}><Icon size={18} aria-hidden="true" /></span>
            <div>
              <h2 className={styles.pointTitle}>{title}</h2>
              <p className={styles.pointText}>{text}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className={styles.privacy}>
        <ShieldCheck size={18} aria-hidden="true" />
        Tes données restent sur cet appareil : pas de compte, pas de serveur, pas de traceur.
      </p>
      <p className={styles.disclaimer}>Estimations indicatives, pas un conseil fiscal.</p>

      <footer className={styles.actions}>
        <ImportBackupButton label="J'ai une sauvegarde" onImported={() => navigate("/", { replace: true })} />
        <Button variant="primary" onClick={() => navigate("/bienvenue")}>
          Commencer <ArrowRight size={18} aria-hidden="true" />
        </Button>
      </footer>
    </main>
  );
}
