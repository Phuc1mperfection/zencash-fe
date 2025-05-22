import { GoalSpendingData } from "@/types/GoalSpendingData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/currencyFormatter";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  goals: GoalSpendingData[];
  onEdit: (goal: GoalSpendingData) => void;
  onDelete: (goal: GoalSpendingData) => void;
}

export function GoalSpendingList({ goals, onEdit, onDelete }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => {
        const percentage = Math.round((goal.spentAmount / goal.goalAmount) * 100);
        const isWarning = percentage >= 80;
        const isOver = goal.spentAmount > goal.goalAmount;

        return (
          <Card key={goal.id} className="overflow-hidden">
            <CardHeader className="pb-2 flex justify-between items-start">
              <CardTitle>Goal for {goal.month.slice(0, 7)}</CardTitle>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(goal)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(goal)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {formatCurrency(goal.spentAmount)}{" "}
                  <span className="text-sm text-muted-foreground">
                    / {formatCurrency(goal.goalAmount)}
                  </span>
                </div>
                <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${isOver ? "bg-red-500" : isWarning ? "bg-yellow-500" : "bg-green-500"} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Progress:</span> {percentage}%
                </div>
                {isWarning && (
                  <p className="text-sm text-red-600">
                    Warning: You’ve spent {percentage}% of your goal!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
