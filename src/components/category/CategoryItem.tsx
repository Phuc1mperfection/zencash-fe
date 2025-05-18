import React, { useEffect } from "react";
import { Pencil, Trash2, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FontAwesomeIconPicker } from "@/components/ui/font-awesome-picker";
import { CategoryResponse } from "@/types/CategoryResponse";
import { BudgetData } from "@/types/BudgetData";
import iconService from "@/services/iconService";
import { renderIcon } from "@/utils/iconUtils";

interface CategoryItemProps {
  category: CategoryResponse;
  budgets: BudgetData[];
  editingCategory: CategoryResponse | null;
  onEdit: () => void;
  onToggleDefault: () => void;
  onDelete: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditNameChange: (name: string) => void;
  onEditIconChange?: (icon: string) => void;
  onEditDefaultChange?: (isDefault: boolean) => void;
  onEditBudgetChange?: (budgetId: number) => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  // budgets,
  editingCategory,
  onEdit,
  onDelete,
  onCancelEdit,
  onSaveEdit,
  onEditNameChange,
  onEditIconChange,
}) => {
  const isEditing = editingCategory?.id === category.id;

  // Get matched budget
  // const matchedBudget = budgets.find((b) => b.id === category.budgetId);


  // Function to render icon based on its type (Font Awesome or image URL)
 

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

  const handleCancelEdit = () => {
    onCancelEdit();
  };

  return (
    <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
      {isEditing ? (
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Input
                value={editingCategory.name}
                onChange={(e) => onEditNameChange(e.target.value)}
                className="h-8"
                placeholder="Category name"
              />
            </div>
            <div>
              <FontAwesomeIconPicker
                value={editingCategory.icon || ""}
                onChange={(icon) => onEditIconChange?.(icon)}
                buttonLabel="Select icon"
              />
            </div>
          </div>
          <div>
            {/* <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                checked={editingCategory.defaultCat}
                onCheckedChange={() =>
                  onEditDefaultChange?.(!editingCategory.defaultCat)
                }
              />
              <span>Default</span>
            </div> */}
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onSaveEdit}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            {/* {category.icon && renderIcon(category.icon)} */}
            {/* <Checkbox
              checked={category.defaultCat}
              onCheckedChange={onToggleDefault}
              /> */}
                {/* <span>{category.name}</span> */}
                
            {category.budgetId && (
              <Badge variant="default">
                <span className="mr-4">{category.icon &&  renderIcon(category.icon)}</span>
                
                {category.name}
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
