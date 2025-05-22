import axios from "axios";
import { GoalSpendingData } from "@/types/GoalSpendingData";

export interface GoalSpendingRequest {
  budgetId: number;
  categoryGroupId: number;
  goalAmount: number;
  month: string; // ISO format (yyyy-MM-dd), ngày đầu tháng
  repeatMonth: boolean;
}

export interface GoalSpendingOverview {
  goalAmount: number;
  totalSpent: number;
  totalRemaining: number;
  spentPercentage: number;
}

// Lấy danh sách Goal theo BudgetId
export const getGoalSpendings = async (budgetId: number): Promise<GoalSpendingData[]> => {
  const response = await axios.get(`/api/goals/budget/${budgetId}`);
  return response.data;
};

// Lấy tổng quan Goal theo tháng và budgetId
export const getGoalSpendingOverview = async (
  budgetId: number,
  month: string // ISO string
): Promise<GoalSpendingOverview> => {
  const response = await axios.get(`/api/goals/overview`, {
    params: { budgetId, month }
  });
  return response.data;
};

// Tạo mới Goal
export const createGoalSpending = async (
  data: GoalSpendingRequest
): Promise<GoalSpendingData> => {
  const response = await axios.post("/api/goals", data);
  return response.data;
};

// Cập nhật Goal
export const updateGoalSpending = async (
  id: number,
  data: GoalSpendingRequest
): Promise<GoalSpendingData> => {
  const response = await axios.put(`/api/goals/${id}`, data);
  return response.data;
};

// Xoá Goal
export const deleteGoalSpending = async (id: number): Promise<void> => {
  await axios.delete(`/api/goals/${id}`);
};

//Lấy các transaction theo CategoryGroupId
export const getGoalSpendingTransactions = async (
  categoryGroupId: number
): Promise<{ income: number; expense: number }> => {
  const response = await axios.get(`/api/transactions/category/${categoryGroupId}`);
  return response.data;
}