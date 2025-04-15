import { useEffect, useState } from "react";
import { getCategoryGroups } from "@/services/categoryService";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CategoryList } from "@/components/category/CategoryList";

const CategoryGroupList = () => {
  const [categoryGroups, setCategoryGroups] = useState<{ id: number; name: string }[]>([]);
  // Default budgetId - you might want to get this from a context or props
  const defaultBudgetId = 1; 

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // Pass the required budgetId parameter
        const data = await getCategoryGroups(defaultBudgetId);
        setCategoryGroups(data);
      } catch (err) {
        console.error("Failed to fetch category groups", err);
      }
    };

    fetchGroups();
  }, []);

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
