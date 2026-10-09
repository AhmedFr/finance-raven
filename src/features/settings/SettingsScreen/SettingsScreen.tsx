import { ScreenHeader } from "../../../components/ScreenHeader";
import { AboutSection } from "../AboutSection";
import { BackupSection } from "../BackupSection";
import { DangerSection } from "../DangerSection";
import { ProfileSection } from "../ProfileSection";
import { RatesSection } from "../RatesSection";
import { ShareSection } from "../ShareSection";
import { SourcesSection } from "../SourcesSection";
import styles from "./SettingsScreen.module.css";

export function SettingsScreen() {
  return (
    <>
      <ScreenHeader eyebrow="Tout reste sur cet appareil" title="Réglages" />
      <ProfileSection />
      <SourcesSection />
      <RatesSection />
      <div className={styles.grid}>
        <BackupSection />
        <ShareSection />
      </div>
      <DangerSection />
      <AboutSection />
    </>
  );
}
