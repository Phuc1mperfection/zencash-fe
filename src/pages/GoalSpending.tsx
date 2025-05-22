import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { GoalSpendingForm } from "@/components/goalspending/GoalSpendingForm";
import { GoalSpendingList } from "@/components/goalspending/GoalSpendingList";
import { GoalSpendingOverview } from "@/components/goalspending/GoalSpendingOverview";
import { useGoalSpending } from "@/hooks/useGoalSpending";
import { GoalSpendingData } from "@/types/GoalSpendingData";
import { GoalSpendingEditForm } from "@/components/goalspending/GoalSpendingEditForm";
import { DeleteConfirmDialog } from "@/components/goalspending/DeleteConfirmDialog";

export const GoalSpending = () => {
  const [openAddForm, setOpenAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalSpendingData | null>(
    null
  );

  // Get current month in YYYY-MM format
  const currentMonth = new Date().toISOString().slice(0, 7);
  // You would get the actual budgetId from your auth context or elsewhere
  const budgetId = 1; // Replace with actual budgetId from context if available

  const { goalSpendings, fetchGoalSpendings, remove } = useGoalSpending(
    budgetId,
    currentMonth + "-01"
  );
  useEffect(() => {
    fetchGoalSpendings();
  }, [fetchGoalSpendings]);

  const handleEditGoal = (goal: GoalSpendingData) => {
    setSelectedGoal(goal);
    setShowEditForm(true);
  };

  const handleDeleteGoal = (goal: GoalSpendingData) => {
    setSelectedGoal(goal);
    setIsDeleteDialogOpen(true);
  };

  const handleGoalCreated = () => {
    fetchGoalSpendings();
  };

  const handleGoalUpdated = () => {
    setShowEditForm(false);
    fetchGoalSpendings();
  };

  const handleGoalDeleted = async () => {
    if (selectedGoal) {
      await remove(selectedGoal.id);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <Card className="w-full h-full bg-white/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 dark:shadow-slate-900/20 p-6 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Goal Spending
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage your spending goals effectively.
            </p>
          </div>
          <Button
            onClick={() => setOpenAddForm(true)}
            className="px-4 flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Goal
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Overview section */}
        <GoalSpendingOverview
          budgetId={budgetId}
          month={currentMonth + "-01"}
        />{" "}
        {/* Goals list */}
        {Array.isArray(goalSpendings) && goalSpendings.length > 0 ? (
          <GoalSpendingList
            goals={goalSpendings}
            onEdit={handleEditGoal}
            onDelete={handleDeleteGoal}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              You haven't created any spending goals yet.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setOpenAddForm(true)}
            >
              Create your first goal
            </Button>
          </div>
        )}
      </CardContent>

      {/* Add Goal Form Dialog */}
      <GoalSpendingForm
        open={openAddForm}
        onOpenChange={setOpenAddForm}
        onGoalCreated={handleGoalCreated}
        budgetId={budgetId}
      />

      {/* Edit Goal Form Dialog */}
      {selectedGoal && showEditForm && (
        <GoalSpendingEditForm
          goal={selectedGoal}
          onSubmit={handleGoalUpdated}
          onCancel={() => setShowEditForm(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedGoal && (
        <DeleteConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onDelete={handleGoalDeleted}
          entityName="spending goal"
        />
      )}
    </Card>
  );
};

export default GoalSpending;
