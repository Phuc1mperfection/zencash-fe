import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCurrencySymbol } from "@/utils/currencyFormatter";
import { useGoalSpending } from "@/hooks/useGoalSpending";
import { useCategoryGroup } from "@/hooks/useCategoryGroup";
import { CategoryGroup } from "@/hooks/useCategoryGroup";
import React from "react";

const formSchema = z.object({
  goalAmount: z.coerce
    .number()
    .positive({ message: "Amount must be greater than 0." }),
  categoryGroupId: z.coerce.number({
    message: "Please select a category group.",
  }),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Invalid month format (yyyy-MM)"),
  repeatMonth: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface GoalSpendingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalCreated: () => void;
  budgetId: number;
}

export function GoalSpendingForm({
  open,
  onOpenChange,
  onGoalCreated,
  budgetId,
}: GoalSpendingFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goalAmount: 0,
      categoryGroupId: 0,
      month: new Date().toISOString().slice(0, 7), // yyyy-MM
      repeatMonth: false,
    },
  });
  const { create } = useGoalSpending(budgetId, form.watch("month"));
  const [loading, setLoading] = React.useState(false);
  const { groups: categoryGroups, loading: loadingGroups } = useCategoryGroup();

  // Ensure categoryGroups is always an array
  const safeGroups = Array.isArray(categoryGroups) ? categoryGroups : [];

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currency = user.currency || "VND";
  const currencySymbol = getCurrencySymbol();
  const step = currency === "VND" ? 10000 : 0.1;
  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      // Check if valid category group is selected
      if (values.categoryGroupId === 0 && safeGroups.length > 0) {
        form.setError("categoryGroupId", {
          type: "manual",
          message: "Please select a category group",
        });
        return;
      }

      await create({
        ...values,
        budgetId,
        month: values.month + "-01", // chuẩn hoá sang yyyy-MM-01
      });
      form.reset();
      onOpenChange(false);
      onGoalCreated();
    } catch (error) {
      console.error("Failed to create goal", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Goal</DialogTitle>
          <DialogDescription>
            Set a spending goal for a category group this month.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="categoryGroupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Group</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a group" />
                      </SelectTrigger>
                    </FormControl>{" "}
                    <SelectContent>
                      {loadingGroups ? (
                        <SelectItem value="loading" disabled>
                          Loading groups...
                        </SelectItem>
                      ) : safeGroups.length > 0 ? (
                        safeGroups.map((group: CategoryGroup) => (
                          <SelectItem
                            key={group.id}
                            value={group.id.toString()}
                          >
                            {group.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="empty" disabled>
                          No category groups available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the category group this goal applies to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        {currencySymbol}
                      </span>
                      <Input
                        type="number"
                        className="pl-7"
                        step={step}
                        placeholder="0"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Set your spending limit.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Month</FormLabel>
                  <FormControl>
                    <Input
                      type="month"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repeatMonth"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(Boolean(checked))
                    }
                  />
                  <FormLabel>Repeat Monthly</FormLabel>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating..." : "Create Goal"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
