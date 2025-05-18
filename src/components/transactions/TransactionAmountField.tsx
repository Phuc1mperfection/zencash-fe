import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { getCurrencySymbol } from "@/utils/currencyFormatter";
import { TransactionFormValues } from "@/schemas/transactionFormSchema";

interface TransactionAmountFieldProps {
  form: UseFormReturn<TransactionFormValues>;
  onToggleType: () => void;
}

export function TransactionAmountField({
  form,
  onToggleType,
}: TransactionAmountFieldProps) {
  // Get user currency preferences from local storage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currency = user.currency || "VND";
  const currencySymbol = getCurrencySymbol();
  const stepValue = currency === "VND" ? 10000 : 0.1;

  const isIncome = form.watch("isIncome");

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amount</FormLabel>
            <FormControl>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  {currencySymbol}
                </div>
                <Input
                  placeholder="0.00"
                  type="number"
                  step={stepValue}
                  className="pl-7"
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="isIncome"
        render={({ field }) => (
          <FormItem className="flex flex-col justify-end">
            <FormControl>
              <Button
                type="button"
                variant={field.value ? "default" : "destructive"}
                className={`mt-2 ${
                  field.value
                    ? "bg-zen-green text-white"
                    : "bg-red-400 text-white"
                }`}
                onClick={onToggleType}
              >
                {isIncome ? "Income" : "Expense"}
              </Button>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
