import { TREE_BASE_PADDING_PX } from "@/constants";

export function TreeViewSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-(--shadow-card)">
      <div className="p-2">
        <div
          className="flex animate-pulse items-center gap-2 rounded-lg py-2.5 pr-3"
          style={{ paddingLeft: TREE_BASE_PADDING_PX }}
        >
          <div className="h-4 w-4 shrink-0 rounded bg-muted" />
          <div className="h-4 w-4 shrink-0 rounded bg-muted" />
          <div className="h-4 w-48 rounded bg-muted" />
          <div className="ml-auto h-5 w-10 shrink-0 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
