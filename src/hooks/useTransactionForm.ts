import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

import { useBudget } from "./useBudget";
import { useTransactions } from "./useTransactions";
import { getCategoriesByBudget } from "@/services/categoryService";
import { TransactionRequest } from "@/services/transactionService";
import { 
  transactionFormSchema, 
  TransactionFormValues, 
  defaultTransactionValues 
} from "@/schemas/transactionFormSchema";
import { CategoryResponse } from "@/types/CategoryResponse";

interface UseTransactionFormProps {
  prefillData?: Partial<TransactionFormValues>;
  editMode?: boolean;
  transactionId?: number;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const useTransactionForm = ({
  prefillData,
  editMode = false,
  transactionId,
  onSuccess,
  onClose,
}: UseTransactionFormProps = {}) => {
  // Hooks
  const { addTransaction, updateTransaction, fetchTransactions } = useTransactions();
  const { budgets, fetchBudgets } = useBudget();
  
  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Form setup
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: prefillData
      ? { ...defaultTransactionValues, ...prefillData }
      : defaultTransactionValues,
  });

  // Watch for budget ID changes to update categories
  const watchBudgetId = form.watch("budgetId");

  // Load budgets when component mounts
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

  // Set initial budget ID if available
  useEffect(() => {
    if (budgets && budgets.length > 0 && !form.getValues().budgetId) {
      form.setValue("budgetId", budgets[0].id);
    }
  }, [budgets, form]);

  // Fetch categories when budget changes
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
            (cat: CategoryResponse) => cat.defaultCat === true
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

  // Handle form submission
  const onSubmit = async (data: TransactionFormValues) => {
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

      if (editMode && transactionId) {
        // Update existing transaction
        await updateTransaction(transactionId, request);
      } else {
        // Create new transaction
        await addTransaction(request);
      }
      
      // Reset form and close dialog on success
      form.reset(defaultTransactionValues);
      
      // Refresh global transactions data
      // This is an extra call to ensure UI synchronization
      fetchTransactions();
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Close dialog if callback provided
      if (onClose) {
        onClose();
      }

      // Show success message
      toast.success(
        editMode
          ? "Transaction updated successfully!"
          : "Transaction added successfully!"
      );
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
  };

  // Handle budget change
  const handleBudgetChange = (budgetId: number) => {
    form.setValue("budgetId", budgetId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form.setValue("categoryId", undefined as any); // Reset category when budget changes
    form.trigger("budgetId"); // Validate the field
  };

  // Handle category change
  const handleCategoryChange = (categoryId: number) => {
    form.setValue("categoryId", categoryId);
    form.trigger("categoryId"); // Validate the field
  };

  // Handle toggle between income/expense
  const toggleTransactionType = () => {
    const currentValue = form.getValues().isIncome;
    form.setValue("isIncome", !currentValue);
  };

  // Format data for UI components
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

  return {
    form,
    isSubmitting,
    isLoading,
    loadingCategories,
    categories,
    budgetOptions,
    categoryOptions,
    watchBudgetId,
    onSubmit: form.handleSubmit(onSubmit),
    handleBudgetChange,
    handleCategoryChange,
    toggleTransactionType,
    reset: () => form.reset(defaultTransactionValues),
  };
};