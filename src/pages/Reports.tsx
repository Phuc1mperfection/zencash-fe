import { MonthlyIncomeExpenseChart } from "@/components/reports/MonthlyIncomeExpenseChart";
import { BudgetIncomeExpenseChart } from "@/components/reports/BudgetIncomeExpenseChart";
import { useBudget } from "@/hooks/useBudget";
import { useEffect } from "react";
import { IncomeExpensePieChart } from "@/components/reports/IncomeExpensePieChart";
const Reports = () => {
  const { fetchBudgetOverview } = useBudget();

  useEffect(() => {
    fetchBudgetOverview();
  }, [fetchBudgetOverview]);
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
        {/* Biểu đồ thu nhập và chi tiêu */}
        <IncomeExpensePieChart />

        {/* Biểu đồ thu nhập và chi tiêu theo ngân sách */}
        <BudgetIncomeExpenseChart />
      </div>
      {/* Net Income */}
    
    </div>
  );
};

export default Reports;
