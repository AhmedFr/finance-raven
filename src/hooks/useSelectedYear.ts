import { useMemo } from "react";
import { yearOf } from "../domain/dates/dates";
import { availableYears } from "../domain/summary/summary";
import { useAppStore } from "../store/appStore";
import { useToday } from "./useToday";

export function useSelectedYear() {
  const profile = useAppStore((s) => s.profile);
  const entries = useAppStore((s) => s.entries);
  const uiYear = useAppStore((s) => s.ui.year);
  const setYear = useAppStore((s) => s.setYear);
  const today = useToday();
  const years = useMemo(() => availableYears(profile, entries, today), [profile, entries, today]);
  const year = uiYear != null && years.includes(uiYear) ? uiYear : yearOf(today);
  return { year, years, setYear, today };
}
