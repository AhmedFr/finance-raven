import { ScreenHeader } from "../../../components/ScreenHeader";
import { YearSwitch } from "../../../components/YearSwitch";
import { getPreset } from "../../../domain/rules/rules";
import { ChecksCard } from "../ChecksCard";
import { KeepAsideHero } from "../KeepAsideHero";
import { KpiRow } from "../KpiRow";
import { MonthlyChartCard } from "../MonthlyChartCard";
import { useHomeData } from "../useHomeData";

export function HomeScreen() {
  const d = useHomeData();
  return (
    <>
      <ScreenHeader eyebrow={getPreset(d.profile.activity).label} title="finance-raven">
        <YearSwitch years={d.years} value={d.year} onChange={d.setYear} />
      </ScreenHeader>
      <KeepAsideHero keep={d.keep} vfl={d.profile.versementLiberatoire} nextDueStatus={d.nextDueStatus} />
      <KpiRow year={d.year} stats={d.stats} netReceived={d.netReceived} monthlyBudget={d.profile.monthlyBudget} cap={d.cap} isCreationYear={d.isCreationYear} />
      <MonthlyChartCard year={d.year} series={d.series} />
      <ChecksCard year={d.year} checks={d.checks} />
    </>
  );
}
