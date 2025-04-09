import React from "react";
import { Pencil, Trash2, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  onEditBudgetChange?: (budgetId: string) => void;
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
  onEditBudgetChange,
}) => {
  const isEditing = editingCategory?.id === category.id;

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
            <Select
              value={editingCategory.budgetId || "none"}
              onValueChange={(value) => onEditBudgetChange?.(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {budgets.map((budget) => (
                  <SelectItem key={budget.id} value={budget.id.toString()}>
                    {budget.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={editingCategory.isDefault}
              onCheckedChange={() =>
                onEditDefaultChange?.(!editingCategory.isDefault)
              }
            />
            <span>Default</span>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={onCancelEdit}>
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
              checked={category.isDefault}
              onCheckedChange={onToggleDefault}
            />
            <span>{category.name}</span>
            {category.budgetId && (
              <span className="text-xs bg-primary/20 text-primary-foreground py-1 px-2 rounded-full">
                {budgets.find((b) => b.id.toString() === category.budgetId)
                  ?.name || "Budget"}
              </span>
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
