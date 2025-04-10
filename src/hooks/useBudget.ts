import { useState } from "react";
import { createBudget, getBudgets } from "@/services/budgetService";
import { toast } from "react-hot-toast";

// Define the budget data interface
export interface BudgetFormData {
  name: string;
  amount: number;
}

export const useBudget = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [budgets, setBudgets] = useState<BudgetFormData[]>([]);

  // Fetch all budgets
  const fetchBudgets = async () => {
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
  };

  // Create a new budget
  const handleCreateBudget = async (data: BudgetFormData) => {
    setIsLoading(true);
    try {
      // Format the data according to API expectations
      const budgetData = {
        name: data.name,
        amount: data.amount,
      };
      console.log("Creating budget with data:", budgetData);
      const createdBudget = await createBudget(budgetData);
      // Refresh budgets list
      await fetchBudgets();
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

  return {
    isLoading,
    budgets,
    fetchBudgets,
    handleCreateBudget
  };
};