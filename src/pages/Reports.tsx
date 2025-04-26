import { MonthlyIncomeExpenseChart } from "@/components/reports/MonthlyIncomeExpenseChart";
import { BudgetIncomeExpenseChart } from "@/components/reports/BudgetIncomeExpenseChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/currencyFormatter";
import { BadgeAlert } from "lucide-react";
import { useBudget } from "@/hooks/useBudget";
import { useEffect, useState } from "react";
import { getUserIncomeExpense } from "@/services/transactionService";

const Reports = () => {
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const { fetchBudgetOverview } = useBudget();
    useEffect(() => {
      fetchBudgetOverview();
    }, [fetchBudgetOverview]);
    useEffect(() => {
      const fetchSummaryData = async () => {
        try {
          const { income, expense } = await getUserIncomeExpense();
          setTotalIncome(income);
          setTotalExpense(expense);
        } catch (err) {
          console.error("Error fetching summary data:", err);
        }
      };
  
      fetchSummaryData();
    }, []);
  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
        <p className="text-muted-foreground">
          Analyze your financial data with visual reports and insights.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Biểu đồ thu nhập và chi tiêu theo tháng */}
        <MonthlyIncomeExpenseChart />

        {/* Biểu đồ thu nhập và chi tiêu theo ngân sách */}
        <BudgetIncomeExpenseChart />
      </div>
           {/* Net Income */}
           <div className=" grid-cols-1 md:grid-cols-1 gap-6  mx-auto">
        <Card className="stat-card items-center justify-center">
          <CardHeader>
            <CardTitle>Net Income</CardTitle>
            <p className="text-sm text-muted-foreground">
              Total income after deducting expenses.
            </p>
          </CardHeader>
          <CardContent className="text-xl font-bold mt-2">
            <p
              className={`text-2xl font-bold ${
                totalIncome - totalExpense < 0
                  ? "text-destructive"
                  : "text-zen-green"
              }`}
            >
              {formatCurrency(Math.abs(totalIncome - totalExpense))}
              {totalIncome - totalExpense < 0 && (
                <span className="text-xs ml-2 text-muted-foreground font-normal inline-flex items-center gap-1">
                  deficit <BadgeAlert className="w-4 h-4  text-red-700 " />
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
