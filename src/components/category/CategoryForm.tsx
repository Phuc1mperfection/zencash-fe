import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  // selectedBudgetId,
  // budgets,
  onNameChange,
  onIconChange,
  onDefaultChange,
  // onBudgetChange,
  onCancel,
  onSubmit,
  submitLabel,
}) => {
  const [icons, setIcons] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIcons = async () => {
      setLoading(true);
      try {
        const response = await iconService.getIcons();
        if (response.status === "success" && response.data) {
          setIcons(response.data);
        } else {
          setError(response.error || "Failed to load icons");
        }
      } catch (err) {
        setError("Error loading icons");
        console.error("Error loading icons:", err);
      } finally {
        setLoading(false);
      }
    };

    loadIcons();
  }, []);

  // Get filename only from full path or filename
  const getFilenameFromPath = (path: string): string => {
    if (!path) return "";
    return path.split("/").pop() || path;
  };

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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {categoryIcon ? (
                    <div className="flex items-center">
                      <img
                        src={iconService.getIconUrl(
                          getFilenameFromPath(categoryIcon)
                        )}
                        alt="Selected icon"
                        className="h-5 w-5 mr-2"
                      />
                      <span className="truncate">
                        {getFilenameFromPath(categoryIcon)}
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
                  {error && (
                    <div className="text-center text-red-500 py-2">{error}</div>
                  )}
                  <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                    {icons.map((icon, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="p-2 h-auto aspect-square"
                        onClick={() => onIconChange(icon)}
                      >
                        <img
                          src={iconService.getIconUrl(icon)}
                          alt={`Icon ${index + 1}`}
                          className="h-8 w-8"
                        />
                      </Button>
                    ))}
                    {icons.length === 0 && !loading && !error && (
                      <div className="col-span-4 text-center text-muted-foreground py-4">
                        No icons available
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
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
