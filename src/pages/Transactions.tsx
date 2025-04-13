import { useState, useEffect, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Filter,
  Plus,
  Search,
  ArrowUpDown,
  X,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionsList from "@/components/transactions/TransactionsList";
import { Badge } from "@/components/ui/badge";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { InvoiceRecognition } from "@/components/transactions/InvoiceRecognition";
import { useTransactions } from "@/hooks/useTransactions";
import { useBudget } from "@/hooks/useBudget";
// Removed category import

type FilterType = {
  date?: Date;
  // Removed categoryId
  budgetId?: number;
  type?: "all" | "INCOME" | "EXPENSE";
};

export const Transactions = () => {
  const { transactions, loading, fetchTransactions, deleteTransaction } =
    useTransactions();
  const { budgets, fetchBudgets, isLoading: budgetsLoading } = useBudget();
  // Removed categories related hooks

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterType>({
    type: "all",
  });
  const [date, setDate] = useState<Date>();
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc"); // Default newest first

  // Fetch transactions and budgets on component mount - removed categories
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

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    return transactions.filter((transaction) => {
      // Search filter
      if (
        searchQuery &&
        transaction.note &&
        !transaction.note.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Removed category filter

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
  }, [transactions, searchQuery, filters]);

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

  const handleDateSelect = (date?: Date) => {
    setDate(date);
    setFilters((prev) => ({ ...prev, date }));
  };

  const clearFilters = () => {
    setFilters({
      type: "all",
      budgetId: budgets && budgets.length > 0 ? budgets[0].id : undefined,
    });
    setDate(undefined);
    setSearchQuery("");
  };

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

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
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-10 gap-2">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filters</span>
                    {filters.date && (
                      <Badge
                        variant="secondary"
                        className="h-5 px-1 rounded-full"
                      >
                        1
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filter Transactions</h4>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Budget</label>
                      <Select
                        value={filters.budgetId?.toString() || ""}
                        onValueChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            budgetId:
                              value === "all" ? undefined : Number(value),
                          }))
                        }
                        disabled={isLoading || !budgets || budgets.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Budgets</SelectItem>
                          {budgets &&
                            budgets.map((budget) => (
                              <SelectItem
                                key={budget.id}
                                value={budget.id.toString()}
                              >
                                {budget.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Transaction Type
                      </label>
                      <Select
                        value={filters.type}
                        onValueChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            type: value as "all" | "INCOME" | "EXPENSE",
                          }))
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Transactions</SelectItem>
                          <SelectItem value="INCOME">Income Only</SelectItem>
                          <SelectItem value="EXPENSE">Expenses Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Removed category filter section */}

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                            disabled={isLoading}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={clearFilters}
                      disabled={isLoading}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear Filters
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    type: value as "all" | "INCOME" | "EXPENSE",
                  }))
                }
                disabled={isLoading}
              >
                <SelectTrigger className="h-10 w-[180px]">
                  <SelectValue placeholder="All Transactions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="INCOME">Income Only</SelectItem>
                  <SelectItem value="EXPENSE">Expenses Only</SelectItem>
                </SelectContent>
              </Select>

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
          <InvoiceRecognition />
        </TabsContent>
      </Tabs>

      <TransactionForm
        open={isTransactionFormOpen}
        onOpenChange={handleCloseTransactionForm}
      />
    </div>
  );
};

export default Transactions;
