import { formatDistanceToNow } from "date-fns";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  MoreVertical, 
  Edit, 
  Trash 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface TransactionsListProps {
  transactions: Transaction[];
  limit?: number;
}

export const TransactionsList = ({ transactions, limit }: TransactionsListProps) => {
  const displayedTransactions = limit 
    ? transactions.slice(0, limit)
    : transactions;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {displayedTransactions.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {displayedTransactions.map((transaction) => (
            <li 
              key={transaction.id}
              className="bg-card border rounded-lg p-3 flex items-center justify-between hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center h-8 w-8 rounded-full",
                  transaction.amount >= 0 
                    ? "bg-zen-green/10 text-zen-green" 
                    : "bg-destructive/10 text-destructive"
                )}>
                  {transaction.amount >= 0 
                    ? <ArrowUpRight size={16} /> 
                    : <ArrowDownLeft size={16} />}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {transaction.category}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className={cn(
                  "font-semibold",
                  transaction.amount >= 0 ? "text-zen-green" : "text-destructive"
                )}>
                  {formatCurrency(transaction.amount)}
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger className="opacity-50 hover:opacity-100 focus:opacity-100">
                    <MoreVertical size={16} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit size={14} className="mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash size={14} className="mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionsList;
