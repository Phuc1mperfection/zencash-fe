import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getUserIncomeExpense } from "@/services/transactionService";
import { formatCurrency } from "@/utils/currencyFormatter";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#00ed64", "#ff6b6b", "#00b8d4"];

const IncomeExpenseChart = () => {
  const [summaryData, setSummaryData] = useState([
    { name: "Income", value: 0 },
    { name: "Expense", value: 0 },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        setIsLoading(true);
        const { income, expense } = await getUserIncomeExpense();

        setSummaryData([
          { name: "Income", value: income },
          { name: "Expense", value: expense },
        ]);

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching summary data:", err);
        setError("Failed to load income and expense data");
        setIsLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  const hasData = summaryData.some((item) => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Income vs Expenses
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          A visual representation of your income and expenses.
        </p>
      </CardHeader>

      <div className="h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ed64]"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        ) : !hasData ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Chưa có transaction nên không có data cho PieChart</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={summaryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {summaryData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #ffffff20",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#ffffff" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default IncomeExpenseChart;
