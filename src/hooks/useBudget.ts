import { useCallback, useState } from "react";
import { createBudget, getBudgets } from "@/services/budgetService";
import { getCategoriesByBudget } from "@/services/categoryService";
import { toast } from "react-hot-toast";
import { BudgetData } from "@/types/BudgetData";

export const useBudget = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [budgetsWithCategories, setBudgetsWithCategories] = useState<BudgetData[]>([]);

  const fetchBudgets = async () => {
    setIsLoading(true);
    try {
      const budgetData = await getBudgets();
      return budgetData;
    } catch (error) {
      console.error("Failed to fetch budgets:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const loadBudgetsWithCategories = useCallback(async () => {
    try {
      const budgetData = await fetchBudgets();

      const budgetsWithCats = await Promise.all(
        budgetData.map(async (budget: BudgetData) => {
          const categories = await getCategoriesByBudget(budget.id);
          return { ...budget, categories };
        })
      );

      setBudgetsWithCategories(budgetsWithCats);
    } catch (error) {
      console.error("Failed to fetch budgets with categories", error);
    }
  }, []); // <- useCallback để không đổi giữa các render

  const handleCreateBudget = async (data: { name: string; amount: number }) => {
    setIsLoading(true);
    try {
      const createdBudget = await createBudget({ ...data, category: "default" });
      await loadBudgetsWithCategories();
      toast.success("Budget created successfully!");
      return createdBudget;
    } catch (error) {
      console.error("Failed to create budget:", error);
      toast.error("Failed to create budget. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const calculateBudgetStats = (budget: BudgetData) => {
    const spent = budget.totalAmount - budget.remainingAmount;
    const percentage =
      budget.totalAmount > 0
        ? Math.round((spent / budget.totalAmount) * 100)
        : 0;

    return {
      spent,
      left: budget.remainingAmount,
      percentage,
    };
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 90) return "bg-destructive";
    if (percentage >= 75) return "bg-amber-500";
    return "bg-zen-green";
  };

  return {
    isLoading,
    budgetsWithCategories,
    loadBudgetsWithCategories,
    calculateBudgetStats,
    getProgressColor,
    handleCreateBudget,
  };
};
