import { useEffect, useState } from "react";
import { getCategoriesByGroupId } from "@/services/categoryService";

export const CategoryList = ({ categoryGroupId }: { categoryGroupId: number }) => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategoriesByGroupId(categoryGroupId);
      setCategories(data);
    };
    fetchCategories();
  }, [categoryGroupId]);

  return (
    <ul className="pl-4 list-disc">
      {categories.map((cat) => (
        <li key={cat.id}>{cat.name}</li>
      ))}
    </ul>
  );
};

export default CategoryList;
