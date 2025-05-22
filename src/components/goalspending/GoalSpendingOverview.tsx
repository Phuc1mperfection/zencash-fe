import { formatCurrency } from "@/utils/currencyFormatter";
import { useState, useEffect } from "react";
import { useGoalSpending } from "@/hooks/useGoalSpending";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Giả sử bạn lấy budgetId và month từ props hoặc context
interface GoalSpendingOverviewProps {
  budgetId: number;
  month: string; // ISO yyyy-MM-dd
}

export function GoalSpendingOverview({ budgetId, month }: GoalSpendingOverviewProps) {
  const {
    goalSpendingOverview,
    fetchGoalSpendingOverview,
    getProgressClass,
  } = useGoalSpending(budgetId, month);

  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    fetchGoalSpendingOverview();
  }, [fetchGoalSpendingOverview]);

  useEffect(() => {
    if (goalSpendingOverview?.totalRemaining < 0) {
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [goalSpendingOverview?.totalRemaining]);

  if (!goalSpendingOverview) return null;

  const progressClass = getProgressClass(goalSpendingOverview.spentPercentage || 0);
  const isOverBudget = (goalSpendingOverview?.totalRemaining || 0) < 0;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Monthly Budget Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your monthly spending against your budgeted amount.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
            <p className="text-3xl font-bold">
              {formatCurrency(goalSpendingOverview.goalAmount)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Spent So Far</p>
            <p className="text-3xl font-bold">
              {formatCurrency(goalSpendingOverview.totalSpent)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Remaining</p>
            <p
              className={`text-3xl font-bold ${
                isOverBudget ? "text-destructive" : "text-zen-green"
              }`}
            >
              {formatCurrency(Math.abs(goalSpendingOverview.totalRemaining))}
              {isOverBudget && <span className="text-xs ml-1">overspent</span>}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Overall Progress</p>
            <p
              className={`text-sm font-medium ${
                goalSpendingOverview.spentPercentage >= 90 ? "text-destructive" : ""
              }`}
            >
              {goalSpendingOverview.spentPercentage}%
            </p>
          </div>

          <div className="h-3 w-full bg-primary/20 rounded-full overflow-hidden">
            <div
              className={`h-full ${progressClass} rounded-full transition-all duration-500 ${
                shouldAnimate ? "animate-pulse" : ""
              }`}
              style={{
                width: `${Math.min(100, goalSpendingOverview.spentPercentage)}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
