
import { TransactionResponse } from "@/services/transactionService";

export interface TransactionsListProps {
  transactions: TransactionResponse[];
  limit?: number;
  onEdit?: (transaction: TransactionResponse) => void;
  onDelete?: (transactionId: number) => void;
  loading?: boolean;
}