import { ScreenHeader } from "../../../components/ScreenHeader";
import { YearSwitch } from "../../../components/YearSwitch";
import { getPreset } from "../../../domain/rules/rules";
import { useAppStore } from "../../../store/appStore";
import { IrCard } from "../IrCard";
import { ThresholdsCard } from "../ThresholdsCard";
import { UrssafCard } from "../UrssafCard";
import { useTaxesData } from "../useTaxesData";
import styles from "./TaxesScreen.module.css";

export function TaxesScreen() {
  const d = useTaxesData();
  const setPaid = useAppStore((s) => s.setPaid);
  return (
    <>
      <ScreenHeader eyebrow={getPreset(d.profile.activity).label} title="Impôts">
        <YearSwitch years={d.years} value={d.year} onChange={d.setYear} />
      </ScreenHeader>
      <UrssafCard year={d.year} frequency={d.profile.urssafFrequency} rows={d.rows} onTogglePaid={(key, v) => setPaid("urssaf", key, v)} />
      <div className={styles.grid}>
        <IrCard
          year={d.year} today={d.today} stats={d.stats} comparison={d.comparison}
          vfl={d.profile.versementLiberatoire} vflRate={d.rates.vflRate} vflDeadline={d.vflDeadline}
          irPaid={Boolean(d.paid.ir[String(d.year)])} cfePaid={Boolean(d.paid.cfe[String(d.year)])}
          onToggle={(kind, v) => setPaid(kind, String(d.year), v)}
        />
        <ThresholdsCard year={d.year} ca={d.stats.ca} caFR={d.stats.caFR} cap={d.cap} tva={d.tva} nextYearCa={d.nextYearCa} isCreationYear={d.isCreationYear} />
      </div>
    </>
  );
}
