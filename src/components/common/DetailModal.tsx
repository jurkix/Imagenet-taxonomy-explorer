import { useEffect, useRef } from "react";
import { X, ChevronRight } from "lucide-react";
import type { ApiTreeNode } from "@lib/types";

const numberFmt = new Intl.NumberFormat();

interface DetailModalProps {
  node: ApiTreeNode;
  onClose: () => void;
}

export function DetailModal({ node, onClose }: DetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const breadcrumbs = node.path.split(" > ");

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-(--shadow-elevated) outline-none"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 id="modal-title" className="text-lg font-semibold text-foreground">{node.name}</h3>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
            autoFocus
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {breadcrumbs.length > 1 && (
          <div className="mt-3 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            {breadcrumbs.map((segment, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className={i === breadcrumbs.length - 1 ? "font-medium text-foreground" : ""}>{segment}</span>
                {i < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3" />}
              </span>
            ))}
          </div>
        )}

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-muted p-3">
            <dt className="text-xs text-muted-foreground">Descendants</dt>
            <dd className="mt-0.5 font-semibold text-foreground">{numberFmt.format(node.size)}</dd>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <dt className="text-xs text-muted-foreground">Depth</dt>
            <dd className="mt-0.5 font-semibold text-foreground">{node.depth}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
