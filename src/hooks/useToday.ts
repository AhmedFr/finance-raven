import { useEffect, useState } from "react";
import { todayIso } from "../domain/dates/dates";

export const useToday = (): string => {
  const [today, setToday] = useState(todayIso);
  useEffect(() => {
    const refresh = () => setToday(todayIso());
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", refresh);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  return today;
};
