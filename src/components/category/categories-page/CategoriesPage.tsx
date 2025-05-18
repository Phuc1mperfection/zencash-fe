import { FC } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CategoryGroupContainer } from "./CategoryGroupContainer";
import { DeleteConfirmDialog } from "../DeleteConfirmDialog";
import { useCategoriesPage } from "@/hooks/useCategoriesPage";

export const CategoriesPage: FC = () => {
  const {
    // State
    categoryGroups,
    groupCategories,
    expandedGroups,
    newGroupName,
    editingGroupId,
    editingGroupName,
    isAddingCategory,
    newCategoryName,
    newCategoryIcon,
    newCategoryIsDefault,
    selectedBudgetId,
    activeBudgetId,
    budgets,
    editingCategory,
    isDeleteDialogOpen,

    // Setters
    setNewGroupName,
    setEditingGroupName,
    setNewCategoryName,
    setNewCategoryIcon,
    setNewCategoryIsDefault,
    setSelectedBudgetId,
    setActiveBudgetId,

    // Actions
    toggleGroupExpansion,
    handleCreateGroup,
    handleEditGroupClick,
    handleSaveGroupEdit,
    handleCancelGroupEdit,
    handleAddCategoryClick,
    handleCreateCategory,
    handleEditCategory,
    handleSaveCategory,
    handleToggleCategoryDefault,
    handleConfirmDelete,
    handleCategoryNameChange,
    handleCategoryIconChange,
    handleCategoryDefaultChange,
    handleCategoryBudgetChange,
    setIsDeleteDialogOpen,
  } = useCategoriesPage();

  return (
    <div className="container p-4 sm:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>

            {/* Budget Selector */}
            <Select
            value={activeBudgetId?.toString()}
            onValueChange={(value) => setActiveBudgetId(Number(value))}
            >
            <SelectTrigger className="w-[200px] border border-white  ">
              <SelectValue placeholder="Select Budget" />
            </SelectTrigger>
            <SelectContent>
              {budgets.map((budget) => (
              <SelectItem key={budget.id} value={budget.id.toString()}>
                {budget.name}
              </SelectItem>
              ))}
            </SelectContent>
            </Select>
        </div>

        <div className="flex items-center gap-2">
          <Input
            className="max-w-xs"
            placeholder="New category group..."
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <Button onClick={handleCreateGroup}>
            <Plus className="mr-2 h-4 w-4" />
            Add Group
          </Button>
        </div>
      </div>

      {/* Sử dụng CategoryGroupContainer mới */}
      <CategoryGroupContainer
        categoryGroups={categoryGroups}
        groupCategories={groupCategories}
        expandedGroups={expandedGroups}
        editingGroupId={editingGroupId}
        editingGroupName={editingGroupName}
        isAddingCategory={isAddingCategory}
        newCategoryName={newCategoryName}
        newCategoryIcon={newCategoryIcon}
        newCategoryIsDefault={newCategoryIsDefault}
        selectedBudgetId={selectedBudgetId}
        budgets={budgets}
        editingCategory={editingCategory}
        onToggleExpand={toggleGroupExpansion}
        onEditClick={handleEditGroupClick}
        onDeleteClick={(id) => setIsDeleteDialogOpen({ type: "group", id })}
        onAddCategory={handleAddCategoryClick}
        onGroupNameChange={setEditingGroupName}
        onSaveEdit={handleSaveGroupEdit}
        onCancelEdit={handleCancelGroupEdit}
        onCreateCategory={handleCreateCategory}
        onNewCategoryNameChange={setNewCategoryName}
        onNewCategoryIconChange={setNewCategoryIcon}
        onNewCategoryDefaultChange={setNewCategoryIsDefault}
        onBudgetIdChange={setSelectedBudgetId}
        onEditCategory={handleEditCategory}
        onSaveCategory={handleSaveCategory}
        onEditCategoryNameChange={handleCategoryNameChange}
        onEditCategoryIconChange={handleCategoryIconChange}
        onEditCategoryDefaultChange={handleCategoryDefaultChange}
        onEditCategoryBudgetChange={handleCategoryBudgetChange}
        onToggleCategoryDefault={handleToggleCategoryDefault}
        onDeleteCategory={(id) =>
          setIsDeleteDialogOpen({ type: "category", id })
        }
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!isDeleteDialogOpen}
        type={isDeleteDialogOpen?.type || "category"}
        onClose={() => setIsDeleteDialogOpen(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
