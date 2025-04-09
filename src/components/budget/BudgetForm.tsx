import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { toast } from "@/hooks/use-toast";

// Sample categories with colors
const categories = [
  { label: "Housing", value: "housing", color: "bg-zen-blue" },
  { label: "Food", value: "food", color: "bg-zen-green" },
  { label: "Transportation", value: "transportation", color: "bg-purple-500" },
  { label: "Entertainment", value: "entertainment", color: "bg-amber-500" },
  { label: "Shopping", value: "shopping", color: "bg-rose-500" },
  { label: "Healthcare", value: "healthcare", color: "bg-emerald-500" },
  { label: "Utilities", value: "utilities", color: "bg-blue-500" },
  { label: "Other", value: "other", color: "bg-gray-500" },
];

const budgetFormSchema = z.object({
  category: z.string({
    required_error: "Please select a category.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be greater than 0.",
  }),
  note: z.string().optional(),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface BudgetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultValues: Partial<BudgetFormValues> = {
  amount: undefined,
  note: "",
};

export function BudgetForm({ open, onOpenChange }: BudgetFormProps) {
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  function onSubmit(data: BudgetFormValues) {
    setIsSubmitting(true);
    
    // Here you would typically send this data to an API
    console.log("Budget data:", data);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false);
      form.reset(defaultValues);
      
      toast({
        title: "Budget created",
        description: "Your budget has been successfully created.",
      });
    }, 1000);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Budget</DialogTitle>
          <DialogDescription>
            Set a monthly budget for a spending category.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Category</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="justify-between"
                        >
                          {field.value ? (
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${
                                categories.find(c => c.value === field.value)?.color || "bg-gray-400"
                              }`}></div>
                              {categories.find(
                                (category) => category.value === field.value
                              )?.label}
                            </div>
                          ) : (
                            "Select category"
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search category..." />
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                          {categories.map((category) => (
                            <CommandItem
                              value={category.label}
                              key={category.value}
                              onSelect={() => {
                                form.setValue("category", category.value);
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    category.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {category.label}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select a category for your budget.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Budget Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">$</div>
                      <Input
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        className="pl-7"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Set the maximum amount you want to spend on this category each month.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Add a note about this budget" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Creating..." : "Create Budget"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}