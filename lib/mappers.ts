import type { ApiTreeNode, SearchResult } from "./types.js";

interface SynsetFields {
  id: number;
  path: string;
  name: string;
  size: number;
  depth: number;
}

export function toApiNode(node: SynsetFields): ApiTreeNode {
  return {
    id: node.id,
    path: node.path,
    name: node.name,
    size: node.size,
    depth: node.depth,
    hasChildren: node.size > 0,
  };
}

export function toSearchResult(node: SynsetFields): SearchResult {
  return {
    ...toApiNode(node),
    breadcrumbs: node.path.split(" > "),
  };
}
