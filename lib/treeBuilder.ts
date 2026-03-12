import type { TreeNode } from "./types";

interface SynsetRow {
  path: string;
  name: string;
  size: number;
  parentPath: string | null;
}

/**
 * Builds a tree from DB rows using parentPath for direct parent lookups.
 *
 * Expects rows ordered by depth (ascending) so parents are always
 * inserted before their children.
 *
 * Single pass — O(n) time, O(n) space.
 */
export function buildTree(rows: SynsetRow[]): TreeNode | null {
  if (rows.length === 0) return null;

  const map = new Map<string, TreeNode>();
  let root: TreeNode | null = null;

  for (const row of rows) {
    const node: TreeNode = { name: row.name, size: row.size, children: [] };
    map.set(row.path, node);

    if (row.parentPath === null) {
      root = node;
    } else {
      map.get(row.parentPath)?.children.push(node);
    }
  }

  return root;
}
