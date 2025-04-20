import React from "react";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Save,
  X,
  Plus,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryResponse } from "@/types/CategoryResponse";
import { BudgetData } from "@/types/BudgetData";
import { CategoryItem } from "./CategoryItem";
import { CategoryForm } from "./CategoryForm";

interface CategoryGroup {
  id: number;
  name: string;
}

interface CategoryGroupProps {
  group: CategoryGroup;
  expanded: boolean;
  categories: CategoryResponse[] | undefined;
  budgets: BudgetData[];
  editingCategory: CategoryResponse | null;
  localIconMappings?: { [categoryId: number]: string }; // Thêm prop để lưu trữ icon maps
  onToggleExpand: () => void;
  onDeleteClick: (groupId: number) => void;
  onEditClick: (group: CategoryGroup) => void;
  onAddCategory: (groupId: number) => void;
  editingGroupId: number | null;
  editingGroupName: string;
  isAddingCategory: number | null;
  newCategoryName: string;
  newCategoryIcon: string;
  newCategoryIsDefault: boolean;
  selectedBudgetId: string;
  onGroupNameChange: (name: string) => void;
  onSaveEdit: (groupId: number) => void;
  onCancelEdit: () => void;
  onCreateCategory: (groupId: number) => void;
  onNewCategoryNameChange: (name: string) => void;
  onNewCategoryIconChange: (icon: string) => void;
  onNewCategoryDefaultChange: (isDefault: boolean) => void;
  onBudgetIdChange: (budgetId: number) => void;
  onEditCategory: (category: CategoryResponse | null) => void;
  onSaveCategory: () => void;
  onEditCategoryNameChange: (name: string) => void;
  onEditCategoryIconChange: (icon: string) => void;
  onEditCategoryDefaultChange: (isDefault: boolean) => void;
  onEditCategoryBudgetChange: (budgetId: number) => void;
  onToggleCategoryDefault: (category: CategoryResponse) => void;
  onDeleteCategory: (categoryId: number) => void;
}

export const CategoryGroup: React.FC<CategoryGroupProps> = ({
  group,
  expanded,
  categories,
  budgets,
  editingCategory,
  onToggleExpand,
  onEditClick,
  onDeleteClick,
  onAddCategory,
  editingGroupId,
  editingGroupName,
  isAddingCategory,
  newCategoryName,
  newCategoryIcon,
  newCategoryIsDefault,
  selectedBudgetId,
  onGroupNameChange,
  onSaveEdit,
  onCancelEdit,
  onCreateCategory,
  onNewCategoryNameChange,
  onNewCategoryIconChange,
  onNewCategoryDefaultChange,
  onBudgetIdChange,
  onEditCategory,
  onSaveCategory,
  onEditCategoryNameChange,
  onEditCategoryIconChange,
  onEditCategoryDefaultChange,
  onEditCategoryBudgetChange,
  onToggleCategoryDefault,
  onDeleteCategory,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 bg-muted/20">
        <div className="flex items-center justify-between">
          {editingGroupId === group.id ? (
            <div className="flex items-center gap-2 flex-grow">
              <Input
                value={editingGroupName}
                onChange={(e) => onGroupNameChange(e.target.value)}
                className="max-w-xs"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onSaveEdit(group.id)}
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={onCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <CardTitle
              className="flex items-center gap-2 cursor-pointer"
              onClick={onToggleExpand}
            >
              {expanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
              {group.name}
            </CardTitle>
          )}

          {editingGroupId !== group.id && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEditClick(group)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteClick(group.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Add Category Button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddCategory(group.id)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>

            {/* Add Category Form */}
            {isAddingCategory === group.id && (
              <CategoryForm
                categoryName={newCategoryName}
                categoryIcon={newCategoryIcon}
                isDefault={newCategoryIsDefault}
                selectedBudgetId={selectedBudgetId}
                budgets={budgets}
                onNameChange={onNewCategoryNameChange}
                onIconChange={onNewCategoryIconChange}
                onDefaultChange={onNewCategoryDefaultChange}
                onBudgetChange={onBudgetIdChange}
                onCancel={() => onAddCategory(0)} // Pass 0 to cancel
                onSubmit={() => onCreateCategory(group.id)}
                submitLabel="Create Category"
              />
            )}

            {/* Categories List */}
            <div className="space-y-2">
              {!categories ? (
                <p className="text-center text-muted-foreground py-4">
                  Loading categories...
                </p>
              ) : categories.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No categories in this group
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2 break-all">
                  {categories.map((category) => (
                    <CategoryItem
                      key={category.id}
                      category={category}
                      budgets={budgets}
                      editingCategory={editingCategory}
                      onEdit={() => onEditCategory(category)}
                      onToggleDefault={() => onToggleCategoryDefault(category)}
                      onDelete={() => onDeleteCategory(category.id)}
                      onCancelEdit={() => onEditCategory(null)}
                      onSaveEdit={onSaveCategory}
                      onEditNameChange={onEditCategoryNameChange}
                      onEditIconChange={onEditCategoryIconChange}
                      onEditDefaultChange={onEditCategoryDefaultChange}
                      onEditBudgetChange={onEditCategoryBudgetChange}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
