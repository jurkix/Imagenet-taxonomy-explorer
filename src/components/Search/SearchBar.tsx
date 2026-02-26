import { Search, X } from "lucide-react";

interface SearchBarProps {
  ref?: React.Ref<HTMLInputElement>;
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ ref, value, onChange }: SearchBarProps) {
  return (
    <div className="group relative">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search categories..."
        className="h-14 w-full rounded-xl border-2 border-border bg-card pl-12 pr-12 text-base text-foreground shadow-(--shadow-card) transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:shadow-(--shadow-elevated) focus:outline-none"
        aria-label="Search categories"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
