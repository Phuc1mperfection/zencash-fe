import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getCurrencySymbol } from "@/utils/currencyFormatter";
import { useBudget } from "@/hooks/useBudget";

const budgetFormSchema = z.object({
  name: z.string().min(1, {
    message: "Budget name is required.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be greater than 0.",
  }),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface BudgetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBudgetCreated: () => void;
}

const defaultValues: Partial<BudgetFormValues> = {
  name: "",
  amount: undefined,
};

export function BudgetForm({
  open,
  onOpenChange,
  onBudgetCreated,
}: BudgetFormProps) {
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues,
  });

  // Use our new budget hook
  const { handleCreateBudget, isLoading } = useBudget();

  async function onSubmit(data: BudgetFormValues) {
    // Use the hook function to handle creation
    const result = await handleCreateBudget(data);

    if (result) {
      // Reset form and close modal on success
      onOpenChange(false);
      form.reset(defaultValues);
      onBudgetCreated();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Budget</DialogTitle>
          <DialogDescription>
            Set a monthly budget to help manage your spending.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="budget-name">Budget Name</FormLabel>
                  <FormControl>
                    <Input
                      id="budget-name"
                      placeholder="e.g., Monthly Groceries"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a descriptive name for your budget.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => {
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                const currency = user.currency || "VND";
                const currencySymbol = getCurrencySymbol();
                const stepValue = currency === "VND" ? 10000 : 0.1;

                return (
                  <FormItem>
                    <FormLabel htmlFor="budget-amount">
                      Monthly Budget Amount
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          {currencySymbol}
                        </div>
                        <Input
                          id="budget-amount"
                          placeholder={currency === "VND" ? "0" : "0.00"}
                          type="number"
                          step={stepValue}
                          className="pl-7"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Set the maximum amount you want to spend each month.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Creating..." : "Create Budget"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
