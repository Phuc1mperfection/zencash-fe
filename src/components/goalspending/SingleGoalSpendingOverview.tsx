import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/currencyFormatter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

import { getGoalSpendingTransactions } from "@/services/goalSpendingService";

interface SingleGoalSpendingOverviewProps {
  goalId: number;
  goalSpendingName: string;
}

export function SingleGoalSpendingOverview({
  goalId,
  goalSpendingName,
}: SingleGoalSpendingOverviewProps) {
  const [goalSpendingOverview, setGoalSpendingOverview] = useState<any | null>(null); // Simplified type
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoalSpendingData = async () => {
      setError(null);
      try {
        const overviewData = await getGoalSpendingTransactions(goalId);
        if (overviewData) setGoalSpendingOverview(overviewData);
        else setError("Failed to load goal spending overview");
      } catch (err) {
        console.error("Error loading goal spending data:", err);
        setError("Failed to load data. Please try again.");
      }
    };

    if (goalId) loadGoalSpendingData();
  }, [goalId]);

  if (error || !goalSpendingOverview) {
    return (
      <Card className="mb-4">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="mt-3 text-md font-medium">
            Could not load goal spending overview
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{goalSpendingName} - Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your spending for this goal.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
            <p className="text-lg font-bold">
              {formatCurrency(goalSpendingOverview.goalAmount)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Spent So Far</p>
            <p className="text-lg font-bold">
              {formatCurrency(goalSpendingOverview.totalSpent)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Remaining</p>
            <p className="text-lg font-bold">
              {formatCurrency(goalSpendingOverview.remaining)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
