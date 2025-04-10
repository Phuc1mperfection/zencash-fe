import  {FC, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryGroup } from "../CategoryGroup";
import { CategoryResponse } from "@/types/CategoryResponse";
import { BudgetData } from "@/types/BudgetData";
import { CategoryGroupType } from "@/hooks/useCategoriesPage";

interface CategoryGroupContainerProps {
  categoryGroups: CategoryGroupType[];
  groupCategories: Record<number, CategoryResponse[]>;
  expandedGroups: Record<number, boolean>;
  editingGroupId: number | null;
  editingGroupName: string;
  isAddingCategory: number | null;
  newCategoryName: string;
  newCategoryIsDefault: boolean;
  selectedBudgetId: string;
  budgets: BudgetData[];
  editingCategory: CategoryResponse | null;
  onToggleExpand: (groupId: number) => void;
  onEditClick: (group: CategoryGroupType) => void;
  onDeleteClick: (id: number) => void;
  onAddCategory: (groupId: number) => void;
  onGroupNameChange: (name: string) => void;
  onSaveEdit: (groupId: number) => void;
  onCancelEdit: () => void;
  onCreateCategory: (groupId: number) => void;
  onNewCategoryNameChange: (name: string) => void;
  onNewCategoryDefaultChange: (isDefault: boolean) => void;
  onBudgetIdChange: (budgetId: string) => void;
  onEditCategory: (category: CategoryResponse | null) => void;
  onToggleCategoryDefault: (category: CategoryResponse) => void;
  onDeleteCategory: (id: number) => void;
  onSaveCategory: () => void;
  onEditCategoryNameChange: (name: string) => void;
  onEditCategoryDefaultChange: (isDefault: boolean) => void;
  onEditCategoryBudgetChange: (budgetId: string) => void;
}

export const CategoryGroupContainer: FC<CategoryGroupContainerProps> =
  memo(
    ({
      categoryGroups,
      groupCategories,
      expandedGroups,
      editingGroupId,
      editingGroupName,
      isAddingCategory,
      newCategoryName,
      newCategoryIsDefault,
      selectedBudgetId,
      budgets,
      editingCategory,
      onToggleExpand,
      onEditClick,
      onDeleteClick,
      onAddCategory,
      onGroupNameChange,
      onSaveEdit,
      onCancelEdit,
      onCreateCategory,
      onNewCategoryNameChange,
      onNewCategoryDefaultChange,
      onBudgetIdChange,
      onEditCategory,
      onToggleCategoryDefault,
      onDeleteCategory,
      onSaveCategory,
      onEditCategoryNameChange,
      onEditCategoryDefaultChange,
      onEditCategoryBudgetChange,
    }) => {
      if (categoryGroups.length === 0) {
        return (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <p>
                No category groups found. Create your first group to get
                started.
              </p>
            </CardContent>
          </Card>
        );
      }

      return (
        <div className="space-y-4">
          {categoryGroups.map((group) => (
            <CategoryGroup
              key={group.id}
              group={group}
              expanded={expandedGroups[group.id] || false}
              categories={groupCategories[group.id]}
              budgets={budgets}
              editingCategory={editingCategory}
              onToggleExpand={() => onToggleExpand(group.id)}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
              onAddCategory={onAddCategory}
              editingGroupId={editingGroupId}
              editingGroupName={editingGroupName}
              isAddingCategory={isAddingCategory}
              newCategoryName={newCategoryName}
              newCategoryIsDefault={newCategoryIsDefault}
              selectedBudgetId={selectedBudgetId}
              onGroupNameChange={onGroupNameChange}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              onCreateCategory={onCreateCategory}
              onNewCategoryNameChange={onNewCategoryNameChange}
              onNewCategoryDefaultChange={onNewCategoryDefaultChange}
              onBudgetIdChange={onBudgetIdChange}
              onEditCategory={onEditCategory}
              onToggleCategoryDefault={onToggleCategoryDefault}
              onDeleteCategory={onDeleteCategory}
              onSaveCategory={onSaveCategory}
              onEditCategoryNameChange={onEditCategoryNameChange}
              onEditCategoryDefaultChange={onEditCategoryDefaultChange}
              onEditCategoryBudgetChange={onEditCategoryBudgetChange}
            />
          ))}
        </div>
      );
    }
  );

CategoryGroupContainer.displayName = "CategoryGroupContainer";
