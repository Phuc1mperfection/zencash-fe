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

export default {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByBudget,
  getUserIncomeExpense,
  getCategoryGroupStatistics,
  getTopExpenses,
};