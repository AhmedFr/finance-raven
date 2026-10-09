import { useCallback, useEffect, useRef } from "react";
import { monthIndexOfIso, yearOf } from "../../domain/dates/dates";
import type { EntryGroup } from "./groupEntries";

/** Returns a ref-callback factory; on mount and on year change, scrolls the current month's group to the top. */
export function useScrollToCurrentMonth(groups: EntryGroup[], year: number, today: string) {
  const nodes = useRef(new Map<number, HTMLElement>());

  useEffect(() => {
    if (year !== yearOf(today) || groups.length === 0) return;
    const current = monthIndexOfIso(today);
    const anchor = [...groups].reverse().find((g) => g.monthIndex <= current) ?? groups[0];
    nodes.current.get(anchor.monthIndex)?.scrollIntoView?.({ block: "start", behavior: "auto" });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when the year changes
  }, [year]);

  return useCallback((monthIndex: number) => (node: HTMLElement | null) => {
    if (node) nodes.current.set(monthIndex, node);
    else nodes.current.delete(monthIndex);
  }, []);
}
