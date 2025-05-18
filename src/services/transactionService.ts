import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:8080/api";

export interface TransactionRequest {
  budgetId: number;
  categoryId: number;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: string; // ISO format date string
  note: string;
}

export interface TransactionResponse {
  id: number;
  budgetId: number;
  categoryId: number;
  categoryName?: string;
  amount: number;
  type: string;
  note: string;
  date: string; // ISO format date string
}

export interface CategoryGroupStatistics {
  groupId: number;
  groupName: string;
  totalAmount: number;
  percentage: number;
}

export interface PieChartData {
  categoryId: number;
  categoryName: string;
  totalAmount: number;
  count: number;
}

export interface PieChartResponse {
  income: PieChartData[];
  expense: PieChartData[];
}

const getAuthHeader = () => {
  const accessToken = authService.getAccessToken();
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

// Create a new transaction
export const createTransaction = async (transaction: TransactionRequest): Promise<TransactionResponse> => {
  const response = await axios.post(
    `${API_URL}/transactions`, 
    transaction, 
    getAuthHeader()
  );
  return response.data;
};

// Update an existing transaction
export const updateTransaction = async (id: number, transaction: TransactionRequest): Promise<TransactionResponse> => {
  const response = await axios.put(
    `${API_URL}/transactions/${id}`, 
    transaction, 
    getAuthHeader()
  );
  if (response.status !== 200) {
    throw new Error("Failed to update transaction");
  }
  return response.data;
};

// Delete a transaction
export const deleteTransaction = async (id: number): Promise<boolean> => {
  const response = await axios.delete(
    `${API_URL}/transactions/${id}`, 
    getAuthHeader()
  );
  return response.data.deleted;
};

// Get all transactions for a specific budget
export const getTransactionsByBudget = async (budgetId: number): Promise<TransactionResponse[]> => {
  const response = await axios.get(
    `${API_URL}/transactions/budget/${budgetId}`, 
    getAuthHeader()
  );
  return response.data;
};

// Get income/expense summary for the current user
export const getUserIncomeExpense = async (): Promise<{ income: number; expense: number }> => {
  const response = await axios.get(
    `${API_URL}/transactions/summary`, 
    getAuthHeader()
  );
  return response.data;
};

// Get category group statistics for a specific budget
export const getCategoryGroupStatistics = async (budgetId: number): Promise<CategoryGroupStatistics[]> => {
  const response = await axios.get(
    `${API_URL}/transactions/statistics/category-group/${budgetId}`, 
    getAuthHeader()
  );
  return response.data;
};

// Get top expenses for the current user
export const getTopExpenses = async (limit = 10): Promise<TransactionResponse[]> => {
  const response = await axios.get(
    `${API_URL}/transactions/top-expenses?limit=${limit}`, 
    getAuthHeader()
  );
  return response.data;
};

// Get recent transactions
export const getRecentTransactions = async (limit = 5): Promise<TransactionResponse[]> => {
  const response = await axios.get(
    `${API_URL}/transactions/recent?limit=${limit}`, 
    getAuthHeader()
  );
  return response.data;
};

// Lấy dữ liệu thu nhập và chi tiêu theo từng tháng
export const getMonthlyIncomeExpense = async (year = new Date().getFullYear()) => {
  try {
    const response = await axios.get(`${API_URL}/transactions/monthly?year=${year}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly income/expense data:", error);
    throw error;
  }
};

// Lấy dữ liệu thu nhập và chi tiêu cho tất cả các budget
export const getAllBudgetIncomeExpense = async () => {
  try {
    const response = await axios.get(`${API_URL}/budgets/transactions/summary`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("Error fetching all budget income/expense data:", error);
    throw error;
  }
};

// Get pie chart data for both income and expense
export const getPieChartData = async (budgetId?: number): Promise<PieChartResponse> => {
  const url = budgetId 
    ? `${API_URL}/transactions/pie-chart?budgetId=${budgetId}`
    : `${API_URL}/transactions/pie-chart`;
  
  const response = await axios.get(url, getAuthHeader());
  return response.data;
};

// Get pie chart data for expenses only
export const getExpensePieChartData = async (budgetId?: number): Promise<PieChartData[]> => {
  const url = budgetId 
    ? `${API_URL}/transactions/pie-chart/expense?budgetId=${budgetId}`
    : `${API_URL}/transactions/pie-chart/expense`;
  
  const response = await axios.get(url, getAuthHeader());
  return response.data;
};

// Get pie chart data for income only
export const getIncomePieChartData = async (budgetId?: number): Promise<PieChartData[]> => {
  const url = budgetId 
    ? `${API_URL}/transactions/pie-chart/income?budgetId=${budgetId}`
    : `${API_URL}/transactions/pie-chart/income`;
  
  const response = await axios.get(url, getAuthHeader());
  return response.data;
};

export default {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByBudget,
  getUserIncomeExpense,
  getCategoryGroupStatistics,
  getTopExpenses,
  getRecentTransactions,
  getMonthlyIncomeExpense,
  getAllBudgetIncomeExpense,
  getPieChartData,
  getExpensePieChartData,
  getIncomePieChartData,
};