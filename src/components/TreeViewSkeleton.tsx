export function TreeViewSkeleton() {
  return (
    <div className="card card-bordered border-border bg-card shadow-(--shadow-card)">
      <div className="card-body p-2">
        <div className="flex items-center gap-2 rounded-lg py-2.5 px-3">
          <div className="skeleton h-4 w-4 rounded" />
          <div className="skeleton h-4 w-4 rounded" />
          <div className="skeleton h-4 w-48 rounded" />
          <div className="ml-auto">
            <div className="skeleton h-5 w-10 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
