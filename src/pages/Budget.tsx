import { useEffect, useState } from "react";
import { getBudgets } from "@/services/budgetService";
import { formatCurrency } from "@/utils/currencyFormatter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BudgetData } from "@/types/BudgetData";

const Budget = () => {

  const [budgets, setBudgets] = useState<BudgetData[]>([]);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const data = await getBudgets();
        setBudgets(data);
      } catch (error) {
        console.error("Failed to fetch budgets", error);
      }
    };

    fetchBudgets();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Budget</h2>
        <p className="text-muted-foreground">
          Manage your budget and track your spending
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => (
          <Card key={budget.id}>
            <CardHeader>
              <CardTitle>{budget.name}</CardTitle>
              <CardDescription>Total Budget</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(budget.totalAmount)}</div>
              <p className="text-xs text-muted-foreground">
                Remaining: {formatCurrency(budget.remainingAmount)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Budget;
