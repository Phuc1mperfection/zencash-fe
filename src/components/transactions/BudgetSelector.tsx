import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "@/schemas/transactionFormSchema";

interface BudgetOption {
  value: number;
  label: string;
}

interface BudgetSelectorProps {
  form: UseFormReturn<TransactionFormValues>;
  budgetOptions: BudgetOption[];
  onBudgetChange: (budgetId: number) => void;
}

export function BudgetSelector({
  form,
  budgetOptions,
  onBudgetChange,
}: BudgetSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="budgetId"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Budget</FormLabel>
          <Select
            onValueChange={(value) => onBudgetChange(Number(value))}
            value={field.value?.toString()}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select budget">
                  {field.value !== undefined
                    ? budgetOptions.find(
                        (budget) => budget.value === field.value
                      )?.label
                    : "Select budget"}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {budgetOptions.map((budget) => (
                <SelectItem key={budget.value} value={budget.value.toString()}>
                  {budget.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
