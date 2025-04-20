/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllBudgetIncomeExpense } from "@/services/transactionService";
import { getBudgets } from "@/services/budgetService";
import { formatCurrency } from "@/utils/currencyFormatter";

interface BudgetTransactionData {
  budgetId: number;
  budgetName: string;
  income: number;
  expense: number;
}

// Điều chỉnh interface để phản ánh đúng định dạng API
interface BudgetTransactionSummary {
  totalIncome: number;
  totalExpense: number;
}

export const BudgetIncomeExpenseChart = () => {
  const [data, setData] = useState<BudgetTransactionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBudgetData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all budgets to get their names
        const budgets = await getBudgets();

        // Lấy dữ liệu tổng thu chi từ API
        const transactionData =
          (await getAllBudgetIncomeExpense()) as BudgetTransactionSummary;

        if (
          !transactionData ||
          (!transactionData.totalIncome && !transactionData.totalExpense)
        ) {
          setError("No transaction data available");
          setIsLoading(false);
          return;
        }

        // Tạo dữ liệu giả cho từng budget dựa trên tổng số
        const totalBudgets = budgets.length;
        if (totalBudgets === 0) {
          setError("No budgets available");
          setIsLoading(false);
          return;
        }

        // Chuyển đổi dữ liệu để hiển thị
        const formattedData = budgets.map((budget: any, index: number) => {
          // Phân phối tổng income và expense giữa các budgets (chỉ để demo)
          // Trong thực tế, bạn cần API trả về dữ liệu chính xác cho từng budget
          const income = index === 0 ? Number(transactionData.totalIncome) : 0;

          const expense =
            index === 0 ? Number(transactionData.totalExpense) : 0;

          return {
            budgetId: budget.id,
            budgetName: budget.name || `Budget ${budget.id}`,
            income,
            expense,
          };
        });

        setData(formattedData);
      } catch (err) {
        console.error("Error fetching budget data:", err);
        setError("Failed to load budget income and expense data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgetData();
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>Budget Income & Expense</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            Loading data...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>Budget Income & Expense</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="text-destructive">{error}</div>
        </CardContent>
      </Card>
    );
  }

  // No data available
  if (data.length === 0) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>Budget Income & Expense</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="text-muted-foreground">No budget data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Budget Income & Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(value) => formatCurrency(value, false)}
              />
              <YAxis
                dataKey="budgetName"
                type="category"
                width={120}
                tick={(props) => {
                  const { x, y, payload } = props;
                  return (
                    <text
                      x={x}
                      y={y}
                      dy={3}
                      fontSize={12}
                      width={100}
                      textAnchor="end"
                      style={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {payload.value}
                    </text>
                  );
                }}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-md border bg-background px-3 py-2 shadow-sm">
                        <p className="font-medium text-sm mb-1">{label}</p>
                        {payload.map((entry: any, index: number) => (
                          <p
                            key={`item-${index}`}
                            className="text-sm"
                            style={{ color: entry.color }}
                          >
                            {entry.name}: {formatCurrency(entry.value)}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Legend />
              <Bar
                dataKey="income"
                name="Income"
                fill="#4ade80"
                radius={[0, 4, 4, 0]}
              >
                <LabelList
                  dataKey="income"
                  position="right"
                  formatter={(value: number) =>
                    value > 0 ? formatCurrency(value, false) : ""
                  }
                />
              </Bar>
              <Bar
                dataKey="expense"
                name="Expense"
                fill="#E21D48"
                radius={[0, 4, 4, 0]}
              >
                <LabelList
                  dataKey="expense"
                  position="right"
                  formatter={(value: number) =>
                    value > 0 ? formatCurrency(value, false) : ""
                  }
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
