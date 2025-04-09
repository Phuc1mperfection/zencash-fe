import api from "./api";

// Category Group APIs
export const getCategoryGroups = async () => {
  const res = await api.get("/category-groups");
  return res.data;
};

export const createCategoryGroup = async (name: string) => {
  const res = await api.post("/category-groups", { name });
  return res.data;
};

export const updateCategoryGroup = async (id: number, name: string) => {
  const res = await api.put(`/category-groups/${id}`, { name });
  return res.data;
};

export const deleteCategoryGroup = async (id: number) => {
  const res = await api.delete(`/category-groups/${id}`);
  return res.data;
};

// Category APIs
export const getCategoriesByGroupId = async (groupId: number) => {
  const res = await api.get(`/categories/categoryGroup/${groupId}`);
  return res.data;
};

export const createCategory = async (categoryData: {
  name: string;
  categoryGroupId: number;
  budgetId?: string;
  isDefault: boolean;
}) => {
  const res = await api.post("/categories", categoryData);
  return res.data;
};

export const updateCategory = async (
  categoryId: number,
  categoryData: {
    name?: string;
    isDefault?: boolean;
    budgetId?: string;
  }
) => {
  const res = await api.put(`/categories/${categoryId}`, categoryData);
  return res.data;
};

export const deleteCategory = async (categoryId: number) => {
  const res = await api.delete(`/categories/${categoryId}`);
  return res.data;
};

export const getCategoriesByBudget = async (budgetId: number) => {
  try {
    const response = await api.get(`/categories/budget/${budgetId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories by budget:", error);
    return [];
  }
};