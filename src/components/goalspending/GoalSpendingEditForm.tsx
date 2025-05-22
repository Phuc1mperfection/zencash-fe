import { useForm } from "react-hook-form";
import { useCategoryGroup } from "@/hooks/useCategoryGroup";
import { GoalSpendingData } from "@/types/GoalSpendingData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Props {
  goal: GoalSpendingData;
  onSubmit: (data: GoalSpendingData) => void;
  onCancel: () => void;
}

export function GoalSpendingEditForm({ goal, onSubmit, onCancel }: Props) {
  const { groups } = useCategoryGroup();
  const form = useForm({
    defaultValues: {
      categoryGroupId: goal.categoryGroupId,
      goalAmount: goal.goalAmount,
      repeatMonth: goal.repeatMonth,
      month: goal.month.slice(0, 7),
    },
  });

  const watchedAmount = form.watch("goalAmount");
  const isWarning = goal.spentAmount >= watchedAmount * 0.8;

  const handleSubmit = (data: any) => {
    onSubmit({
      ...goal,
      ...data,
      month: data.month + "-01",
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div>
        <Label>Category Group</Label>
        <Select
          value={form.watch("categoryGroupId").toString()}
          onValueChange={(value) => form.setValue("categoryGroupId", parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category group" />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.id.toString()}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Month</Label>
        <Input
          type="month"
          value={form.watch("month")}
          onChange={(e) => form.setValue("month", e.target.value)}
        />
      </div>

      <div>
        <Label>Goal Amount</Label>
        <Input
          type="number"
          value={form.watch("goalAmount")}
          onChange={(e) => form.setValue("goalAmount", Number(e.target.value))}
        />
        {isWarning && (
          <p className="text-sm text-red-600">
            Warning: You’ve spent {Math.round((goal.spentAmount / watchedAmount) * 100)}% of your goal!
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={form.watch("repeatMonth")}
          onCheckedChange={(val) => form.setValue("repeatMonth", Boolean(val))}
        />
        <Label>Repeat Monthly</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
