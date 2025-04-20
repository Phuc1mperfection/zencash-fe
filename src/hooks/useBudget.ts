import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { 
  createBudget, 
  getBudgets, 
  updateBudget, 
  deleteBudget,
  getTotalRemaining,
  getBudgetOverview,
  getSingleBudgetOverview
} from "@/services/budgetService";
import { getCategoriesByBudget } from "@/services/categoryService";
import { BudgetData } from "@/types/BudgetData";
import axios from "axios";

// Define the budget data interface
export interface BudgetFormData {
  name: string;
  amount: number;
}

// Không cần tính toán budget stats nữa vì dùng dữ liệu từ API
export interface BudgetOverview {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  spentPercentage: number;
  budgetId?: number; // Optional ID for single budget overview
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

  // Get overview for a single budget
  const fetchSingleBudgetOverview = useCallback(async (budgetId: number) => {
    try {
      const overview = await getSingleBudgetOverview(budgetId);
      return {
        ...overview,
        budgetId // Add the budgetId to the response
      };
    } catch (error) {
      console.error(`Failed to fetch overview for budget ID ${budgetId}:`, error);
      return null;
    }
  }, []);

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

      const createdBudget = await createBudget(budgetData);
      
      // Show success message
      toast.success("Budget created successfully!");
      
      return createdBudget;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error response data:', error.response?.data);
        toast.error(error.response?.data?.message || 'Failed to create budget');
      } else {
        console.error('Error creating category group:', error);
        toast.error("Failed to create budget. Please try again.");
      }
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

      const updatedBudget = await updateBudget(id, budgetData);
      
      // Thêm một khoảng thời gian ngắn để đảm bảo backend đã xử lý hoàn tất
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Refresh theo thứ tự và đảm bảo mỗi bước hoàn tất trước khi đến bước tiếp theo
      
      try {
        // Dùng Promise.all để đồng thời gửi các request nhưng đợi tất cả hoàn thành
        await Promise.all([
          fetchBudgetOverview().then(result => {
            return result;
          }),
          fetchBudgets(),
          loadBudgetsWithCategories()
        ]);
        
      } catch (refreshError) {
        console.error("Error refreshing data after budget update:", refreshError);
      }
      
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
  }, [fetchBudgetOverview, fetchBudgets, loadBudgetsWithCategories]);

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
    fetchSingleBudgetOverview,
    handleCreateBudget,
    handleUpdateBudget,
    handleDeleteBudget,
    getProgressClass
  };
};