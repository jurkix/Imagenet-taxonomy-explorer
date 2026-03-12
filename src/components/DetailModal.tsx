import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { ApiTreeNode } from "@lib/types";

interface DetailModalProps {
  node: ApiTreeNode | null;
  onClose: () => void;
}

export function DetailModal({ node, onClose }: DetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (node) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [node]);

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box max-w-md">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{node?.name}</h3>
          <button className="btn btn-sm btn-ghost btn-circle" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {node && (
          <div className="breadcrumbs mt-3 text-sm text-muted-foreground">
            <ul>
              {node.path.split(" > ").map((segment, i) => (
                <li key={i}>{segment}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
