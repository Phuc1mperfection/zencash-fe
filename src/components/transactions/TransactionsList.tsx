import { useState, useEffect } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import {
  ArrowUpRight,
  ArrowDownLeft,
  MoreVertical,
  Edit,
  Trash,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionResponse } from "@/services/transactionService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TransactionForm } from "./TransactionForm";
import { getCategoriesByBudget } from "@/services/categoryService";
import { CategoryResponse } from "@/types/CategoryResponse";
import { formatCurrency } from "@/utils/currencyFormatter";
import {TransactionsListProps} from "@/types/TransactionsListProps";

export const TransactionsList = ({
  transactions,
  limit,
  onEdit,
  onDelete,
  loading,
}: TransactionsListProps) => {
  const { deleteTransaction } = useTransactions();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] =
    useState<TransactionResponse | null>(null);
  // State for storing categories by budget ID
  const [categoriesMap, setCategoriesMap] = useState<
    Record<number, CategoryResponse[]>
  >({});
  const [, setLoadingCategories] = useState(false);

  const displayedTransactions = limit
    ? transactions.slice(0, limit)
    : transactions;

  // Extract unique budget IDs from transactions
  useEffect(() => {
    const fetchCategoriesForTransactions = async () => {
      if (!transactions || transactions.length === 0) return;

      setLoadingCategories(true);

      const budgetIds = [...new Set(transactions.map((t) => t.budgetId))];
      const categoriesForBudgets: Record<number, CategoryResponse[]> = {};

      try {
        for (const budgetId of budgetIds) {
          if (!categoriesMap[budgetId]) {
            const categories = await getCategoriesByBudget(budgetId);
            categoriesForBudgets[budgetId] = categories;
          }
        }

        // Update state with all categories
        setCategoriesMap((prev) => ({
          ...prev,
          ...categoriesForBudgets,
        }));
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategoriesForTransactions();
  }, [transactions]); // Removed categoriesMap from dependencies

  // Helper function to get category name
  const getCategoryName = (budgetId: number, categoryId: number): string => {
    if (!categoriesMap[budgetId]) return "Loading...";

    const category = categoriesMap[budgetId].find((c) => c.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const handleEditClick = (transaction: TransactionResponse) => {
    console.log("Edit clicked for transaction:", transaction);
setTimeout(() => {
  setTransactionToEdit(transaction);
  setIsEditDialogOpen(true);
}, 0); };

  const handleEditSuccess = () => {
    // Close the edit dialog
    setIsEditDialogOpen(false);
    setTransactionToEdit(null);

    // Trigger refresh if onEdit callback exists
    if (onEdit) {
      onEdit(transactionToEdit!);
    }
  };

  const handleDeleteClick = (transactionId: number) => {
    console.log("Delete clicked for transactionId:", transactionId);

    // Delay opening dialog
    setTimeout(() => {
      setTransactionToDelete(transactionId);
      setIsDeleteDialogOpen(true);
    }, 0);
  };
  const handleConfirmDelete = async () => {
    console.log("Confirm delete for transactionId:", transactionToDelete);
    if (transactionToDelete) {
      if (onDelete) {
        onDelete(transactionToDelete);
      } else {
        await deleteTransaction(transactionToDelete);
      }

      setTransactionToDelete(null);
    }
    setIsDeleteDialogOpen(false);
  };
  // Map API response to form values - include categoryId
  const mapToFormValues = (transaction: TransactionResponse) => {
    return {
      description: transaction.note,
      amount: Math.abs(transaction.amount),
      isIncome: transaction.type === "INCOME",
      budgetId: transaction.budgetId,
      categoryId: transaction.categoryId,
      date: parseISO(transaction.date),
    };
  };

  // Display loading or empty state
  // if (loading) {
  //   return (
  //     <div className="flex flex-col items-center justify-center py-8">
  //       <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-zen-green"></div>
  //       <p className="mt-2 text-sm text-muted-foreground">
  //         Loading transactions...
  //       </p>
  //     </div>
  //   );
  // }

  if (!loading && displayedTransactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <AlertCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">No transactions found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Add a new transaction to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {displayedTransactions.map((transaction) => {
          const isIncome = transaction.type === "INCOME";
          const categoryName = getCategoryName(
            transaction.budgetId,
            transaction.categoryId
          );

          return (
            <li
              key={transaction.id}
              className="bg-card border rounded-lg p-3 flex items-center justify-between hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex items-center justify-center h-8 w-8 rounded-full",
                    isIncome
                      ? "bg-zen-green/10 text-zen-green"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {isIncome ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownLeft size={16} />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.note}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(parseISO(transaction.date), {
                        addSuffix: true,
                      })}
                    </p>
                    {/* Added category badge */}
                    <Badge variant="default" className="text-xs">
                      {categoryName}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p
                  className={cn(
                    "font-semibold",
                    isIncome ? "text-zen-green" : "text-destructive"
                  )}
                >
                  {formatCurrency(transaction.amount)}
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    className="opacity-50 hover:opacity-100 focus:opacity-100 hover:cursor-pointer"
                  >
                    <MoreVertical size={16} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleEditClick(transaction)}
                    >
                      <Edit size={14} className="mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteClick(transaction.id)}
                    >
                      <Trash size={14} className="mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this transaction. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit transaction dialog */}
      {transactionToEdit && (
        <TransactionForm
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setTransactionToEdit(null);
            }
          }}
          onEditSuccess={handleEditSuccess}
          editMode={true}
          transactionId={transactionToEdit.id}
          prefillData={mapToFormValues(transactionToEdit)}
        />
      )}
    </div>
  );
};

export default TransactionsList;
