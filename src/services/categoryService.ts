import api from "./api";

// Category Group APIs
export const getCategoryGroups = async (budgetId: number) => {
  const res = await api.get(`/category-groups/budget/${budgetId}`);
  return res.data;
};

export const createCategoryGroup = async (categoryGroup: { name: string, budgetId?: number }) => {
  const res = await api.post("/category-groups", categoryGroup);
  return res.data;
};

export const updateCategoryGroup = async (id: number, categoryGroup: { name: string, budgetId?: number }) => {
  const res = await api.put(`/category-groups/${id}`, categoryGroup);
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
  icon?: string;
  categoryGroupId: number;
  budgetId?: number;
  defaultCat: boolean;
}) => {
  const res = await api.post("/categories", categoryData);
  return res.data;
};

export const updateCategory = async (
  categoryId: number,
  categoryData: {
    name?: string;
    icon?: string;
    categoryGroupId: number;
    budgetId?: number;
    defaultCat?: boolean;
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