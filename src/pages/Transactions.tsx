import { useState, useEffect } from "react";
import { Plus, ArrowUpDown, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionsList from "@/components/transactions/TransactionsList";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { InvoiceRecognition } from "@/components/transactions/InvoiceRecognition";
import { useTransactions } from "@/hooks/useTransactions";
import { useBudget } from "@/hooks/useBudget";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionSearch } from "@/components/transactions/TransactionSearch";
import { TransactionTypeSelector } from "@/components/transactions/TransactionTypeSelector";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";

export const Transactions = () => {
  const { transactions, loading, fetchTransactions, deleteTransaction } =
    useTransactions();
  const { budgets, fetchBudgets, isLoading: budgetsLoading } = useBudget();

  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);

  // Sử dụng hook useTransactionFilters mới
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    date,
    sortDirection,
    sortedTransactions,
    handleDateSelect,
    clearFilters,
    toggleSortDirection,
  } = useTransactionFilters(transactions || []);

  // Fetch transactions and budgets on component mount
  useEffect(() => {
    fetchBudgets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy một lần khi component mount

  // When budgets are loaded, fetch transactions for the first budget
  useEffect(() => {
    if (budgets && budgets.length > 0 && !filters.budgetId) {
      // Chỉ lấy budget đầu tiên khi chưa có budget nào được chọn
      setFilters((prev) => ({ ...prev, budgetId: budgets[0].id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgets]); // Chỉ phụ thuộc vào budgets

  // When a budget is selected, fetch its transactions
  useEffect(() => {
    if (filters.budgetId) {
      fetchTransactions(filters.budgetId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.budgetId]); // Chỉ phụ thuộc vào filters.budgetId

  const handleDelete = async (transactionId: number) => {
    await deleteTransaction(transactionId);
    await fetchTransactions(filters.budgetId); // Refresh transactions list
  };

  const handleEdit = async () => {
    console.log("Transaction edited, refreshing list...");
    // Refresh transactions
    if (filters.budgetId) {
      await fetchTransactions(filters.budgetId);
    }
  };

  const handleOpenScanReceipt = () => {
    // Switch to scan tab and focus on upload
    const scanTab = document.querySelector(
      '[data-value="scan"]'
    ) as HTMLElement;
    if (scanTab) {
      scanTab.click();
    }
  };

  const handleCloseTransactionForm = () => {
    setIsTransactionFormOpen(false);
    const addButton = document.querySelector(
      "button[aria-label='Add Transaction']"
    );
    if (addButton) {
      (addButton as HTMLButtonElement).focus(); // Return focus to Add Transaction button
    }
  };

  const refreshTransactions = async () => {
    console.log("Refreshing transactions after add/edit...");
    if (filters.budgetId) {
      await fetchTransactions(filters.budgetId);
    }
  };

  // Handle clear filters with default budget
  const handleClearFilters = () => {
    const defaultBudgetId =
      budgets && budgets.length > 0 ? budgets[0].id : undefined;
    clearFilters(defaultBudgetId);
  };

  const isLoading = loading || budgetsLoading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <div className="flex gap-2">
          <Button
            className="sm:w-auto"
            onClick={() => setIsTransactionFormOpen(true)}
            aria-label="Add Transaction"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
          <Button
            variant="outline"
            className="sm:w-auto"
            onClick={handleOpenScanReceipt}
          >
            <FileText className="mr-2 h-4 w-4" /> Scan Receipt
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="list">Transaction List</TabsTrigger>
          <TabsTrigger value="scan" data-value="scan">
            Receipt Scanner
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Sử dụng component TransactionSearch */}
            <TransactionSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              className="flex-1"
            />

            <div className="flex flex-wrap gap-2">
              {/* Sử dụng component TransactionFilters */}
              <TransactionFilters
                filters={filters}
                onFiltersChange={setFilters}
                date={date}
                onDateSelect={handleDateSelect}
                onClearFilters={handleClearFilters}
                budgets={budgets}
                isLoading={isLoading}
              />

              {/* Sử dụng component TransactionTypeSelector */}
              <TransactionTypeSelector
                value={filters.type || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    type: value as "all" | "INCOME" | "EXPENSE",
                  }))
                }
                disabled={isLoading}
              />

              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={toggleSortDirection}
                disabled={isLoading}
                title={
                  sortDirection === "asc"
                    ? "Sort newest first"
                    : "Sort oldest first"
                }
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <TransactionsList
                  transactions={sortedTransactions || []}
                  loading={isLoading}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scan">
          <InvoiceRecognition
            onTransactionConfirmed={() => {
              console.log(
                "Transaction confirmed from invoice, refreshing list..."
              );
              if (filters.budgetId) {
                fetchTransactions(filters.budgetId);
              }
            }}
          />
        </TabsContent>
      </Tabs>

      <TransactionForm
        open={isTransactionFormOpen}
        onOpenChange={handleCloseTransactionForm}
        onEditSuccess={refreshTransactions}
      />
    </div>
  );
};

export default Transactions;
