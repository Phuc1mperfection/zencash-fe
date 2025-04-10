import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getCategoriesByBudget } from "@/services/categoryService";
import { formatCurrency } from "@/utils/currencyFormatter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BudgetData } from "@/types/BudgetData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BudgetForm } from "@/components/budget/BudgetForm";
import { useBudget } from "@/hooks/useBudget";

const Budget = () => {
  const [budgetsWithCategories, setBudgetsWithCategories] = useState<
    BudgetData[]
  >([]);
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const { fetchBudgets, isLoading } = useBudget();

  const loadBudgetsWithCategories = async () => {
    try {
      const budgetData = await fetchBudgets();

      // Get categories for each budget
      const budgetsWithCats = await Promise.all(
        budgetData.map(async (budget: BudgetData) => {
          const categories = await getCategoriesByBudget(budget.id);
          return { ...budget, categories };
        })
      );

      setBudgetsWithCategories(budgetsWithCats);
    } catch (error) {
      console.error("Failed to fetch budgets with categories", error);
    }
  };

  useEffect(() => {
    loadBudgetsWithCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Budget</h2>
          <p className="text-muted-foreground">
            Manage your budget and track your spending
          </p>
        </div>

        <Button  onClick={() => setIsAddBudgetOpen(true)} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgetsWithCategories.map((budget) => (
          <Card key={budget.id}>
            <CardHeader>
              <CardTitle>{budget.name}</CardTitle>
              <CardDescription>Total Budget</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(budget.totalAmount)}
              </div>
              <p className="text-xs text-muted-foreground">
                Remaining: {formatCurrency(budget.remainingAmount)}
              </p>

              {/* Categories */}
              {budget.categories?.length ? (
                <div className="mt-4 space-y-1">
                  <div className="flex flex-wrap gap-2">
                    {budget.categories.map((cat) => (
                      <Badge key={cat.id} variant="secondary" className="break-all">
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm mt-4 text-muted-foreground">
                  No categories
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget Creation Modal */}
      <BudgetForm
        open={isAddBudgetOpen}
        onOpenChange={setIsAddBudgetOpen}
        onBudgetCreated={loadBudgetsWithCategories}
      />
    </div>
  );
};

export default Budget;
