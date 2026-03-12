import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="group relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search categories..."
        className="input input-bordered input-lg w-full rounded-xl border-2 border-border bg-card pl-12 pr-12 text-base text-foreground shadow-(--shadow-card) transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:shadow-(--shadow-elevated) focus:outline-none"
        aria-label="Search categories"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="btn btn-ghost btn-circle btn-sm absolute right-3 top-1/2 -translate-y-1/2"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
