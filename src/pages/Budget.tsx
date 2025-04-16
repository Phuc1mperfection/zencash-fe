import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, MoreVertical } from "lucide-react";
import { formatCurrency } from "@/utils/currencyFormatter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BudgetForm } from "@/components/budget/BudgetForm";
import { EditBudgetForm } from "@/components/budget/EditBudgetForm";
import { DeleteConfirmDialog } from "@/components/budget/DeleteConfirmDialog";
import { BudgetOverview } from "@/components/budget/BudgetOverview";
import { useBudget } from "@/hooks/useBudget";
import { BudgetData } from "@/types/BudgetData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Budget = () => {
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetData | null>(null);

  // Use the enhanced useBudget hook with extracted functions
  const {
    budgetsWithCategories,
    loadBudgetsWithCategories,
    calculateBudgetStats,
    getProgressClass,
    handleDeleteBudget,
    isLoading,
  } = useBudget();

  // Load budgets only once when component mounts
  useEffect(() => {
    loadBudgetsWithCategories();
  }, [loadBudgetsWithCategories]); // Properly memoized dependency

  // Handle budget refresh after operations
  const refreshBudgets = useCallback(() => {
    loadBudgetsWithCategories();
  }, [loadBudgetsWithCategories]);

  // Handle edit budget click
  const handleEditClick = useCallback((budget: BudgetData) => {
    setTimeout(() => {
      setSelectedBudget(budget);
      setIsEditBudgetOpen(true);
    }, 0);
  }, []);

  // Handle delete budget click
  const handleDeleteClick = useCallback((budget: BudgetData) => {
   
    setTimeout(() => {
      setSelectedBudget(budget);
      setIsDeleteDialogOpen(true);
    }, 0);
  }, []);

  // Handle confirmed budget deletion
  const handleDeleteConfirm = useCallback(async () => {
    if (selectedBudget) {
      const success = await handleDeleteBudget(selectedBudget.id);
      if (success) {
        setTimeout(() => {
          setIsDeleteDialogOpen(false);
          setSelectedBudget(null);
          refreshBudgets();
        }, 0);
      }
    }
  }, [selectedBudget, handleDeleteBudget, refreshBudgets]);

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

      {/* Budget Overview Component */}
      <BudgetOverview />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgetsWithCategories.map((budget) => {
          const { spent, left, percentage } = calculateBudgetStats(budget);
          const progressClass = getProgressClass(percentage);

          return (
            <Card key={budget.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{budget.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditClick(budget)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(budget)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Budget Progress Stats */}
                  <div className="flex justify-between text-sm font-medium">
                    <div className="text-2xl font-bold">
                      {formatCurrency(spent)}
                      <span className="text-sm text-muted-foreground ml-1">
                        / {formatCurrency(budget.totalAmount)}
                      </span>
                    </div>
                    <span
                      className={
                        percentage >= 90 ? "text-destructive font-bold" : ""
                      }
                    >
                      {percentage}%
                    </span>
                  </div>

                  {/* Using shadcn UI Progress component with custom styling based on percentage */}
                  <div className="relative">
                    <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${progressClass} rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Spent and Left Values */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Spent</p>
                      <p className="font-medium ">{formatCurrency(spent)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Left</p>
                      <p
                        className={`font-medium ${
                          left <= 0 ? "text-destructive" : ""
                        }`}
                      >
                        {formatCurrency(left > 0 ? left : 0)}
                      </p>
                    </div>
                  </div>

                  {/* Categories */}
                  {(budget.categories?.length ?? 0) > 0 && (
                    <div className="mt-4">
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
        onBudgetCreated={refreshBudgets}
      />

      {/* Budget Edit Modal */}
      <EditBudgetForm
        open={isEditBudgetOpen}
        onOpenChange={setIsEditBudgetOpen}
        onBudgetUpdated={refreshBudgets}
        budget={selectedBudget}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDeleteConfirm}
        entityName={selectedBudget?.name || "budget"}
      />
    </div>
  );
};

export default Budget;
