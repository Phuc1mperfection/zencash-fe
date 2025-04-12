import api from "./api";

export const getBudgets = async () => {
  try {
    const response = await api.get("/budgets");
    return response.data;
  } catch (error) {
    console.error("Error fetching budgets:", error);
    throw error;
  }
};

interface BudgetData {
  name: string;
  amount: number;
  category?: string;
}

export const createBudget = async (budgetData: BudgetData) => {
  try {
    const response = await api.post("/budgets", budgetData);
    return response.data;
  } catch (error) {
    console.error("Error creating budget:", error);
    throw error;
  }
};

export const updateBudget = async (id: number, budgetData: BudgetData) => {
  try {
    const response = await api.put(`/budgets/${id}`, budgetData);
    return response.data;
  } catch (error) {
    console.error(`Error updating budget with ID ${id}:`, error);
    throw error;
  }
};

export const deleteBudget = async (id: number) => {
  try {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting budget with ID ${id}:`, error);
    throw error;
  }
};

// Get the total remaining budget amount for the user
export const getTotalRemaining = async () => {
  try {
    const response = await api.get("/budgets/total-remaining");
    return response.data;
  } catch (error) {
    console.error("Error fetching total remaining budget:", error);
    throw error;
  }
};

// Get totals for budget overview (total budget, spent, remaining)
export const getBudgetOverview = async () => {
  try {
    // Use the existing endpoints to calculate the overview
    const budgets = await getBudgets();
    
    // Calculate totals
    const totalBudget = budgets.reduce((sum: number, budget: BudgetData & { totalAmount: number }) => sum + budget.totalAmount, 0);
    const totalRemaining = budgets.reduce((sum: number, budget: BudgetData & { remainingAmount: number }) => sum + budget.remainingAmount, 0);
    const totalSpent = totalBudget - totalRemaining;
    const spentPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
    if (isNaN(spentPercentage)) {
      throw new Error("Spent percentage calculation resulted in NaN");
    }
    // if (totalRemaining < 0) {
    //   totalRemaining = 0; // Ensure remaining budget is not negative  
    // }
    return {
      totalBudget,
      totalSpent,
      totalRemaining,
      spentPercentage
    };
  } catch (error) {
    console.error("Error calculating budget overview:", error);
    throw error;
  }
};