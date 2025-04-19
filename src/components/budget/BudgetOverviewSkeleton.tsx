import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BudgetOverviewSkeleton() {
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
            <Skeleton className="h-8 w-32" />
          </div>

          {/* Spent So Far */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Spent So Far
            </p>
            <Skeleton className="h-8 w-32" />
          </div>

          {/* Remaining */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Remaining
            </p>
            <Skeleton className="h-8 w-32" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Overall Progress</p>
            <Skeleton className="h-4 w-10" />
          </div>

          <Skeleton className="h-3 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
