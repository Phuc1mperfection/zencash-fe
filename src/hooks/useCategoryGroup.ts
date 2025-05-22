import { useEffect, useState } from "react";
import axios from "axios";

export interface CategoryGroup {
  id: number;
  name: string;
}

export function useCategoryGroup() {
  const [groups, setGroups] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const res = await axios.get("/api/category-groups");
        setGroups(res.data);
      } catch (err: any) {
        setError(err.message || "Failed to load category groups");
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, []);

  return { groups, loading, error };
}
