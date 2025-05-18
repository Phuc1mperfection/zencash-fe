import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/currencyFormatter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBudget } from "@/hooks/useBudget";
export function BudgetOverview() {
  const { budgetOverview, fetchBudgetOverview, getProgressClass } = useBudget();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    fetchBudgetOverview();
  }, [fetchBudgetOverview]);

  useEffect(() => {
    if (budgetOverview?.totalRemaining < 0) {
      // Trigger animation when overspent
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 2000); // only pulse for 2s
      return () => clearTimeout(timer);
    }
  }, [budgetOverview?.totalRemaining]);

  const progressClass = getProgressClass(budgetOverview?.spentPercentage || 0);
  const isOverBudget = (budgetOverview?.totalRemaining || 0) < 0;



  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Monthly Budget Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your monthly spending against your budgeted amount.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 ">
          {/* Total Budget */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
            <p className="text-3xl font-bold">{formatCurrency(budgetOverview.totalBudget)}</p>
          </div>

          {/* Spent So Far */}
          {/* <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Spent So Far</p>
            <p className="text-3xl font-bold">{formatCurrency(budgetOverview.totalSpent)}</p>
          </div> */}

          {/* Remaining */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Remaining</p>
            <p
              className={`text-3xl font-bold ${
                isOverBudget ? "text-destructive" : "text-zen-green"
              }`}
            >
              {formatCurrency(Math.abs(budgetOverview.totalRemaining))}
              {isOverBudget && <span className="text-xs ml-1">overspent</span>}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Overall Progress</p>
            <p
              className={`text-sm font-medium ${
                budgetOverview.spentPercentage >= 90 ? "text-destructive" : ""
              }`}
            >
              {budgetOverview.spentPercentage}%
            </p>
          </div>

          <div className="h-3 w-full bg-primary/20 rounded-full overflow-hidden">
            <div
              className={`h-full ${progressClass} rounded-full transition-all duration-500 ${
                shouldAnimate ? "animate-pulse" : ""
              }`}
              style={{
                width: `${Math.min(100, budgetOverview.spentPercentage)}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
