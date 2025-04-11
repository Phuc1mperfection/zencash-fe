import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/utils/currencyFormatter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BudgetForm } from "@/components/budget/BudgetForm";
import { useBudget } from "@/hooks/useBudget";

const Budget = () => {
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const { 
    isLoading, 
    budgetsWithCategories, 
    loadBudgetsWithCategories, 
    calculateBudgetStats, 
    getProgressColor 
  } = useBudget();


  useEffect(() => {
    loadBudgetsWithCategories();
    
  }, [loadBudgetsWithCategories]);



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Budget</h2>
          <p className="text-muted-foreground">
            Manage your budget and track your spending
          </p>
        </div>
        
        <Button onClick={() => setIsAddBudgetOpen(true)} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgetsWithCategories.map((budget) => {
          const { spent, left, percentage } = calculateBudgetStats(budget);
          const progressColor = getProgressColor(percentage);
          
          return (
            <Card key={budget.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{budget.name}</CardTitle>
                    {/* <CardDescription>Monthly budget</CardDescription> */}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Budget Progress Stats */}
                  <div className="flex justify-between text-sm font-medium">
                    <span>{formatCurrency(spent)}/{formatCurrency(budget.totalAmount)}</span>
                    <span className={percentage >= 90 ? "text-destructive font-bold" : ""}>{percentage}%</span>
                  </div>
                  
                  {/* Progress Bar with dynamic color */}
                  <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${progressColor} transition-all duration-300 ease-in-out`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  
                  {/* Spent and Left Values */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Spent</p>
                      <p className="font-medium">{formatCurrency(spent)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Left</p>
                      <p className={`font-medium ${left <= 0 ? "text-destructive" : ""}`}>
                      {formatCurrency(left > 0 ? left : 0)}
                      </p>
                    </div>
                    </div>

                  {/* Categories */}
                  {(budget.categories?.length ?? 0) > 0 && (
                    <div className="mt-4">
                      {/* <p className="text-xs text-muted-foreground mb-2">Categories</p> */}
                      <div className="flex flex-wrap gap-2 break-all">
                        {budget.categories?.map((cat) => (
                          <Badge key={cat.id} variant="secondary">
                            {cat.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
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
