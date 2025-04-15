import { useEffect, useState } from "react";
import { getCategoryGroups } from "@/services/categoryService";
import { getBudgets } from "@/services/budgetService";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CategoryList } from "@/components/category/CategoryList";
import { BudgetData } from "@/types/BudgetData";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CategoryGroupList = () => {
  const [categoryGroups, setCategoryGroups] = useState<
    { id: number; name: string }[]
  >([]);
  const [, setBudgets] = useState<BudgetData[]>([]);
  const [activeBudgetId, setActiveBudgetId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // First fetch budgets to get a valid budgetId
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const data = await getBudgets();
        setBudgets(data);

        // Set the active budget ID to the first budget if available
        if (data.length > 0) {
          setActiveBudgetId(data[0].id);
        } else {
          // No budgets found
          setLoading(false);
          setError(
            "No budgets found for your account. Please create a budget first."
          );
        }
      } catch (err) {
        console.error("Failed to fetch budgets", err);
        setLoading(false);
        setError("Failed to load budgets. Please try again later.");
      }
    };

    fetchBudgets();
  }, []);

  // Then fetch category groups once we have a budget ID
  useEffect(() => {
    const fetchGroups = async () => {
      if (activeBudgetId === null) return;

      setLoading(true);
      try {
        // Use the active budget ID from the budgets list
        const data = await getCategoryGroups(activeBudgetId);
        setCategoryGroups(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch category groups", err);
        // Check if it's a 400 error (likely because budget doesn't belong to user)
        
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [activeBudgetId]);

  // Navigate to budget creation
  const handleCreateBudget = () => {
    navigate("/dashboard/budget");
  };

  if (error) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={handleCreateBudget} className="mx-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create New Budget
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading && categoryGroups.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!loading && categoryGroups.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground mb-4">
            No category groups found for this budget. Create your first category
            group to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {categoryGroups.map((group) => (
        <Card key={group.id}>
          <CardHeader>
            <h3 className="font-semibold text-lg">{group.name}</h3>
          </CardHeader>
          <CardContent>
            <CategoryList categoryGroupId={group.id} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CategoryGroupList;
