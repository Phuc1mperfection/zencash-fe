"use client";

import * as React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Cell, Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getIncomePieChartData,
  getExpensePieChartData,
  PieChartData,
} from "@/services/transactionService";
import { formatCurrency } from "@/utils/currencyFormatter";
import { getBudgets } from "@/services/budgetService";
import { BudgetData } from "@/types/BudgetData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define chart colors with CSS variables from tailwind theme
const INCOME_COLORS = [
  "#22c55e", // green-500
  "#088737", // material green
  "#113A1C", // green-600
  "#135527", // green-400
  "#0F2015", // green-700
  "#66bb6a", // material light green
];

// Màu cho expense pie chart
const EXPENSE_COLORS = [
  "#ef4444", // red-500
  "#E21C49", // red-400
  "#E8526F", // red-600
  "#F07F92", // red-700
  "#ef5350", // material red
  "#e57373", // material light red
];

// Convert API data to chart format
const formatChartData = (data: PieChartData[], colors: string[]) => {
  return data.map((item, index) => {
    // Lấy màu từ mảng colors, nếu index vượt quá độ dài mảng thì quay lại từ đầu
    const colorIndex = index % colors.length;
    const fillColor = colors[colorIndex];

    return {
      categoryName: item.categoryName,
      categoryId: item.categoryId,
      amount: item.totalAmount,
      count: item.count,
      fill: fillColor,
    };
  });
};

// Chart config for tooltips
const incomeChartConfig = {
  amount: {
    label: "Income",
  },
  categoryName: {
    label: "",
  },
  // Thêm các config màu cho biểu đồ
  ...Object.fromEntries(
    INCOME_COLORS.map((color, i) => [`category-${i}`, { color }])
  ),
} satisfies ChartConfig;

// Chart config for tooltips
const expenseChartConfig = {
  amount: {
    label: "Expense",
  },
  categoryName: {
    label: "Category",
  },
  // Thêm các config màu cho biểu đồ
  ...Object.fromEntries(
    EXPENSE_COLORS.map((color, i) => [`category-${i}`, { color }])
  ),
} satisfies ChartConfig;

