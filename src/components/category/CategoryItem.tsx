import React, { useEffect } from "react";
import { Pencil, Trash2, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

import { CategoryResponse } from "@/types/CategoryResponse";
import { BudgetData } from "@/types/BudgetData";
interface CategoryItemProps {
  category: CategoryResponse;
  budgets: BudgetData[];
  editingCategory?: CategoryResponse | null;
  onEdit: () => void;
  onToggleDefault: () => void;
  onDelete: () => void;
  onCancelEdit?: () => void;
  onSaveEdit?: () => void;
  onEditNameChange?: (name: string) => void;
  onEditDefaultChange?: (isDefault: boolean) => void;
  onEditBudgetChange?: (budgetId: number) => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  budgets,
  editingCategory,
  onEdit,
  onToggleDefault,
  onDelete,
  onCancelEdit,
  onSaveEdit,
  onEditNameChange,
  onEditDefaultChange,
  // onEditBudgetChange,
}) => {
  const isEditing = editingCategory?.id === category.id;

  useEffect(() => {
    if (isEditing) {
      console.log("Editing category with budgetId:", editingCategory?.budgetId);
      console.log("Available budgets:", budgets);
    }
  }, [isEditing, editingCategory, budgets]);

  // Tìm budget tương ứng với category
  const matchedBudget = category.budgetId
    ? budgets.find((b) => b.id.toString() === category.budgetId?.toString())
    : null;

  const handleCancelEdit = () => {
    console.log("Cancel edit button clicked");
    console.log("onCancelEdit function exists:", !!onCancelEdit);
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  // const handleBudgetChange = (value: number) => {
  //   if (onEditBudgetChange) {
  //     // Convert "none" to undefined or the value to a number
  //     const budgetId = value === 0 ? undefined : Number(value);
  //     onEditBudgetChange(budgetId as number);
  //   }
  // };

  return (
    <div className="flex items-center justify-between p-2 border rounded-md bg-card">
      {isEditing && editingCategory ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div>
            <Input
              value={editingCategory.name}
              onChange={(e) => onEditNameChange?.(e.target.value)}
            />
          </div>
          <div>
            {/* <Select
              value={
                editingCategory.budgetId
                  ? editingCategory.budgetId.toString()
                  : "none"
              }
              onValueChange={handleBudgetChange}

            >
              <SelectTrigger>
                <SelectValue placeholder="Select budget">
                  {editingCategory.budgetId
                    ? budgets.find(
                        (b) =>
                          b.id.toString() ===
                          editingCategory.budgetId?.toString()
                      )?.name || "Select budget"
                    : "None"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {budgets.map((budget) => (
                  <SelectItem key={budget.id} value={budget.id.toString()}>
                    {budget.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={editingCategory.defaultCat}
              onCheckedChange={() =>
                onEditDefaultChange?.(!editingCategory.defaultCat)
              }
            />
            <span>Default</span>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
              <X className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onSaveEdit}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={category.defaultCat}
              onCheckedChange={onToggleDefault}
            />
            <span>{category.name}</span>
            {category.budgetId && (
              <Badge
                variant="secondary"
                className="text-xs bg-primary/20 text-primary-foreground py-1 px-2 rounded-full"
              >
                {matchedBudget
                  ? matchedBudget.name
                  : `Budget ID: ${category.budgetId}`}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
