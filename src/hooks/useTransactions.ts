import { useState, useEffect, useCallback } from 'react';
import transactionService, { 
  TransactionRequest, 
  TransactionResponse as Transaction, 
  CategoryGroupStatistics
} from '@/services/transactionService';
import { toast } from 'react-hot-toast';
import invoiceService from '@/services/invoiceService';
import { InvoiceData } from '@/types/InvoiceData';

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
    console.log("fetchTransactions called with budgetId:", budgetId);
    console.log("selectedBudgetId in hook:", selectedBudgetId);
    
    if (!budgetId && !selectedBudgetId) {
      console.log("No budgetId available, trying to get from local storage");
      // Try to get from local storage as fallback
      const storedBudget = localStorage.getItem('selectedBudget');
      const fallbackBudgetId = storedBudget ? JSON.parse(storedBudget)?.id : null;
      
      if (!fallbackBudgetId) {
        console.log("No fallback budgetId found, returning early");
        return;
      }
      
      budgetId = fallbackBudgetId;
      console.log("Using fallback budgetId from localStorage:", fallbackBudgetId);
    }
    
    const targetBudgetId = budgetId || selectedBudgetId;
    console.log("Final targetBudgetId:", targetBudgetId);
    
    if (!targetBudgetId) {
      console.log("No targetBudgetId after fallback, returning early");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching transactions for budgetId:", targetBudgetId);
      const data = await transactionService.getTransactionsByBudget(targetBudgetId);
      console.log("Fetched transactions:", data.length);
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again later.');
      toast.error('Failed to load transactions. Please try again later.');
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
      toast.error('Failed to load income/expense summary. Please try again later.');
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
      toast.error('Failed to load category statistics. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [selectedBudgetId]);

  const addTransaction = async (transaction: TransactionRequest) => {
    setLoading(true);
    try {
      const newTransaction = await transactionService.createTransaction(transaction);
      await fetchTransactions(selectedBudgetId); // Refresh transactions list
      toast.success('Transaction added successfully!');
      return newTransaction;
    } catch (err) {
      console.error('Error adding transaction:', err);
      toast.error('Failed to add transaction. Please try again later.');
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
      toast.success('Transaction updated successfully!');
      return updatedTransaction;
    } catch (err) {
      console.error('Error updating transaction:', err);
      toast.error('Failed to update transaction. Please try again later.');
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
        toast.success('Transaction deleted successfully!');
      }
      return success;
    } catch (err) {
      console.error('Error deleting transaction:', err);
      toast.error('Failed to delete transaction. Please try again later.'); 
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmInvoiceTransaction = async (invoiceData: Omit<InvoiceData, 'id'>) => {
    setLoading(true);
    try {

      // Call the invoice service to confirm and create a transaction
      const newTransaction = await invoiceService.confirmInvoice(invoiceData);
      
      // Set the budget ID if it's from the transaction
      if (newTransaction.budgetId && !selectedBudgetId) {
        setSelectedBudgetId(newTransaction.budgetId);
      }
      await fetchTransactions(newTransaction.budgetId);
      await fetchCategoryStatistics(newTransaction.budgetId);
      await fetchIncomeExpenseSummary();
      
      toast.success('Invoice processed successfully!');
      
      return newTransaction;
    } catch (err) {
      console.error('Error confirming invoice transaction:', err);
      toast.error('Failed to create transaction from invoice. Please try again later.');
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
    confirmInvoiceTransaction,
    changeBudget
  };
};