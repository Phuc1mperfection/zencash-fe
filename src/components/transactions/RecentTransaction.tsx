import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/currencyFormatter";
import { useRecentTransactions } from "@/hooks/useRecentTransactions";
import { formatDistanceToNow } from "date-fns";

const formatTimeAgo = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Unknown date";
  }
};

const TransactionIcon = ({ type }: { type: string }) => {
  // Icon color based on transaction type
  const bgColor = type === "INCOME" ? "bg-[#00ed64]/20" : "bg-red-500/20";
  const textColor = type === "INCOME" ? "text-[#00ed64]" : "text-red-500";

  return (
    <div
      className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center`}
    >
      <span className={textColor}>{type === "INCOME" ? "+" : "-"}</span>
    </div>
  );
};

// Tạo component badge cho danh mục
const CategoryBadge = ({ type, name }: { type: string; name: string }) => {
  // Badge color based on transaction type
  const bgColor =
    type === "INCOME"
      ? "bg-[#00ed64]/20 text-[#00ed64] border-[#00ed64]/30"
      : "bg-red-500/20 text-red-500 border-red-500/30";

  return (
    <Badge
      className={`${bgColor} border hover:bg-opacity-30 transition-all`}
      variant="default"
    >
      {name || "Uncategorized"}
    </Badge>
  );
};

const RecentTransaction = () => {
  const { transactions, isLoading, error } = useRecentTransactions(5);

  if (isLoading) {
    return (
      <Card className="dark:bg-slate-900 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 dark:bg-slate-800/50 rounded-lg animate-pulse"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-slate-700"></div>
                <div>
                  <p className="h-4 w-24 bg-slate-700 rounded"></p>
                  <p className="h-3 w-20 bg-slate-700 rounded mt-2"></p>
                </div>
              </div>
              <div className="text-right">
                <p className="h-4 w-20 bg-slate-700 rounded"></p>
                <p className="h-3 w-16 bg-slate-700 rounded mt-2"></p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="dark:bg-slate-900 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
        <div className="text-red-500">Error loading recent transactions</div>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-slate-900 rounded-xl p-6 border border-white/10">
      <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No recent transactions found
          </div>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 dark:bg-slate-800/50 hover:bg-green-400/30 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-4">
                <TransactionIcon type={transaction.type} />
                <div>
                  <p className="">
                    {transaction.note || `Transaction ${transaction.id}`}
                  </p>
                  <CategoryBadge
                    type={transaction.type}
                    name={
                      transaction.categoryName ||
                      `Category ${transaction.categoryId}`
                    }
                  />
                </div>
              </div>
              <div className="text-right">
                <p
                  className={
                    transaction.type === "INCOME"
                      ? "text-[#00ed64]"
                      : "text-red-500"
                  }
                >
                  {transaction.type === "INCOME" ? "+" : "-"}{" "}
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="text-sm text-gray-400">
                  {formatTimeAgo(transaction.date)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default RecentTransaction;
