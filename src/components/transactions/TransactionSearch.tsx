import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TransactionSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  className?: string;
}

export function TransactionSearch({
  searchQuery,
  onSearchChange,
  className,
}: TransactionSearchProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search transactions..."
        className="pl-8"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
