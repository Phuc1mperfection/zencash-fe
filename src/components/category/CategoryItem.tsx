import React, { useEffect } from "react";
import { Pencil, Trash2, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { CategoryResponse } from "@/types/CategoryResponse";
import { BudgetData } from "@/types/BudgetData";
import { useState } from "react";
import iconService from "@/services/iconService";

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
  onEditIconChange?: (icon: string) => void;
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
  onEditIconChange,
  onEditDefaultChange,
  // onEditBudgetChange,
}) => {
  const isEditing = editingCategory?.id === category.id;
  const [icons, setIcons] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Get filename only from full path or filename
  const getFilenameFromPath = (path: string): string => {
    if (!path) return "";
    return path.split("/").pop() || path;
  };

  useEffect(() => {
    if (isEditing) {
      // Load icons when editing begins
      const loadIcons = async () => {
        setLoading(true);
        try {
          const response = await iconService.getIcons();
          if (response.status === "success" && response.data) {
            setIcons(response.data);
          }
        } catch (err) {
          console.error("Error loading icons:", err);
        } finally {
          setLoading(false);
        }
      };

      loadIcons();
    }
  }, [isEditing]);

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

  return (
    <div className="flex items-center justify-between p-2 border rounded-md bg-card">
      {isEditing && editingCategory ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="space-y-2">
            <Input
              value={editingCategory.name}
              onChange={(e) => onEditNameChange?.(e.target.value)}
              className="mb-2"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {editingCategory.icon ? (
                    <div className="flex items-center">
                      <img
                        src={iconService.getIconUrl(
                          getFilenameFromPath(editingCategory.icon)
                        )}
                        alt="Selected icon"
                        className="h-5 w-5 mr-2"
                      />
                      <span className="truncate">
                        {getFilenameFromPath(editingCategory.icon)}
                      </span>
                    </div>
                  ) : (
                    <span>Select an icon</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0">
                <div className="p-2">
                  <h4 className="font-medium mb-2">Choose an icon</h4>
                  {loading && (
                    <div className="text-center py-4">Loading icons...</div>
                  )}
                  <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                    {icons.map((icon, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="p-2 h-auto aspect-square"
                        onClick={() => onEditIconChange?.(icon)}
                      >
                        <img
                          src={iconService.getIconUrl(icon)}
                          alt={`Icon ${index + 1}`}
                          className="h-8 w-8"
                        />
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-4">
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
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            {category.icon && (
              <img
                src={iconService.getIconUrl(getFilenameFromPath(category.icon))}
                alt={`${category.name} icon`}
                className="h-5 w-5"
              />
            )}
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
