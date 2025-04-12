import { useEffect } from "react";
import { formatCurrency } from "@/utils/currencyFormatter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBudget } from "@/hooks/useBudget";

export function BudgetOverview() {
  const { budgetOverview, fetchBudgetOverview, getProgressClass } = useBudget();

  useEffect(() => {
    fetchBudgetOverview();
  }, [fetchBudgetOverview]);

  const progressClass = getProgressClass(budgetOverview.spentPercentage);

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
          {/* Total Budget */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Total Budget
            </p>
            <p className="text-3xl font-bold">
              {formatCurrency(budgetOverview.totalBudget)}
            </p>
          </div>

          {/* Spent So Far */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Spent So Far
            </p>
            <p className="text-3xl font-bold">
              {formatCurrency(budgetOverview.totalSpent)}
            </p>
          </div>

          {/* Remaining */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Remaining
            </p>
            <p className="text-3xl font-bold text-zen-green">
              {formatCurrency(budgetOverview.totalRemaining)}
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
              className={`h-full ${progressClass} rounded-full transition-all`}
              style={{ width: `${budgetOverview.spentPercentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
