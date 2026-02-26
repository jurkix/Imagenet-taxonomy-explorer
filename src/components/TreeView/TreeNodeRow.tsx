import { memo } from "react";
import { ChevronRight, Folder, FileText, Loader2, AlertCircle } from "lucide-react";
import { TREE_INDENT_PX, TREE_BASE_PADDING_PX } from "@/constants";
import type { ApiTreeNode } from "@lib/types";

const numberFmt = new Intl.NumberFormat();

interface TreeNodeRowProps {
  node: ApiTreeNode;
  depth: number;
  isExpanded: boolean;
  isLoading: boolean;
  hasError?: boolean;
  onToggle: (path: string) => void;
  onSelect?: (node: ApiTreeNode) => void;
}

export const TreeNodeRow = memo(function TreeNodeRow({
  node,
  depth,
  isExpanded,
  isLoading,
  hasError,
  onToggle,
  onSelect,
}: TreeNodeRowProps) {
  const handleClick = () => {
    if (node.hasChildren) {
      onToggle(node.path);
    } else {
      onSelect?.(node);
    }
  };

  return (
    <button
      role="treeitem"
      aria-expanded={node.hasChildren ? isExpanded : undefined}
      aria-level={depth + 1}
      aria-label={`${node.name}, ${node.size} descendants`}
      onClick={handleClick}
      className={`group flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-all duration-150 ${
        isExpanded ? "bg-tree-active font-medium" : "hover:bg-tree-hover"
      }`}
      style={{ paddingLeft: `${depth * TREE_INDENT_PX + TREE_BASE_PADDING_PX}px` }}
    >
      {node.hasChildren ? (
        isLoading ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
        ) : hasError ? (
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
        ) : (
          <ChevronRight
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        )
      ) : (
        <span className="h-4 w-4 shrink-0" />
      )}

      {node.hasChildren ? (
        <Folder className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      ) : (
        <FileText className="h-4 w-4 shrink-0 text-muted-foreground/60" />
      )}

      <span
        className={`flex-1 truncate text-sm ${
          isExpanded
            ? "text-foreground"
            : node.hasChildren
              ? "text-foreground/80"
              : "text-muted-foreground"
        }`}
        title={node.path}
      >
        {node.name}
      </span>

      {node.size > 0 && (
        <span
          className={`inline-flex h-5 min-w-6.5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold transition-colors ${
            isExpanded
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground group-hover:bg-badge group-hover:text-badge-foreground"
          }`}
        >
          {numberFmt.format(node.size)}
        </span>
      )}
    </button>
  );
});
