import { useState, useCallback } from "react";

export function useTreeExpansion() {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const toggle = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  return { expandedPaths, toggle };
}
