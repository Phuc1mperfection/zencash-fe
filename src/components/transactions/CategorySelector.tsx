import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "@/schemas/transactionFormSchema";

interface CategoryOption {
  value: number;
  label: string;
}

interface CategorySelectorProps {
  form: UseFormReturn<TransactionFormValues>;
  categoryOptions: CategoryOption[];
  isLoading: boolean;
  onCategoryChange: (categoryId: number) => void;
}

export function CategorySelector({
  form,
  categoryOptions,
  isLoading,
  onCategoryChange,
}: CategorySelectorProps) {
  return (
    <FormField
      control={form.control}
      name="categoryId"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Category</FormLabel>
          <Select
            onValueChange={(value) => onCategoryChange(Number(value))}
            value={field.value?.toString()}
            disabled={isLoading || categoryOptions.length === 0}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select category">
                  {isLoading
                    ? "Loading categories..."
                    : field.value
                    ? categoryOptions.find(
                        (category) => category.value === field.value
                      )?.label
                    : categoryOptions.length === 0
                    ? "No categories available"
                    : "Select category"}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>
                  Loading categories...
                </SelectItem>
              ) : categoryOptions.length === 0 ? (
                <SelectItem value="none" disabled>
                  No categories found for this budget
                </SelectItem>
              ) : (
                categoryOptions.map((category) => (
                  <SelectItem
                    key={category.value}
                    value={category.value.toString()}
                  >
                    {category.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
