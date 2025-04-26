import { z } from "zod";
import { useEffect } from "react";
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
import { BudgetData } from "@/types/BudgetData";

const budgetFormSchema = z.object({
  name: z.string().min(1, {
    message: "Budget name is required.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be greater than 0.",
  }),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface EditBudgetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBudgetUpdated: () => void;
  budget: BudgetData | null;
}

export function EditBudgetForm({
  open,
  onOpenChange,
  onBudgetUpdated,
  budget,
}: EditBudgetFormProps) {
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      name: "",
      amount: 0,
    },
  });

  // Reset form when budget changes or dialog opens/closes
  useEffect(() => {
    if (budget && open) {
      form.reset({
        name: budget.name,
        amount: budget.totalAmount,
      });
    } else if (!open) {
      form.reset();
    }
  }, [budget, open, form]);

  // Use our budget hook
  const { handleUpdateBudget, isLoading } = useBudget();

  async function onSubmit(data: BudgetFormValues) {
    if (!budget) return;

    // Use the hook function to handle update
    const result = await handleUpdateBudget(budget.id, data);

    if (result) {
      // Close modal on success
      onOpenChange(false);
      onBudgetUpdated();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Budget</DialogTitle>
          <DialogDescription>Update your budget details.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="edit-budget-name">Budget Name</FormLabel>
                  <FormControl>
                    <Input
                      id="edit-budget-name"
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
                    <FormLabel htmlFor="edit-budget-amount">
                      Budget Amount
                    </FormLabel>
                    <FormControl>
                        <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          {currencySymbol}
                        </div>
                        <Input
                          id="edit-budget-amount"
                          placeholder={currency === "VND" ? "0" : "0.00"}
                          type="number"
                          step={stepValue}
                          className="pl-7"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Update the amount for this budget.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Updating..." : "Update Budget"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
