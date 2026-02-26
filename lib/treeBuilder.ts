import type { LinearNode, TreeNode } from "./types";

/**
 * Converts a flat array of path-based tuples into a hierarchical tree structure.
 *
 * ALGORITHM:
 * 1. Sort tuples by depth (ascending) to guarantee parents exist before children.
 * 2. Maintain a Map<fullPath, TreeNode> for O(1) parent lookups.
 * 3. For each tuple:
 *    - Extract the node name (last path segment)
 *    - Create a TreeNode
 *    - Compute parent path (all segments except last)
 *    - Look up parent in Map and attach as child
 *    - Store node in Map for future children to reference
 *
 * TIME COMPLEXITY: O(n * m)
 *   - n = number of tuples (~61,000)
 *   - m = average path depth (average number of " > " segments, ~5-6)
 *   - Pre-compute: O(n * m) to split all paths once
 *   - Sorting: O(n log n) comparing pre-computed depths (O(1) per comparison)
 *   - Tree build: O(n * m) for parent path joins + O(1) Map lookups
 *   - Total: O(n * m) where m is bounded by max tree depth (13)
 *
 * SPACE COMPLEXITY: O(n * m)
 *   - Map stores n entries with keys of average length proportional to m
 *   - Output tree has n nodes with n-1 parent-child edges
 *
 * If m is treated as a bounded constant (max depth = 13 for this dataset),
 * the algorithm is effectively O(n) in both time and space.
 */
export function buildTree(tuples: LinearNode[]): TreeNode | null {
  if (tuples.length === 0) return null;

  // Pre-compute segments once per tuple to avoid repeated split() in sort comparator
  const withSegments = tuples.map((t) => ({
    tuple: t,
    segments: t.path.split(" > "),
  }));

  withSegments.sort((a, b) => a.segments.length - b.segments.length);

  const nodeMap = new Map<string, TreeNode>();
  let root: TreeNode | null = null;

  for (const { tuple, segments } of withSegments) {
    const name = segments[segments.length - 1];
    const node: TreeNode = { name, size: tuple.size, children: [] };

    nodeMap.set(tuple.path, node);

    if (segments.length === 1) {
      root = node;
    } else {
      const parentPath = segments.slice(0, -1).join(" > ");
      const parent = nodeMap.get(parentPath);
      if (parent) {
        parent.children.push(node);
      } else if (process.env.NODE_ENV !== "production") {
        console.warn(`[buildTree] Orphaned node — parent not found for "${tuple.path}"`);
      }
    }
  }

  return root;
}
