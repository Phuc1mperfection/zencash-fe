import api from "./api";
import axios from "axios";

// Category Group APIs
export const getCategoryGroups = async (budgetId: number) => {
  try {
    const res = await api.get(`/category-groups/budget/${budgetId}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching category groups:', error);
    if (axios.isAxiosError(error)) {
      console.error('Error response data:', error.response?.data);
    }
    throw error;
  }
};

export const createCategoryGroup = async (categoryGroup: { name: string, budgetId?: number }) => {
  try {
    const res = await api.post("/category-groups", categoryGroup);
    return res.data;
  } catch (error) {
    console.error('Error creating category group:', error);
    if (axios.isAxiosError(error)) {
      console.error('Error response data:', error.response?.data);
    }
    throw error;
  }
};

export const updateCategoryGroup = async (id: number, categoryGroup: { name: string, budgetId?: number }) => {
  try {
    const res = await api.put(`/category-groups/${id}`, categoryGroup);
    return res.data;
  } catch (error) {
    console.error('Error updating category group:', error);
    if (axios.isAxiosError(error)) {
      console.error('Error response data:', error.response?.data);
    }
    throw error;
  }
};

export const deleteCategoryGroup = async (id: number) => {
  try {
    const res = await api.delete(`/category-groups/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting category group:', error);
    if (axios.isAxiosError(error)) {
      console.error('Error response data:', error.response?.data);
    }
    throw error;
  }
};

// Category APIs
export const getCategoriesByGroupId = async (groupId: number) => {
  try {
    const res = await api.get(`/categories/categoryGroup/${groupId}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching categories for group ${groupId}:`, error);
    if (axios.isAxiosError(error)) {
      console.error('Error response data:', error.response?.data);
    }
    throw error;
  }
};

export const createCategory = async (categoryData: {
  name: string;
  icon?: string;
  categoryGroupId: number;
  budgetId?: number;
  defaultCat: boolean;
}) => {
  try {
    const res = await api.post("/categories", categoryData);
    return res.data;
  } catch (error) {
    console.error('Error creating category:', error);
    if (axios.isAxiosError(error)) {
      console.error('Error response data:', error.response?.data);
    }
    throw error;
  }
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
  try {
    const res = await api.put(`/categories/${categoryId}`, categoryData);
    return res.data;
  } catch (error) {
    console.error('Error updating category:', error);
    if (axios.isAxiosError(error)) {
      console.error('Error response data:', error.response?.data);
    }
    throw error;
  }
};

export const deleteCategory = async (categoryId: number) => {
  try {
    const res = await api.delete(`/categories/${categoryId}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    if (axios.isAxiosError(error)) {
      console.error('Error response data:', error.response?.data);
    }
    throw error;
  }
};

export const getCategoriesByBudget = async (budgetId: number) => {
  try {
    const response = await api.get(`/categories/budget/${budgetId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories by budget:", error);
    if (axios.isAxiosError(error)) {
      console.error('Error response data:', error.response?.data);
    }
    return [];
  }
};