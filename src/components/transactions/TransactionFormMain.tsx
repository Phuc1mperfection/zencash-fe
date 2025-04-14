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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTransactionForm } from "@/hooks/useTransactionForm";
import { TransactionAmountField } from "./TransactionAmountField";
import { BudgetSelector } from "./BudgetSelector";
import { CategorySelector } from "./CategorySelector";
import { TransactionDateSelector } from "./TransactionDateSelector";
import { TransactionFormValues } from "@/schemas/transactionFormSchema";

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillData?: Partial<TransactionFormValues>;
  editMode?: boolean;
  transactionId?: number;
  onSuccess?: () => void;
}

export function TransactionFormMain({
  open,
  onOpenChange,
  prefillData,
  editMode = false,
  transactionId,
  onSuccess,
}: TransactionFormProps) {
  // Sử dụng custom hook để quản lý logic form
  const {
    form,
    isSubmitting,
    isLoading,
    loadingCategories,
    budgetOptions,
    categoryOptions,
    onSubmit,
    handleBudgetChange,
    handleCategoryChange,
    toggleTransactionType,
    reset,
  } = useTransactionForm({
    prefillData,
    editMode,
    transactionId,
    onSuccess,
    onClose: () => onOpenChange(false),
  });

  // Loading state
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
            <DialogDescription>
              Please wait while we load your budgets.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
            <span className="ml-2">Loading budgets...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
          <DialogDescription>
            {editMode
              ? "Update the details of your transaction."
              : "Enter the details of your new transaction."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="space-y-4"
            onReset={() => {
              reset();
              onOpenChange(false);
            }}
          >
            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Grocery shopping" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount and Transaction Type Fields */}
            <TransactionAmountField
              form={form}
              onToggleType={toggleTransactionType}
            />

            {/* Budget Field */}
            <BudgetSelector
              form={form}
              budgetOptions={budgetOptions}
              onBudgetChange={handleBudgetChange}
            />

            {/* Category Field */}
            <CategorySelector
              form={form}
              categoryOptions={categoryOptions}
              isLoading={loadingCategories}
              onCategoryChange={handleCategoryChange}
            />

            {/* Date Field */}
            <TransactionDateSelector form={form} />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting
                  ? editMode
                    ? "Updating..."
                    : "Adding..."
                  : editMode
                  ? "Update Transaction"
                  : "Add Transaction"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
