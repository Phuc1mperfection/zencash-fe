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
  PieChart,
  Pie,
  Cell,
} from "recharts";

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

const pieData = [
  { name: "Income", value: 8000 },
  { name: "Expenses", value: 6000 },
  { name: "Savings", value: 2000 },
];

const COLORS = ["#00ed64", "#00b8d4", "#ff6b6b"];

const Overview = () => {
  return (
    
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Overview</h1>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-gray-400 text-sm">Total Balance</h3>
          <p className="text-2xl font-bold text-white mt-2">$12,345</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-gray-400 text-sm">Monthly Income</h3>
          <p className="text-2xl font-bold text-white mt-2">$8,000</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-gray-400 text-sm">Monthly Expenses</h3>
          <p className="text-2xl font-bold text-white mt-2">$6,000</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">
            Monthly Trend
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
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
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">
            Category Distribution
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
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
                <Bar dataKey="value" fill="#00b8d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Income vs Expenses Chart */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4">
          Income vs Expenses
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#001e2b",
                  border: "1px solid #ffffff20",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#ffffff" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4">
          Recent Transactions
        </h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#00ed64]/20 flex items-center justify-center">
                  <span className="text-[#00ed64]">T{i}</span>
                </div>
                <div>
                  <p className="text-white">Transaction {i}</p>
                  <p className="text-sm text-gray-400">Category {i}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white">${Math.random() * 1000}</p>
                <p className="text-sm text-gray-400">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
