import { useEffect, useState } from "react";
import { BadgeAlert } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/currencyFormatter";
import { getUserIncomeExpense } from "@/services/transactionService";

export const NetIncome = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummaryData = async () => {
      setIsLoading(true);
      try {
        const { income, expense } = await getUserIncomeExpense();
        setTotalIncome(income);
        setTotalExpense(expense);
      } catch (err) {
        console.error("Error fetching summary data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  const netIncome = totalIncome - totalExpense;
  const isDeficit = netIncome < 0;

  return (
    <Card className="stat-card items-center justify-center">
      <CardHeader>
        <CardTitle>Net Income</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total income after deducting expenses.
        </p>
      </CardHeader>
      <CardContent className="text-xl font-bold mt-2">
        {isLoading ? (
          <div className="animate-pulse h-8 w-36 bg-muted rounded"></div>
        ) : (
          <p
            className={`text-2xl font-bold ${
              isDeficit ? "text-destructive" : "text-zen-green"
            }`}
          >
            {formatCurrency(Math.abs(netIncome))}
            {isDeficit && (
              <span className="text-xs ml-2 text-muted-foreground font-normal inline-flex items-center gap-1">
                deficit <BadgeAlert className="w-4 h-4 text-red-700" />
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
