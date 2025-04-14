import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
// 

import { BudgetData } from "@/types/BudgetData";

interface CategoryFormProps {
  categoryName: string;
  isDefault: boolean;
  selectedBudgetId: string;
  budgets: BudgetData[];
  onNameChange: (name: string) => void;
  onDefaultChange: (isDefault: boolean) => void;
  onBudgetChange: (budgetId: number) => void;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  categoryName,
  isDefault,
  // selectedBudgetId,
  // budgets,
  onNameChange,
  onDefaultChange,
  // onBudgetChange,
  onCancel,
  onSubmit,
  submitLabel,
}) => {
  return (
    <Card className="bg-muted/20 p-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="mb-2 text-sm font-medium">Category Name</p>
            <Input
              placeholder="Category name"
              value={categoryName}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>
          {/* <div>
            <p className="mb-2 text-sm font-medium">Budget</p>
            <Select value={selectedBudgetId} onValueChange={onBudgetChange}>
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
          </div> */}
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={isDefault}
            onCheckedChange={() => onDefaultChange(!isDefault)}
          />
          <span>Default Category</span>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={onSubmit}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
};
