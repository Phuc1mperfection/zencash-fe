import { useEffect, useState } from "react";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import { formatCurrency } from "@/utils/currencyFormatter";
import { renderIcon } from "@/utils/iconUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BudgetCardSkeleton } from "./BudgetCardSkeleton";
import { useBudget, BudgetOverview } from "@/hooks/useBudget";
import { BudgetData } from "@/types/BudgetData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SingleBudgetOverview } from "./SingleBudgetOverview";

interface BudgetListProps {
  budgets: BudgetData[];
  isLoading: boolean;
  onEditClick: (budget: BudgetData) => void;
  onDeleteClick: (budget: BudgetData) => void;
  showSingleBudgetOverview?: boolean;
}

export function BudgetList({
  budgets,
  isLoading,
  onEditClick,
  onDeleteClick,
  showSingleBudgetOverview = false,
}: BudgetListProps) {
  const { fetchSingleBudgetOverview, getProgressClass } = useBudget();
  const [budgetOverviews, setBudgetOverviews] = useState<
    Record<number, BudgetOverview>
  >({});
  const [loadingOverviews, setLoadingOverviews] = useState<
    Record<number, boolean>
  >({});

  // Tải dữ liệu overview từ API khi component được hiển thị
  useEffect(() => {
    async function loadOverviews() {
      const loading = { ...loadingOverviews };
      budgets.forEach((budget) => (loading[budget.id] = true));
      setLoadingOverviews(loading);

      const overviews = { ...budgetOverviews };
      for (const budget of budgets) {
        try {
          const overview = await fetchSingleBudgetOverview(budget.id);
          if (overview) {
            overviews[budget.id] = overview;
          }
        } catch (error) {
          console.error(
            `Error fetching overview for budget ${budget.id}:`,
            error
          );
        } finally {
          setLoadingOverviews((prev) => ({ ...prev, [budget.id]: false }));
        }
      }
      setBudgetOverviews(overviews);
    }

    loadOverviews();
  }, [budgets, fetchSingleBudgetOverview]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <BudgetCardSkeleton />
        <BudgetCardSkeleton />
        <BudgetCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {budgets.map((budget) => {
        // Sử dụng dữ liệu từ API hoặc giá trị mặc định khi đang tải
        const overview = budgetOverviews[budget.id];

        // Nếu không có dữ liệu API hoặc đang tải, hiển thị dữ liệu từ budget trực tiếp
        const totalBudget = budget.totalAmount;
        const spent = overview ? overview.totalSpent : 0;
        const remaining = overview
          ? overview.totalRemaining
          : budget.remainingAmount;
        const percentage = overview ? overview.spentPercentage : 0;
        const isOverBudget = remaining < 0;

        const progressClass = getProgressClass(percentage);

        return (
          <div key={budget.id} className="flex flex-col">
            {/* SingleBudgetOverview nếu được bật */}
            {showSingleBudgetOverview && (
              <SingleBudgetOverview
                budgetId={budget.id}
                budgetName={budget.name}
              />
            )}

            {/* Budget Card */}
            <Card className="overflow-hidden flex-1">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{budget.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditClick(budget)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteClick(budget)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Budget Progress Stats */}
                  <div className="flex justify-between text-sm font-medium">
                    <div className="text-2xl font-bold">
                      {formatCurrency(spent)}
                      <span className="text-sm text-muted-foreground ml-1">
                        / {formatCurrency(totalBudget)}
                      </span>
                    </div>
                    <span
                      className={
                        percentage >= 90 ? "text-destructive font-bold" : ""
                      }
                    >
                      {percentage}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="relative">
                    <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${progressClass} rounded-full transition-all duration-500 ${
                          isOverBudget ? "animate-pulse" : ""
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Spent and Left Values */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Spent</p>
                      <p className="font-medium">{formatCurrency(spent)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Left</p>
                      <p
                        className={`font-medium ${
                          isOverBudget ? "text-destructive" : ""
                        }`}
                      >
                        {formatCurrency(Math.abs(remaining))}
                        {isOverBudget && (
                          <span className="text-xs ml-1">overspent</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Categories */}
                  {(budget.categories?.length ?? 0) > 0 && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2 break-all">
                        {budget.categories?.map((cat) => (
                          <Badge key={cat.id} variant="default">
                            <span className="mr-1">
                              {cat.icon && renderIcon(cat.icon)}
                            </span>
                            {cat.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
