import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FontAwesomeIconPicker } from "@/components/ui/font-awesome-picker";
import iconService from "@/services/iconService";
import { BudgetData } from "@/types/BudgetData";

interface CategoryFormProps {
  categoryName: string;
  categoryIcon?: string;
  isDefault: boolean;
  selectedBudgetId: string;
  budgets: BudgetData[];
  onNameChange: (name: string) => void;
  onIconChange: (icon: string) => void;
  onDefaultChange: (isDefault: boolean) => void;
  onBudgetChange: (budgetId: number) => void;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  categoryName,
  categoryIcon = "",
  isDefault,
  selectedBudgetId,
  budgets,
  onNameChange,
  onIconChange,
  onDefaultChange,
  onBudgetChange,
  onCancel,
  onSubmit,
  submitLabel,
}) => {

  // Ensure Font Awesome is loaded
  useEffect(() => {
    const loadFontAwesome = async () => {
      try {
        await iconService.loadFontAwesomeCDN();
      } catch (error) {
        console.error("Failed to load Font Awesome:", error);
      }
    };

    loadFontAwesome();
  }, []);

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
          <div>
            <p className="mb-2 text-sm font-medium">Icon</p>
            <FontAwesomeIconPicker
              value={categoryIcon}
              onChange={onIconChange}
              buttonLabel="Select an icon"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={isDefault}
              onCheckedChange={(checked) => {
                if (typeof checked === "boolean") {
                  onDefaultChange(checked);
                }
              }}
            />
            <label
              htmlFor="isDefault"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Default Category
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Associated Budget</label>
          <select
            className="w-full p-2 rounded-md border border-input bg-transparent text-sm"
            value={selectedBudgetId}
            onChange={(e) => onBudgetChange(Number(e.target.value))}
          >
            <option value="">None</option>
            {budgets.map((budget) => (
              <option key={budget.id} value={budget.id}>
                {budget.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>{submitLabel}</Button>
        </div>
      </div>
    </Card>
  );
};
