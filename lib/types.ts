export interface TreeNode {
  name: string;
  size: number;
  children: TreeNode[];
}

export interface ApiTreeNode {
  id: number;
  path: string;
  name: string;
  size: number;
  depth: number;
  hasChildren: boolean;
}

export interface SearchResult extends ApiTreeNode {
  breadcrumbs: string[];
}

