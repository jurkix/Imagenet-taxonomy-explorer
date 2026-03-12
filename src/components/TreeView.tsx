import { memo, useRef, useMemo, useState, useCallback } from "react";
import { useQueries } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRoots } from "@/api/hooks";
import { apiFetch } from "@/api/client";
import { TreeNodeRow } from "./TreeNodeRow";
import type { ApiTreeNode } from "@lib/types";

const TREE_ROW_HEIGHT = 44;
const TREE_OVERSCAN = 15;

interface FlatNode {
  node: ApiTreeNode;
  depth: number;
  isLoading: boolean;
  hasError?: boolean;
}

export const TreeView = memo(function TreeView({
  onSelect,
}: {
  onSelect?: (node: ApiTreeNode) => void;
}) {
  const { data: rootsData } = useRoots();
  const parentRef = useRef<HTMLDivElement>(null);

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

  const expandedArray = useMemo(() => [...expandedPaths], [expandedPaths]);

  const { childrenMap, errorPaths } = useQueries({
    queries: expandedArray.map((path) => ({
      queryKey: ["tree", "children", path],
      queryFn: ({ signal }) =>
        apiFetch<{ data: ApiTreeNode[] }>(
          `/api/tree/children?parentPath=${encodeURIComponent(path)}`,
          signal,
        ),
    })),
    combine: (results) => {
      const map = new Map<string, ApiTreeNode[]>();
      const errors = new Set<string>();
      expandedArray.forEach((path, i) => {
        const q = results[i];
        if (q.data?.data) map.set(path, q.data.data);
        if (q.isError) errors.add(path);
      });
      return { childrenMap: map, errorPaths: errors };
    },
  });

  const flatNodes = useMemo(() => {
    const roots = rootsData?.data ?? [];
    const result: FlatNode[] = [];

    function walk(nodes: ApiTreeNode[], depth: number) {
      for (const node of nodes) {
        const expanded = expandedPaths.has(node.path);
        const children = expanded ? childrenMap.get(node.path) : undefined;
        const hasError = errorPaths.has(node.path);

        result.push({
          node,
          depth,
          isLoading: expanded && node.hasChildren && !children && !hasError,
          hasError,
        });

        if (expanded && children) walk(children, depth + 1);
      }
    }

    walk(roots, 0);
    return result;
  }, [rootsData, expandedPaths, childrenMap, errorPaths]);

  const virtualizer = useVirtualizer({
    count: flatNodes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => TREE_ROW_HEIGHT,
    overscan: TREE_OVERSCAN,
  });

  if (flatNodes.length === 0) {
    return (
      <div className="card card-bordered border-border bg-card shadow-(--shadow-card)">
        <div className="card-body items-center p-16 text-center">
          <p className="text-sm text-muted-foreground">
            No data available. Run{" "}
            <kbd className="kbd kbd-sm">npm run seed</kbd>{" "}
            first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card card-bordered border-border bg-card shadow-(--shadow-card) overflow-hidden">
      <div
        ref={parentRef}
        className="max-h-100 overflow-auto p-2 pb-1"
        role="tree"
        aria-label="ImageNet taxonomy"
      >
        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: "100%",
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((vr) => {
            const {
              node,
              depth,
              isLoading: loading,
              hasError: errored,
            } = flatNodes[vr.index];
            return (
              <div
                key={node.path}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: vr.size,
                  transform: `translateY(${vr.start}px)`,
                }}
              >
                <TreeNodeRow
                  node={node}
                  depth={depth}
                  isExpanded={expandedPaths.has(node.path)}
                  isLoading={loading}
                  hasError={errored}
                  onToggle={toggle}
                  onSelect={onSelect}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
