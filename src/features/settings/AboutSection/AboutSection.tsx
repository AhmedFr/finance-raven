import { Info } from "lucide-react";
import { Card } from "../../../components/Card";
import { FR } from "../../../i18n/fr";
import styles from "./AboutSection.module.css";

const LINKS = [
  { href: "https://www.autoentrepreneur.urssaf.fr", label: "URSSAF auto-entrepreneur" },
  { href: "https://www.impots.gouv.fr", label: "impots.gouv.fr" },
  { href: "https://entreprendre.service-public.gouv.fr", label: "Entreprendre · Service public" },
];

export function AboutSection() {
  return (
    <Card icon={Info} title="À propos">
      <p>{FR.disclaimer}</p>
      <ul className={styles.links}>
        {LINKS.map((l) => <li key={l.href}><a href={l.href} target="_blank" rel="noreferrer">{l.label}</a></li>)}
      </ul>
      <p className={styles.version}>finance-raven v{__APP_VERSION__} · aucune donnée envoyée, aucun traceur.</p>
    </Card>
  );
}
