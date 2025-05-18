import { useState, useEffect } from 'react';
import { getRecentTransactions, TransactionResponse } from '../services/transactionService';

interface UseRecentTransactionsReturn {
  transactions: TransactionResponse[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useRecentTransactions = (limit = 5): UseRecentTransactionsReturn => {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await getRecentTransactions(limit);
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred fetching recent transactions'));
      console.error('Error fetching recent transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [limit]);

  return {
    transactions,
    isLoading,
    error,
    refetch: fetchTransactions,
  };
};