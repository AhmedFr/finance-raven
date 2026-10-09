import { useMemo } from "react";
import { todayIso } from "../domain/dates/dates";

export const useToday = (): string => useMemo(() => todayIso(), []);
