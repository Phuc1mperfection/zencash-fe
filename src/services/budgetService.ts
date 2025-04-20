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
    // Call the budget overview endpoint
    const response = await api.get("/budgets/overview");
    return response.data;
  } catch (error) {
    console.error("Error fetching budget overview:", error);
    throw error;
  }
};

// Get overview for a specific budget
export const getSingleBudgetOverview = async (budgetId: number) => {
  try {
    // Call the specific budget overview endpoint
    const response = await api.get(`/budgets/${budgetId}/overview`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching overview for budget ID ${budgetId}:`, error);
    throw error;
  }
};

// Get income and expense transactions for a specific budget
export const getBudgetTransactions = async (budgetId: number) => {
  try {
    const response = await api.get(`/budgets/${budgetId}/transactions`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transactions for budget ID ${budgetId}:`, error);
    throw error;
  }
};