import { Calendar as CalendarIcon, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FilterType } from "@/hooks/useTransactionFilters";

interface Budget {
  id: number;
  name: string;
}

interface TransactionFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  date?: Date;
  onDateSelect: (date?: Date) => void;
  onClearFilters: () => void;
  budgets: Budget[] | undefined;
  isLoading: boolean;
}

export function TransactionFilters({
  filters,
  onFiltersChange,
  date,
  onDateSelect,
  onClearFilters,
  budgets,
  isLoading,
}: TransactionFiltersProps) {
  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-10 gap-2">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {filters.date && (
            <Badge variant="secondary" className="h-5 px-1 rounded-full">
              1
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Filter Transactions</h4>

          <div className="space-y-2">
            <label className="text-sm font-medium">Budget</label>
            <Select
              value={filters.budgetId?.toString() || ""}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  budgetId:
                    value.toString() === "all" ? undefined : Number(value),
                })
              }
              disabled={isLoading || !budgets || budgets.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Budgets</SelectItem>
                {budgets &&
                  budgets.map((budget) => (
                    <SelectItem key={budget.id} value={budget.id.toString()}>
                      {budget.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Transaction Type</label>
            <Select
              value={filters.type}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  type: value as unknown as "all" | "INCOME" | "EXPENSE",
                })
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="INCOME">Income Only</SelectItem>
                <SelectItem value="EXPENSE">Expenses Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={onDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={onClearFilters}
            disabled={isLoading}
          >
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
