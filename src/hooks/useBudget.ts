import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { 
  createBudget, 
  getBudgets, 
  updateBudget, 
  deleteBudget,
  getTotalRemaining,
  getBudgetOverview
} from "@/services/budgetService";
import { getCategoriesByBudget } from "@/services/categoryService";
import { BudgetData } from "@/types/BudgetData";

// Define the budget data interface
export interface BudgetFormData {
  name: string;
  amount: number;
}

export interface BudgetStats {
  spent: number;
  left: number;
  percentage: number;
}

export interface BudgetOverview {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  spentPercentage: number;
}

export const useBudget = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [budgets, setBudgets] = useState<BudgetData[]>([]);
  const [budgetsWithCategories, setBudgetsWithCategories] = useState<BudgetData[]>([]);
  const [budgetOverview, setBudgetOverview] = useState<BudgetOverview>({
    totalBudget: 0,
    totalSpent: 0,
    totalRemaining: 0,
    spentPercentage: 0
  });

  // Fetch all budgets - memoized to prevent recreation on each render
  const fetchBudgets = useCallback(async () => {
    setIsLoading(true);
    try {
      const budgetData = await getBudgets();
      setBudgets(budgetData);
      return budgetData;
    } catch (error) {
      console.error("Failed to fetch budgets:", error);
  
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load budgets with their categories - memoized to prevent recreation on each render
  const loadBudgetsWithCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get raw budget data
      const budgetData = await getBudgets(); // Direct API call instead of fetchBudgets to avoid setState loop

      // Get categories for each budget
      const budgetsWithCats = await Promise.all(
        budgetData.map(async (budget: BudgetData) => {
          const categories = await getCategoriesByBudget(budget.id);
          return { ...budget, categories };
        })
      );

      // Update both state values at once to avoid multiple renders
      setBudgets(budgetData);
      setBudgetsWithCategories(budgetsWithCats);
      
      return budgetsWithCats;
    } catch (error) {
      console.error("Failed to fetch budgets with categories", error);
      toast.error("Failed to fetch budgets with categories. Please try again.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get the total remaining budget
  const fetchTotalRemaining = useCallback(async () => {
    try {
      const data = await getTotalRemaining();
      return data["total-amount"];
    } catch (error) {
      console.error("Failed to fetch total remaining budget:", error);
      return 0;
    }
  }, []);

  // Get budget overview
  const fetchBudgetOverview = useCallback(async () => {
    setIsLoading(true);
    try {
      const overview = await getBudgetOverview();
      setBudgetOverview(overview);
      return overview;
    } catch (error) {
      console.error("Failed to fetch budget overview:", error);
    
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Calculate percentage and spent amount for a budget
  const calculateBudgetStats = (budget: BudgetData): BudgetStats => {
    const spent = budget.totalAmount - budget.remainingAmount;
    const percentage = budget.totalAmount > 0 
      ? Math.round((spent / budget.totalAmount) * 100)
      : 0;
    
    return {
      spent,
      left: budget.remainingAmount,
      percentage
    };
  };

  // Get appropriate color class for progress bar based on percentage
  const getProgressClass = (percentage: number): string => {
    if (percentage >= 90) return "bg-destructive";
    if (percentage >= 75) return "bg-amber-500";
    return "bg-zen-green";
  };

  // Create a new budget
  const handleCreateBudget = useCallback(async (data: BudgetFormData) => {
    setIsLoading(true);
    try {
      // Format the data according to API expectations
      const budgetData = {
        name: data.name,
        amount: data.amount,
      };

      console.log("Creating budget with data:", budgetData);
      const createdBudget = await createBudget(budgetData);
      
      // Show success message
      toast.success("Budget created successfully!");
      
      return createdBudget;
    } catch (error) {
      console.error("Failed to create budget:", error);
      toast.error("Failed to create budget. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update an existing budget
  const handleUpdateBudget = useCallback(async (id: number, data: BudgetFormData) => {
    setIsLoading(true);
    try {
      // Format the data according to API expectations
      const budgetData = {
        name: data.name,
        amount: data.amount,
      };

      console.log("Updating budget with ID", id, "with data:", budgetData);
      const updatedBudget = await updateBudget(id, budgetData);
      
      // Show success message
      toast.success("Budget updated successfully!");
      return updatedBudget;
    } catch (error) {
      console.error(`Failed to update budget with ID ${id}:`, error);
      toast.error("Failed to update budget. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete a budget
  const handleDeleteBudget = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      await deleteBudget(id);
      
      // Show success message
      toast.success("Budget deleted successfully!");
      
      return true;
    } catch (error) {
      console.error(`Failed to delete budget with ID ${id}:`, error);
      toast.error("Failed to delete budget. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    budgets,
    budgetsWithCategories,
    budgetOverview,
    fetchBudgets,
    loadBudgetsWithCategories,
    fetchTotalRemaining,
    fetchBudgetOverview,
    handleCreateBudget,
    handleUpdateBudget,
    handleDeleteBudget,
    calculateBudgetStats,
    getProgressClass
  };
};