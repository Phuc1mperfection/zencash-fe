import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { formatCurrency } from "@/utils/currencyFormatter";
import { getAllBudgetIncomeExpense } from "@/services/transactionService";

// Interface để phản ánh đúng định dạng API
interface BudgetTransactionSummary {
  totalIncome: number;
  totalExpense: number;
}

// Format dữ liệu cho Radial Chart
interface RadialChartData {
  name: string;
  income: number;
  expense: number;
}

const chartConfig = {
  income: {
    label: "Income",
    color: "#4ade80", // Green color for income
  },
  expense: {
    label: "Expense",
    color: "#E21D48", // Red color for expense
  },
} satisfies ChartConfig;

export const BudgetIncomeExpenseChart = () => {
  const [data, setData] = useState<RadialChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [differencePercentage, setDifferencePercentage] = useState<number>(0);
  const [isPositiveBalance, setIsPositiveBalance] = useState<boolean>(true);

  useEffect(() => {
    const fetchBudgetData = async () => {
      setIsLoading(true);
      setError(null);

      try {
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

        // Format data for the radial chart
        const income = Number(transactionData.totalIncome);
        const expense = Number(transactionData.totalExpense);

        // Calculate total for center display
        const totalAmount = income + expense;
        setTotal(totalAmount);

        // Calculate difference percentage for the footer
        const difference = income - expense;
        const percentage =
          expense > 0
            ? Math.round((difference / expense) * 100)
            : income > 0
            ? 100
            : 0;

        setDifferencePercentage(Math.abs(percentage));
        setIsPositiveBalance(difference >= 0);

        // Set chart data
        setData([
          {
            name: "Budget Summary",
            income: income,
            expense: expense,
          },
        ]);
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
      <Card className="w-full mt-6 flex flex-col">
        <CardHeader className="items-center pb-0">
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
      <Card className="w-full mt-6 flex flex-col">
        <CardHeader className="items-center pb-0">
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
      <Card className="w-full mt-6 flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Budget Income & Expense</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="text-muted-foreground">No budget data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-6 flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Budget Income & Expense</CardTitle>
        <CardDescription>
          {/* {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })} */}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={data}
            endAngle={180}
            innerRadius={100}
            outerRadius={130}
            startAngle={0}
            cy="50%"
            barSize={20}
          >
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => [
                    formatCurrency(value as number),
                    name,
                  ]}
                />
              }
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {formatCurrency(total, false)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Total Flow
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="income"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-income)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="expense"
              fill="var(--color-expense)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <div className="flex justify-center gap-8 py-2">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-[#4ade80]"></div>
          <span className="text-sm">
            Income: {formatCurrency(data[0].income)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-[#E21D48]"></div>
          <span className="text-sm">
            Expense: {formatCurrency(data[0].expense)}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-sm px-6 pb-4 text-center">
        {" "}
        <div
          className={`flex items-center justify-center gap-2 font-medium leading-none ${
            isPositiveBalance ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositiveBalance ? "Positive balance" : "Negative balance"} by{" "}
          {differencePercentage}%
          <TrendingUp
            className={`h-4 w-4 ${isPositiveBalance ? "" : "rotate-180"}`}
          />
        </div>
      </div>
    </Card>
  );
};
