import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionTypeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function TransactionTypeSelector({
  value,
  onValueChange,
  disabled,
  className,
}: TransactionTypeSelectorProps) {
  return (
    <Select
      value={value}
      onValueChange={(value) => onValueChange(String(value))}
      disabled={disabled}
    >
      <SelectTrigger className={`h-10 w-[180px] ${className}`}>
        <SelectValue placeholder="All Transactions" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Transactions</SelectItem>
        <SelectItem value="INCOME">Income Only</SelectItem>
        <SelectItem value="EXPENSE">Expenses Only</SelectItem>
      </SelectContent>
    </Select>
  );
}
