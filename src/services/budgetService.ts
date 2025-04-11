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
  category: string;
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