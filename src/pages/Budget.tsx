import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BudgetForm } from "@/components/budget/BudgetForm";
import { EditBudgetForm } from "@/components/budget/EditBudgetForm";
import { DeleteConfirmDialog } from "@/components/budget/DeleteConfirmDialog";
import { BudgetList } from "@/components/budget/BudgetList";
import { useBudget } from "@/hooks/useBudget";
import { BudgetData } from "@/types/BudgetData";

const Budget = () => {
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetData | null>(null);
  const [showSingleOverviews, setShowSingleOverviews] = useState(false);

  // Use the enhanced useBudget hook with extracted functions
  const {
    budgetsWithCategories,
    loadBudgetsWithCategories,
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

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowSingleOverviews(!showSingleOverviews)}
          >
            {showSingleOverviews ? "Hide" : "Show"} Detailed Overview
          </Button>

          <Button onClick={() => setIsAddBudgetOpen(true)} disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" />
            Add Budget
          </Button>
        </div>
      </div>

  

      {/* Budget List Component */}
      <BudgetList
        budgets={budgetsWithCategories}
        isLoading={isLoading}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        showSingleBudgetOverview={showSingleOverviews}
      />

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
