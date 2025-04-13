import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { useTransactions } from "@/hooks/useTransactions";
import {
  TransactionRequest,
  TransactionResponse,
} from "@/services/transactionService";
import { useBudget } from "@/hooks/useBudget";
import { getCategoriesByBudget } from "@/services/categoryService";
import { CategoryResponse } from "@/types/CategoryResponse";
import { getCurrencySymbol } from "@/utils/currencyFormatter";

// Updated schema that includes categoryId
const transactionFormSchema = z.object({
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  amount: z.coerce.number().refine((val) => val !== 0, {
    message: "Amount cannot be zero.",
  }),
  budgetId: z.number({
    required_error: "Please select a budget.",
  }),
  categoryId: z.number({
    required_error: "Please select a category.",
  }),
  date: z.date({
    required_error: "A date is required.",
  }),
  isIncome: z.boolean().default(false).optional(),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillData?: Partial<TransactionFormValues>;
  editMode?: boolean;
  transactionId?: number;
  onEditSuccess?: () => void; // Thêm callback khi edit thành công
}

const defaultValues: Partial<TransactionFormValues> = {
  description: "",
  amount: undefined,
  date: new Date(),
  isIncome: false,
};

export function TransactionForm({
  open,
  onOpenChange,
  prefillData,
  editMode = false,
  transactionId,
  onEditSuccess,
}: TransactionFormProps) {
  const { addTransaction, updateTransaction, fetchTransactions } =
    useTransactions();
  const { budgets, fetchBudgets } = useBudget();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: prefillData
      ? { ...defaultValues, ...prefillData }
      : defaultValues,
  });

  // Get the current budgetId value from the form
  const watchBudgetId = form.watch("budgetId");

  // Fetch budgets when component mounts
  useEffect(() => {
    const loadBudgets = async () => {
      setIsLoading(true);
      try {
        await fetchBudgets();
      } catch (err) {
        console.error("Error loading budgets:", err);
        toast.error("Failed to load budgets. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadBudgets();
  }, [fetchBudgets]);

  // Set initial budget ID if there are budgets available
  useEffect(() => {
    if (budgets && budgets.length > 0 && !form.getValues().budgetId) {
      form.setValue("budgetId", budgets[0].id);
    }
  }, [budgets, form]);

  // Fetch categories whenever the selected budget changes
  useEffect(() => {
    const fetchCategories = async () => {
      if (!watchBudgetId) return;

      setLoadingCategories(true);
      try {
        const data = await getCategoriesByBudget(watchBudgetId);
        setCategories(data || []);

        // Set default category if available and not already set
        if (data && data.length > 0 && !form.getValues().categoryId) {
          // Try to find a default category first
          const defaultCategory = data.find(
            (cat: CategoryResponse) => cat.isDefault
          );
          if (defaultCategory) {
            form.setValue("categoryId", defaultCategory.id);
          } else if (data[0]) {
            // Otherwise use the first category
            form.setValue("categoryId", data[0].id);
          }
        }
      } catch (err) {
        console.error("Error loading categories:", err);
        toast.error("Failed to load categories. Please try again later.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [watchBudgetId, form]);

  async function onSubmit(data: TransactionFormValues) {
    setIsSubmitting(true);

    try {
      const request: TransactionRequest = {
        budgetId: data.budgetId,
        categoryId: data.categoryId,
        amount: Math.abs(data.amount), // Always positive amount
        type: data.isIncome ? "INCOME" : "EXPENSE",
        date: format(data.date, "yyyy-MM-dd"), // Format as ISO date string
        note: data.description,
      };

      console.log("Submitting transaction:", request);

      let response: TransactionResponse;

      if (editMode && transactionId) {
        // Update existing transaction
        response = await updateTransaction(transactionId, request);
        await fetchTransactions(); // Refresh transactions list after editing
        if (onEditSuccess) {
          onEditSuccess(); // Gọi callback khi edit thành công
        }
      } else {
        // Create new transaction
        response = await addTransaction(request);
      }

      if (response) {
        form.reset(defaultValues);
        onOpenChange(false);

        console.log("Transaction submitted successfully:", response);
      }
    } catch (error) {
      console.error("Transaction submission error:", error);
      toast.error(
        editMode
          ? "Failed to update transaction. Please try again."
          : "Failed to add transaction. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const budgetOptions = budgets
    ? budgets.map((budget) => ({
        label: budget.name,
        value: budget.id,
      }))
    : [];

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

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
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            onReset={() => {
              onOpenChange(false); // Close dialog on reset
            }}
          >
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

            <div className="grid grid-cols-2 gap-4">
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
                  );
                }}
              />

              <FormField
                control={form.control}
                name="isIncome"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-end">
                    <FormControl>
                      <Button
                        type="button"
                        variant={field.value ? "default" : "outline"}
                        className={`mt-2 ${
                          field.value
                            ? "bg-zen-green text-white"
                            : "border-muted-foreground"
                        }`}
                        onClick={() => field.onChange(!field.value)}
                      >
                        {field.value ? "Income" : "Expense"}
                      </Button>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="budgetId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Budget</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      form.setValue("budgetId", Number(value));
                      form.setValue("categoryId", Number(null)); // Sửa từ Number(null) thành undefined
                      form.trigger("budgetId"); // Validate the field
                    }}
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
                        <SelectItem
                          key={budget.value}
                          value={budget.value.toString()}
                        >
                          {budget.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category field */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      form.setValue("categoryId", Number(value));
                      form.trigger("categoryId"); // Validate the field
                    }}
                    value={field.value?.toString()}
                    disabled={loadingCategories || categoryOptions.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category">
                          {loadingCategories
                            ? "Loading categories..."
                            : field.value
                            ? categoryOptions.find(
                                (category) => category.value === field.value
                              )?.label
                            : categoryOptions.length === 0
                            ? "No categories available"
                            : "Select category"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadingCategories ? (
                        <SelectItem value="loading" disabled>
                          Loading categories...
                        </SelectItem>
                      ) : categoryOptions.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No categories found for this budget
                        </SelectItem>
                      ) : (
                        categoryOptions.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value.toString()}
                          >
                            {category.label}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          type="button"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(date); // Update form field
                          }
                        }}
                        disabled={(date) => date > new Date()} // Disable future dates
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

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
