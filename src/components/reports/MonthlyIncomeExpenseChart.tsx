/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  Tooltip,
  LabelList
} from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card'
import { TrendingUp } from "lucide-react"
import { getMonthlyIncomeExpense } from '@/services/transactionService'
import { formatCurrency } from '@/utils/currencyFormatter'

interface MonthlyData {
  month: string
  income: number
  expense: number
}

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

export const MonthlyIncomeExpenseChart = () => {
    const [data, setData] = useState<MonthlyData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
    useEffect(() => {
      const fetchMonthlyData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await getMonthlyIncomeExpense(selectedYear);
          
          // Format data for the chart - API trả về định dạng dạng object với key là tháng
          const formattedData = monthNames.map((monthName, index) => {
            // Chuyển index (0-11) thành tháng (1-12) để khớp với API
            const monthNumber = (index + 1).toString();
            
            // Lấy dữ liệu từ response nếu có, nếu không thì dùng giá trị mặc định
            const monthData = response && response[monthNumber] 
              ? response[monthNumber] 
              : { income: 0, expense: 0 };
            
            return {
              month: monthName,
              income: Number(monthData.income) || 0,
              expense: Number(monthData.expense) || 0
            };
          });
          
          setData(formattedData);
        } catch (err) {
          console.error("Error fetching monthly data:", err);
          setError("Failed to load monthly income and expense data");
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchMonthlyData();
    }, [selectedYear]);
  
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedYear(Number(e.target.value));
    };
  
    // Generate year options for the dropdown
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let i = currentYear - 5; i <= currentYear; i++) {
      yearOptions.push(i);
    }
  

//   const yearOptions = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 5 + i)

  if (isLoading || error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Monthly Income & Expense</CardTitle>
          {error && <CardDescription className="text-destructive">{error}</CardDescription>}
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className={isLoading ? "animate-pulse text-muted-foreground" : "text-destructive"}>
            {isLoading ? "Loading..." : error}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
      <div className="flex justify-between items-center">
          <CardTitle>Monthly Income & Expense</CardTitle>
          <select 
            value={selectedYear}
            onChange={handleYearChange}
            className="p-2 border rounded-md bg-background"
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <CardDescription>{`Year: ${selectedYear}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-md border bg-background px-3 py-2 ">
                        <p className="font-medium text-sm">{label}, {selectedYear}</p>
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
                    )
                  }
                  return null
                }}
              />
              <Bar
                dataKey="income"
                name="Income"
                fill="#125526"
                radius={[4, 4, 0, 0]}
              >
                <LabelList dataKey="income" position="top" formatter={(v: number) => v > 0 ? formatCurrency(v, false) : ''} />
              </Bar>
              <Bar
                dataKey="expense"
                name="Expense"
                fill="#1CC354"
                radius={[4, 4, 0, 0]}
              >
                <LabelList dataKey="expense" position="top" formatter={(v: number) => v > 0 ? formatCurrency(v, false) : ''} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this year <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total income and expense for each month
        </div>
      </CardFooter>
    </Card>
  )
}
