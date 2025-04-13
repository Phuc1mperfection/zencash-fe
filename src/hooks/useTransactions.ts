import { useState, useEffect, useCallback } from 'react';
import transactionService, { 
  TransactionRequest, 
  TransactionResponse as Transaction, 
  CategoryGroupStatistics
} from '@/services/transactionService';
import { toast } from '@/hooks/use-toast';



export const useTransactions = (initialBudgetId?: number) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [incomeExpense, setIncomeExpense] = useState<{ income: number; expense: number }>({
    income: 0, 
    expense: 0
  });
  const [categoryStatistics, setCategoryStatistics] = useState<CategoryGroupStatistics[]>([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | undefined>(initialBudgetId);

  const fetchTransactions = useCallback(async (budgetId?: number) => {
    if (!budgetId && !selectedBudgetId) return;
    
    const targetBudgetId = budgetId || selectedBudgetId;
    if (!targetBudgetId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await transactionService.getTransactionsByBudget(targetBudgetId);
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again later.');
      toast({
        title: 'Error',
        description: 'Failed to load transactions.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [selectedBudgetId]);

  const fetchIncomeExpenseSummary = useCallback(async () => {
    setLoading(true);
    try {
      const data = await transactionService.getUserIncomeExpense();
      setIncomeExpense(data);
    } catch (err) {
      console.error('Error fetching income/expense summary:', err);
      toast({
        title: 'Error',
        description: 'Failed to load income/expense summary.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategoryStatistics = useCallback(async (budgetId?: number) => {
    if (!budgetId && !selectedBudgetId) return;
    
    const targetBudgetId = budgetId || selectedBudgetId;
    if (!targetBudgetId) return;
    
    setLoading(true);
    
    try {
      const data = await transactionService.getCategoryGroupStatistics(targetBudgetId);
      setCategoryStatistics(data);
    } catch (err) {
      console.error('Error fetching category statistics:', err);
      toast({
        title: 'Error',
        description: 'Failed to load category statistics.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [selectedBudgetId]);

  const addTransaction = async (transaction: TransactionRequest) => {
    setLoading(true);
    try {
      const newTransaction = await transactionService.createTransaction(transaction);
      await fetchTransactions(selectedBudgetId); // Refresh transactions list
      toast({
        title: 'Success',
        description: 'Transaction added successfully.',
      });
      return newTransaction;
    } catch (err) {
      console.error('Error adding transaction:', err);
      toast({
        title: 'Error',
        description: 'Failed to add transaction.',
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: number, transaction: TransactionRequest) => {
    setLoading(true);
    try {
      const updatedTransaction = await transactionService.updateTransaction(id, transaction);
      await fetchTransactions(selectedBudgetId); // Refresh transactions list
      toast({
        title: 'Success',
        description: 'Transaction updated successfully.',
      });
      return updatedTransaction;
    } catch (err) {
      console.error('Error updating transaction:', err);
      toast({
        title: 'Error',
        description: 'Failed to update transaction.',
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };  

  const deleteTransaction = async (id: number) => {
    setLoading(true);
    try {
      const success = await transactionService.deleteTransaction(id);
      if (success) {
        await fetchTransactions(selectedBudgetId); // Refresh transactions list
        toast({
          title: 'Success',
          description: 'Transaction deleted successfully.',
        });
      }
      return success;
    } catch (err) {
      console.error('Error deleting transaction:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete transaction.',
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changeBudget = (budgetId: number) => {
    setSelectedBudgetId(budgetId);
  };

  // Load transactions when budget ID changes
  useEffect(() => {
    if (selectedBudgetId) {
      // Tránh gọi fetchTransactions và fetchCategoryStatistics cùng lúc
      // để ngăn việc cập nhật state quá nhiều lần
      const loadData = async () => {
        setLoading(true);
        try {
          // Gọi API trực tiếp thay vì gọi qua các hàm đã memo hóa
          // để tránh vòng lặp dependencies
          const [transactions, statistics] = await Promise.all([
            transactionService.getTransactionsByBudget(selectedBudgetId),
            transactionService.getCategoryGroupStatistics(selectedBudgetId)
          ]);
          
          setTransactions(transactions);
          setCategoryStatistics(statistics);
        } catch (err) {
          console.error('Error loading transaction data:', err);
        } finally {
          setLoading(false);
        }
      };
      
      loadData();
    }
  }, [selectedBudgetId]); // Chỉ phụ thuộc vào selectedBudgetId

  useEffect(() => {
    fetchIncomeExpenseSummary();
  }, [fetchIncomeExpenseSummary]); 

  return {
    transactions,
    loading,
    error,
    incomeExpense,
    categoryStatistics,
    selectedBudgetId,
    fetchTransactions,
    fetchIncomeExpenseSummary,
    fetchCategoryStatistics,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    changeBudget
  };
};