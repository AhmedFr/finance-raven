import { useCallback, useEffect, useRef } from "react";
import { monthIndexOfIso, yearOf } from "../../domain/dates/dates";
import type { EntryGroup } from "./groupEntries";

type RefCallback = (node: HTMLElement | null) => void;

/** Returns a ref-callback factory; scrolls the current month's group to the top once per year shown. */
export function useScrollToCurrentMonth(groups: EntryGroup[], year: number, today: string) {
  const nodes = useRef(new Map<number, HTMLElement>());
  const callbacks = useRef(new Map<number, RefCallback>());
  const lastScrolledYear = useRef<number | null>(null);

  useEffect(() => {
    if (year === lastScrolledYear.current || groups.length === 0) return;
    lastScrolledYear.current = year;
    if (year !== yearOf(today)) return;
    const current = monthIndexOfIso(today);
    const anchor = [...groups].reverse().find((g) => g.monthIndex <= current) ?? groups[0];
    nodes.current.get(anchor.monthIndex)?.scrollIntoView?.({ block: "start", behavior: "auto" });
  }, [groups, year, today]);

  return useCallback((monthIndex: number): RefCallback => {
    let cb = callbacks.current.get(monthIndex);
    if (!cb) {
      cb = (node) => {
        if (node) nodes.current.set(monthIndex, node);
        else nodes.current.delete(monthIndex);
      };
      callbacks.current.set(monthIndex, cb);
    }
    return cb;
  }, []);
}
