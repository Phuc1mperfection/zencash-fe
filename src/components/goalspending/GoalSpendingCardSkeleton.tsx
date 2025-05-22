import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function GoalSpendingCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Goal Progress Stats */}
          <div className="flex justify-between text-sm font-medium">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-5 w-10" />
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <Skeleton className="h-2 w-full" />
          </div>

          {/* Spent and Left Values */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Spent</p>
              <Skeleton className="h-5 w-16" />
            </div>
            <div>
              <p className="text-muted-foreground">Remaining</p>
              <Skeleton className="h-5 w-16" />
            </div>
          </div>

          {/* Tags or Category Groups */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
