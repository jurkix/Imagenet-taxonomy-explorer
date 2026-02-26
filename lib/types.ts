export interface LinearNode {
  path: string;
  size: number;
}

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

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface FlatNode {
  node: ApiTreeNode;
  depth: number;
  isLoading: boolean;
  hasError?: boolean;
}
