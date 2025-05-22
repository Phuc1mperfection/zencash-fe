import { useCallback, useEffect, useState } from "react";
import {
  createGoalSpending,
  deleteGoalSpending,
  getGoalSpendings,
  getGoalSpendingOverview,
  updateGoalSpending,
  GoalSpendingRequest,
} from "@/services/goalSpendingService";
import { GoalSpendingData } from "@/types/GoalSpendingData";

export interface GoalSpendingOverview {
  goalAmount: number;
  totalSpent: number;
  totalRemaining: number;
  spentPercentage: number;
}

export function useGoalSpending(budgetId: number, month: string) {
  const [goalSpendings, setGoalSpendings] = useState<GoalSpendingData[]>([]);
  const [goalSpendingOverview, setGoalSpendingOverview] = useState<GoalSpendingOverview>({
    goalAmount: 0,
    totalSpent: 0,
    totalRemaining: 0,
    spentPercentage: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const fetchGoalSpendings = useCallback(async () => {
    try {
      const data = await getGoalSpendings(budgetId);
      setGoalSpendings(data);
    } catch (err) {
      setError("Failed to fetch goal spendings");
    }
  }, [budgetId]);

  const fetchGoalSpendingOverview = useCallback(async () => {
    try {
      const data = await getGoalSpendingOverview(budgetId, month);
      const withGoalAmount: GoalSpendingOverview = {
        ...data,
        goalAmount: data.goalAmount 
      };
      setGoalSpendingOverview(withGoalAmount);
    } catch (err) {
      setError("Failed to fetch goal overview");
    }
  }, [budgetId, month]);

  const create = useCallback(async (data: GoalSpendingRequest) => {
    try {
      const created = await createGoalSpending(data);
      setGoalSpendings(prev => [...prev, created]);
      await fetchGoalSpendingOverview();
    } catch (err) {
      setError("Failed to create goal spending");
    }
  }, [fetchGoalSpendingOverview]);

  const update = useCallback(async (id: number, data: GoalSpendingRequest) => {
    try {
      const updated = await updateGoalSpending(id, data);
      setGoalSpendings(prev => prev.map(item => item.id === id ? updated : item));
      await fetchGoalSpendingOverview();
    } catch (err) {
      setError("Failed to update goal spending");
    }
  }, [fetchGoalSpendingOverview]);

  const remove = useCallback(async (id: number) => {
    try {
      await deleteGoalSpending(id);
      setGoalSpendings(prev => prev.filter(item => item.id !== id));
      await fetchGoalSpendingOverview();
    } catch (err) {
      setError("Failed to delete goal spending");
    }
  }, [fetchGoalSpendingOverview]);

  const getProgressClass = (percentage: number): string => {
    if (percentage >= 90) return "bg-destructive";
    if (percentage >= 75) return "bg-amber-500";
    return "bg-zen-green";
  };

  const fetchSingleGoalOverview = useCallback(
  async (budgetId: number, month: string) => {
    try {
      const overview = await getGoalSpendingOverview(budgetId, month);
      return {
        ...overview,
        budgetId, // Add the budgetId to the response
      };
    } catch (error) {
      console.error(`Failed to fetch overview for budget ID ${budgetId} in month ${month}:`, error);
      return null;
    }
  },
  [] // Empty dependencies, will only be created once unless needed
);


  useEffect(() => {
    fetchGoalSpendings();
    fetchGoalSpendingOverview();
  }, [fetchGoalSpendings, fetchGoalSpendingOverview]);

  return {
    goalSpendingOverview,
    goalSpendings,
    error,
    create,
    update,
    remove,
    fetchGoalSpendings,
    fetchGoalSpendingOverview,
    fetchSingleGoalOverview,
    getProgressClass
  };
}
