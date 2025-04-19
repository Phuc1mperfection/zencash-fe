import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/currencyFormatter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBudget, BudgetOverview } from "@/hooks/useBudget";
import { AlertCircle } from "lucide-react";
import { BudgetOverviewSkeleton } from "./BudgetOverviewSkeleton";

interface SingleBudgetOverviewProps {
  budgetId: number;
  budgetName: string;
}

export function SingleBudgetOverview({
  budgetId,
  budgetName,
}: SingleBudgetOverviewProps) {
  const { fetchSingleBudgetOverview, getProgressClass } = useBudget();
  const [isLoading, setIsLoading] = useState(true);
  const [budgetOverview, setBudgetOverview] = useState<BudgetOverview | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBudgetOverview = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchSingleBudgetOverview(budgetId);
        if (data) {
          console.log(`Loaded overview for budget ${budgetId}:`, data);
          setBudgetOverview(data);
        } else {
          setError("Failed to load budget overview");
        }
      } catch (err) {
        console.error("Error loading budget overview:", err);
        setError("Failed to load budget overview. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (budgetId) {
      loadBudgetOverview();
    }
  }, [budgetId, fetchSingleBudgetOverview]);

  // Determine progress bar class based on percentage
  const progressClass = budgetOverview
    ? getProgressClass(budgetOverview.spentPercentage)
    : "bg-zen-green";

  if (isLoading) {
    return <BudgetOverviewSkeleton />;
  }

  if (error || !budgetOverview) {
    return (
      <Card className="mb-4">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="mt-3 text-md font-medium">
            Could not load budget overview
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
      </Card>
    );
  }

  // Thêm cảnh báo nếu tiêu quá nhiều - sử dụng dữ liệu chính xác từ API
  const isOverBudget = budgetOverview.totalRemaining < 0;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{budgetName} - Overview</span>
          {isOverBudget && (
            <span className="text-destructive flex items-center text-sm font-medium">
              <AlertCircle className="h-4 w-4 mr-1" />
              Over budget
            </span>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your spending for this specific budget.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Budget */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Total Budget
            </p>
            <p className="text-2xl font-bold">
              {formatCurrency(budgetOverview.totalBudget)}
            </p>
          </div>

          {/* Spent So Far */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Spent So Far
            </p>
            <p className="text-2xl font-bold">
              {formatCurrency(budgetOverview.totalSpent)}
            </p>
          </div>

          {/* Remaining */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Remaining
            </p>
            <p
              className={`text-2xl font-bold ${
                isOverBudget ? "text-destructive" : "text-zen-green"
              }`}
            >
              {formatCurrency(Math.abs(budgetOverview.totalRemaining))}
              {isOverBudget && <span className="text-xs ml-1">overspent</span>}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Budget Usage</p>
            <p
              className={`text-sm font-medium ${
                budgetOverview.spentPercentage >= 100
                  ? "text-destructive"
                  : budgetOverview.spentPercentage >= 90
                  ? "text-amber-500"
                  : ""
              }`}
            >
              {budgetOverview.spentPercentage}%
            </p>
          </div>

          <div className="h-3 w-full bg-primary/20 rounded-full overflow-hidden">
            <div
              className={`h-full ${progressClass} rounded-full transition-all ${
                isOverBudget ? "animate-pulse" : ""
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
