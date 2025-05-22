import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function GoalSpendingOverviewSkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Goal Spending Overview</CardTitle>
        <p className="text-sm text-muted-foreground">Track your spending against your goal amount.</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total Goal</p>
            <Skeleton className="h-8 w-32" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Spent So Far</p>
            <Skeleton className="h-8 w-32" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Remaining</p>
            <Skeleton className="h-8 w-32" />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Goal Progress</p>
            <Skeleton className="h-4 w-10" />
          </div>

          <Skeleton className="h-3 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
