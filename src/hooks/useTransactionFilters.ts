import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { TransactionResponse } from '@/services/transactionService';

export type FilterType = {
  date?: Date;
  budgetId?: number;
  type?: 'all' | 'INCOME' | 'EXPENSE';
};

export const useTransactionFilters = (initialTransactions: TransactionResponse[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterType>({
    type: "all",
  });
  const [date, setDate] = useState<Date | undefined>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc"); // Default newest first

  // Filtered transactions based on search query and filters
  const filteredTransactions = useMemo(() => {
    if (!initialTransactions) return [];

    return initialTransactions.filter((transaction) => {
      // Search filter
      if (
        searchQuery &&
        transaction.note &&
        !transaction.note.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Transaction type filter
      if (filters.type === "INCOME" && transaction.type !== "INCOME") {
        return false;
      }
      if (filters.type === "EXPENSE" && transaction.type !== "EXPENSE") {
        return false;
      }

      // Date filter
      if (filters.date && transaction.date) {
        const txDate = format(parseISO(transaction.date), "yyyy-MM-dd");
        const filterDate = format(filters.date, "yyyy-MM-dd");
        if (txDate !== filterDate) {
          return false;
        }
      }

      return true;
    });
  }, [initialTransactions, searchQuery, filters]);

  // Sort transactions by date
  const sortedTransactions = useMemo(() => {
    if (!filteredTransactions || filteredTransactions.length === 0) return [];

    return [...filteredTransactions].sort((a, b) => {
      if (!a.date || !b.date) return 0;
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [filteredTransactions, sortDirection]);

  // Handle date selection
  const handleDateSelect = (date?: Date) => {
    setDate(date);
    setFilters((prev) => ({ ...prev, date }));
  };

  // Clear all filters
  const clearFilters = (defaultBudgetId?: number) => {
    setFilters({
      type: "all",
      budgetId: defaultBudgetId,
    });
    setDate(undefined);
    setSearchQuery("");
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    date,
    sortDirection,
    filteredTransactions,
    sortedTransactions,
    handleDateSelect,
    clearFilters,
    toggleSortDirection
  };
};