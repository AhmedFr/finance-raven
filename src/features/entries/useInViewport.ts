import { type RefObject, useEffect, useState } from "react";

/** True while the referenced element intersects the viewport; stays true when IntersectionObserver is unavailable. */
export function useInViewport(ref: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      const last = entries[entries.length - 1];
      if (last) setInView(last.isIntersecting);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}