export function IncomeExpensePieChart() {
  const [incomeData, setIncomeData] = React.useState<PieChartData[]>([]);
  const [expenseData, setExpenseData] = React.useState<PieChartData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("expense");
  const [budgets, setBudgets] = React.useState<BudgetData[]>([]);
  const [selectedBudgetId, setSelectedBudgetId] = React.useState<
    number | undefined
  >(undefined);

  // Calculate totals
  const totalIncome = React.useMemo(() => {
    return incomeData.reduce((acc, curr) => acc + curr.totalAmount, 0);
  }, [incomeData]);

  const totalExpense = React.useMemo(() => {
    return expenseData.reduce((acc, curr) => acc + curr.totalAmount, 0);
  }, [expenseData]);

  // Fetch budgets on component mount
  React.useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const budgetsData = await getBudgets();
        setBudgets(budgetsData);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    };

    fetchBudgets();
  }, []);

  // Fetch data when selectedBudgetId changes
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [incomeResponse, expenseResponse] = await Promise.all([
          getIncomePieChartData(selectedBudgetId),
          getExpensePieChartData(selectedBudgetId),
        ]);

        setIncomeData(incomeResponse);
        setExpenseData(expenseResponse);
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedBudgetId]);

  // Format chart data
  const formattedIncomeData = React.useMemo(
    () => formatChartData(incomeData, INCOME_COLORS),
    [incomeData]
  );
  const formattedExpenseData = React.useMemo(
    () => formatChartData(expenseData, EXPENSE_COLORS),
    [expenseData]
  );

  // Get selected budget name
  const selectedBudgetName = React.useMemo(() => {
    if (!selectedBudgetId) return "All Budgets";
    const budget = budgets.find((b) => b.id === selectedBudgetId);
    return budget ? budget.name : "Unknown Budget";
  }, [selectedBudgetId, budgets]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-2 ">
        <CardTitle>Category Distribution</CardTitle>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <CardDescription>Income & Expense Breakdown</CardDescription>

          <div className="ml-auto p-2 ">
            <Select
              value={selectedBudgetId?.toString()}
              onValueChange={(value) =>
                setSelectedBudgetId(value ? Number(value) : undefined)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Budgets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All Budgets</SelectItem>
                {budgets.map((budget) => (
                  <SelectItem key={budget.id} value={budget.id.toString()}>
                    {budget.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
        <TabsList className="mx-4 grid w-auto grid-cols-2">
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expense">Expense</TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="w-full">
          <CardContent className="flex-1 p-6">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="text-muted-foreground">
                  Loading chart data...
                </div>
              </div>
            ) : formattedIncomeData.length === 0 ? (
              <div className="flex items-center justify-center">
                <div className="text-muted-foreground">
                  No income data available
                  {selectedBudgetId ? ` for ${selectedBudgetName}` : ""}
                </div>
              </div>
            ) : (
              <ChartContainer
                config={incomeChartConfig}
                className="mx-auto aspect-square max-h-[400px] "
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        formatter={(value, name, item) => {
                          if (name === "amount") {
                            return formatCurrency(value as number);
                          }
                          return item?.payload?.categoryName || value;
                        }}
                        labelFormatter={(label, payload) => {
                          if (payload && payload.length > 0) {
                            return `${label} (${formatCurrency(
                              payload[0].value as number
                            )})`;
                          }
                          return label;
                        }}
                        labelKey="categoryName"
                      />
                    }
                  />
                  <Pie
                    data={formattedIncomeData}
                    dataKey="amount"
                    nameKey="categoryName"
                    innerRadius={90}
                    outerRadius={180}
                    strokeWidth={5}
                  >
                    {formattedIncomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}{" "}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          const totalCount = incomeData.reduce(
                            (sum, item) => sum + item.count,
                            0
                          );
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) - 12}
                                className="fill-foreground text-lg font-bold"
                              >
                                {formatCurrency(totalIncome)}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 12}
                                className="fill-muted-foreground text-sm"
                              >
                                Total Income
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 32}
                                className="fill-green-600 text-xs"
                              >
                                ({totalCount} transactions)
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none text-green-600">
              <TrendingUp className="h-4 w-4" /> Income by category
              {selectedBudgetId ? ` (${selectedBudgetName})` : ""}
            </div>
            <div className="leading-none text-muted-foreground">
              {formattedIncomeData.length} categories of income sources
            </div>
          </CardFooter>
        </TabsContent>

        <TabsContent value="expense" className="w-full">
          <CardContent className="flex-1 pb-7">
            {isLoading ? (
              <div className="flex h-[250px] items-center justify-center">
                <div className="text-muted-foreground">
                  Loading chart data...
                </div>
              </div>
            ) : formattedExpenseData.length === 0 ? (
              <div className="flex h-[250px] items-center justify-center">
                <div className="text-muted-foreground">
                  No expense data available
                  {selectedBudgetId ? ` for ${selectedBudgetName}` : ""}
                </div>
              </div>
            ) : (
              <ChartContainer
                config={expenseChartConfig}
                className="mx-auto aspect-square max-h-[400px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        formatter={(value, name, item) => {
                          if (name === "amount") {
                            return formatCurrency(value as number);
                          }
                          return item?.payload?.categoryName || value;
                        }}
                        labelFormatter={(label, payload) => {
                          if (payload && payload.length > 0) {
                            return `${label} (${formatCurrency(
                              payload[0].value as number
                            )})`;
                          }
                          return label;
                        }}
                        labelKey="categoryName"
                      />
                    }
                  />
                  <Pie
                    data={formattedExpenseData}
                    dataKey="amount"
                    nameKey="categoryName"
                    innerRadius={90}
                    outerRadius={180}
                    strokeWidth={5}
                  >
                    {formattedExpenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}{" "}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          const totalCount = expenseData.reduce(
                            (sum, item) => sum + item.count,
                            0
                          );
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) - 12}
                                className="fill-foreground text-lg font-bold"
                              >
                                {formatCurrency(totalExpense)}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 12}
                                className="fill-muted-foreground text-sm"
                              >
                                Total Expense
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 32}
                                className="fill-red-600 text-xs"
                              >
                                ({totalCount} transactions)
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none text-red-600">
              <TrendingDown className="h-4 w-4" /> Expenses by category
              {selectedBudgetId ? ` (${selectedBudgetName})` : ""}
            </div>
            <div className="leading-none text-muted-foreground">
              {formattedExpenseData.length} categories of expenses
            </div>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
