import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useBudget } from "@/hooks/useBudget";

import { memo, useState, useEffect } from "react";
import { BudgetOverview } from "@/components/budget/BudgetOverview";
import { getUserIncomeExpense } from "@/services/transactionService";
import { formatCurrency } from "@/utils/currencyFormatter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
} from "lucide-react";
import IncomeExpenseChart from "@/components/overview/IncomeExpenseChart";

// Sample data for charts
const monthlyData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 4500 },
  { name: "May", value: 6000 },
  { name: "Jun", value: 5500 },
];

const categoryData = [
  { name: "Food", value: 4000 },
  { name: "Transport", value: 3000 },
  { name: "Entertainment", value: 2000 },
  { name: "Shopping", value: 2500 },
  { name: "Bills", value: 3500 },
];

const Overview = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const { budgetOverview, fetchBudgetOverview } = useBudget();

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
    <div className="space-y-8  ">
      <h1 className="text-2xl font-bold ">Overview</h1>
      {/* Stats Cards */}
      {/* Budget Overview Component */}
      <BudgetOverview />
    
      {/* Income vs Expenses Chart */}
      <IncomeExpenseChart />
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="stat-value text-zen-blue">
              {formatCurrency(budgetOverview.totalBudget)}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1 text-zen-green" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="stat-value text-zen-green">
              {" "}
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1 text-zen-green" />
              +5.4% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="stat-value text-destructive">
              {formatCurrency(totalExpense)}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 inline mr-1 text-destructive" />
              -2.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="stat-value text-foreground">
              {budgetOverview.spentPercentage}%
            </div>
            <p className="text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 inline mr-1" />
              This month's budget
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Card className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <div className="bg-white/50 dark:bg-slate-900  rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold  mb-4">Monthly Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="green" />
                <XAxis dataKey="name" stroke="#ffffff80" />
                <YAxis stroke="#ffffff80" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#001e2b",
                    border: "1px solid #ffffff20",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#ffffff" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#00ed64"
                  strokeWidth={2}
                  dot={{ fill: "#00ed64", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="bg-white/50 dark:bg-slate-900  rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold  mb-4">Category Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#ffffff80" />
                <YAxis stroke="#ffffff80" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#001e2b",
                    border: "1px solid #135527",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#ffffff" }}
                />
                <Legend />
                <Bar dataKey="value" fill="#135527" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className=" dark:bg-slate-900  rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold  mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4  dark:bg-slate-900 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#00ed64]/20 flex items-center justify-center">
                  <span className="text-[#00ed64]">T{i}</span>
                </div>
                <div>
                  <p className="">Transaction {i}</p>
                  <p className="text-sm text-gray-400">Category {i}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="">{formatCurrency(Math.random() * 1000)}</p>
                <p className="text-sm text-gray-400">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default memo(Overview);
