import { Button } from "@/components/ui/button";
import { Card,CardHeader } from "@/components/ui/card";

export const GoalSpending = () => {
  return (
 <Card className="w-full h-full bg-white/50 dark:bg-slate-900/50  rounded-xl border border-slate-200 dark:border-slate-800  dark:shadow-slate-900/20 p-6 transition-all duration-300">
    <CardHeader>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Goal Spending</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your spending goals effectively.</p>
    </CardHeader>
    <Button>
      
    </Button>
    </Card>
  );
};

export default GoalSpending;
