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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createBudget = async (budgetData: any) => {
  try {
    const response = await api.post("/budgets", budgetData);
    return response.data;
  } catch (error) {
    console.error("Error creating budget:", error);
    throw error;
  }
};