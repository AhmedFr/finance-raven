import { useEffect, useState } from "react";

const ROOT_MARGIN = "-56px 0px 0px 0px";

/**
 * Callback-ref hook: attach the returned ref to an element; inView is true while it intersects the viewport
 * (below the sticky mini-bar). Stays true when there is no node or no IntersectionObserver.
 */
export function useInViewport(): [(node: Element | null) => void, boolean] {
  const [node, setNode] = useState<Element | null>(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const last = entries[entries.length - 1];
        if (last) setInView(last.isIntersecting);
      },
      { rootMargin: ROOT_MARGIN },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);
  return [setNode, node ? inView : true];
}
