import { useState, useEffect, useCallback } from 'react';
import { toast } from "react-hot-toast";
import { CategoryResponse } from '@/types/CategoryResponse';
import { BudgetData } from '@/types/BudgetData';

import {
  getCategoryGroups,
  createCategoryGroup,
  updateCategoryGroup,
  deleteCategoryGroup,
  getCategoriesByGroupId,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/services/categoryService';
import { getBudgets } from '@/services/budgetService';

// Interfaces
export interface CategoryGroupType {
  id: number;
  name: string;
  budgetId?: number;
}

export interface DeleteDialogState {
  type: 'group' | 'category';
  id: number;
}

export const useCategoriesPage = () => {
  // State
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroupType[]>([]);
  const [groupCategories, setGroupCategories] = useState<Record<number, CategoryResponse[]>>({});
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});
  const [newGroupName, setNewGroupName] = useState('');
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editingGroupName, setEditingGroupName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState<string>('');
  const [newCategoryIsDefault, setNewCategoryIsDefault] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | undefined>(undefined);
  const [activeBudgetId, setActiveBudgetId] = useState<number | undefined>(undefined); // Changed from 1 to undefined
  const [budgets, setBudgets] = useState<BudgetData[]>([]);
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<DeleteDialogState | null>(null);
  
  const fetchBudgets = useCallback(async () => {
    try {
      const budgetData = await getBudgets();
      setBudgets(budgetData);
      
      // Set the active budget to the first one if available
      if (budgetData.length > 0) {
        setActiveBudgetId(budgetData[0].id);
      } else {
        // No budgets available for this user
        setActiveBudgetId(undefined);
        
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
      
    }
  }, []);

  // Load category groups on component mount
  useEffect(() => {
    fetchBudgets();
  }, []);

  // Fetch category groups whenever active budget changes
  useEffect(() => {
    if (activeBudgetId) {
      fetchCategoryGroups(activeBudgetId);
    } else {
      // Clear category groups if no active budget
      setCategoryGroups([]);
    }
  }, [activeBudgetId]);

  // Fetch all category groups for a specific budget
  const fetchCategoryGroups = useCallback(async (budgetId: number) => {
    if (!budgetId) {
      console.error('No budget ID provided to fetchCategoryGroups');
      return;
    }

    try {
      const groups = await getCategoryGroups(budgetId);
      setCategoryGroups(groups);
      
      // Initialize expanded state for each group
      const expanded: Record<number, boolean> = {};
      groups.forEach((group: CategoryGroupType) => {
        expanded[group.id] = expandedGroups[group.id] || false;
      });
      setExpandedGroups(expanded);
    } catch (error) {
      // Don't show toast because this might be expected for new users
      console.error('Error fetching category groups:', error);
    }
  }, [expandedGroups]);

  // Fetch categories for a specific group
  const fetchCategories = useCallback(async (groupId: number) => {
    try {
      const categories = await getCategoriesByGroupId(groupId);
      setGroupCategories(prev => ({
        ...prev,
        [groupId]: categories,
      }));
    } catch (error) {
      toast.error(`Failed to load categories for group ${groupId}`);
      console.error(`Error fetching categories for group ${groupId}:`, error);
    }
  }, []);
  
  // Toggle group expansion
  const toggleGroupExpansion = useCallback((groupId: number) => {
    const newState = !expandedGroups[groupId];
    setExpandedGroups({
      ...expandedGroups,
      [groupId]: newState,
    });
    
    // Load categories if expanding and not already loaded
    if (newState && !groupCategories[groupId]) {
      fetchCategories(groupId);
    }
  }, [expandedGroups, groupCategories, fetchCategories]);

  // Create a new category group
  const handleCreateGroup = useCallback(async () => {
    if (!newGroupName.trim()) {
      toast.error('Group name cannot be empty');
      return;
    }
    
    try {
      await createCategoryGroup({ 
        name: newGroupName,
        budgetId: activeBudgetId
      });
      setNewGroupName('');
      if (activeBudgetId) {
        fetchCategoryGroups(activeBudgetId);
      }
      toast.success('Category group created successfully');
    } catch (error) {
      console.error('Error creating category group:', error);
    }
  }, [newGroupName, activeBudgetId, fetchCategoryGroups]);

  // Start editing a category group
  const handleEditGroupClick = useCallback((group: CategoryGroupType) => {
    setEditingGroupId(group.id);
    setEditingGroupName(group.name);
  }, []);

  // Save edited category group
  const handleSaveGroupEdit = useCallback(async (groupId: number) => {
    if (!editingGroupName.trim()) {
      toast.error('Group name cannot be empty');
      return;
    }
    
    try {
      const group = categoryGroups.find(g => g.id === groupId);
      await updateCategoryGroup(groupId, {
        name: editingGroupName,
        budgetId: group?.budgetId || activeBudgetId
      });
      setEditingGroupId(null);
      if (activeBudgetId) {
        fetchCategoryGroups(activeBudgetId);
      }
      toast.success('Category group updated successfully');
    } catch (error) {
      toast.error('Failed to update category group');
      console.error('Error updating category group:', error);
    }
  }, [editingGroupName, categoryGroups, activeBudgetId, fetchCategoryGroups]);

  // Cancel editing a category group
  const handleCancelGroupEdit = useCallback(() => {
    setEditingGroupId(null);
  }, []);

  // Delete a category group
  const handleDeleteGroup = useCallback(async (groupId: number) => {
    try {
      await deleteCategoryGroup(groupId);
      if (activeBudgetId) {
        fetchCategoryGroups(activeBudgetId);
      }
      setIsDeleteDialogOpen(null);
      toast.success('Category group deleted successfully');
    } catch (error) {
      toast.error('Failed to delete category group');
      console.error('Error deleting category group:', error);
    }
  }, [activeBudgetId, fetchCategoryGroups]);

  // Start adding a new category to a group
  const handleAddCategoryClick = useCallback((groupId: number) => {
    setIsAddingCategory(groupId === 0 ? null : groupId);
    if (groupId !== 0) {
      setNewCategoryName('');
      setNewCategoryIcon('');
      setNewCategoryIsDefault(false);
      setSelectedBudgetId(activeBudgetId);
    }
  }, [activeBudgetId]);

  // Create a new category
  const handleCreateCategory = useCallback(async (groupId: number) => {
    if (!newCategoryName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    
    try {
      // Handle icon based on its type
      let iconValue = newCategoryIcon;
      
      // Only extract filename if it's a traditional file path and not a Font Awesome class
      if (iconValue && !iconValue.startsWith("fa") && !iconValue.startsWith("http")) {
        // Get only the filename from the path (e.g., "neko.jpg" from "/image/icon/neko.jpg")
        iconValue = iconValue.split('/').pop() || iconValue;
      }
      
      // Log request payload
      const requestData = {
        name: newCategoryName,
        icon: iconValue || undefined,
        categoryGroupId: groupId,
        budgetId: selectedBudgetId || activeBudgetId,
        defaultCat: newCategoryIsDefault,
      };
      
      console.log('Creating category with payload:', requestData);
      
      const response = await createCategory(requestData);
      console.log('Category creation response:', response);
      
      setIsAddingCategory(null);
      fetchCategories(groupId);
      toast.success('Category created successfully');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    }
  }, [newCategoryName, newCategoryIcon, selectedBudgetId, activeBudgetId, newCategoryIsDefault, fetchCategories]);

  // Start editing a category
  const handleEditCategory = useCallback((category: CategoryResponse | null) => {
    // Always set the editingCategory to whatever was passed in
    // This allows null to be passed to cancel editing
    setEditingCategory(category);
  }, []);

  // Save edited category
  const handleSaveCategory = useCallback(async () => {
    if (!editingCategory) return;
    
    if (!editingCategory.name.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    
    try {
      // Handle icon based on its type
      let iconValue = editingCategory.icon;
      
      // Only extract filename if it's a traditional file path and not a Font Awesome class
      if (iconValue && !iconValue.startsWith("fa") && !iconValue.startsWith("http")) {
        // Get only the filename from the path (e.g., "neko.jpg" from "/image/icon/neko.jpg")
        iconValue = iconValue.split('/').pop() || iconValue;
      }
      
      // Create update payload based on what the API expects
      const updateData: {
        name: string;
        icon?: string;
        categoryGroupId: number;
        budgetId?: number;
        defaultCat?: boolean;
      } = {
        name: editingCategory.name,
        categoryGroupId: editingCategory.categoryGroupId,
        budgetId: editingCategory.budgetId,
        icon: iconValue
      };

      if (editingCategory.defaultCat === true) {
        updateData.defaultCat = true;
      }

      console.log('Updating category with payload:', updateData);
      
      const response = await updateCategory(editingCategory.id, updateData);
      console.log('Category update response:', response);
      
      fetchCategories(editingCategory.categoryGroupId);
      setEditingCategory(null);
      toast.success('Category updated successfully');
    } catch (error) {
      toast.error('Failed to update category');
      console.error('Error updating category:', error);
    }
  }, [editingCategory, fetchCategories]);

  // Toggle category default status
  const handleToggleCategoryDefault = useCallback(async (category: CategoryResponse) => {
    try {
      const updatedCategory = {
        ...category,
        defaultCat: !category.defaultCat,
      };
      
      // Create update payload based on what the API expects
      const updateData = {
        name: category.name,
        icon: category.icon,
        budgetId: category.budgetId,
        defaultCat: !category.defaultCat
      };
      
      console.log('Toggling default status with payload:', updateData);
      
      await updateCategory(category.id, { ...updateData, categoryGroupId: category.categoryGroupId });
      
      // Update the local state
      setGroupCategories(prev => ({
        ...prev,
        [category.categoryGroupId]: prev[category.categoryGroupId].map(cat => 
          cat.id === category.id ? updatedCategory : cat
        ),
      }));
      
      toast.success(`Category ${updatedCategory.defaultCat ? 'marked as default' : 'unmarked as default'}`);
    } catch (error) {
      toast.error('Failed to update category');
      console.error('Error updating category:', error);
    }
  }, []);

  // Delete a category
  const handleDeleteCategory = useCallback(async (categoryId: number, groupId: number) => {
    try {
      await deleteCategory(categoryId);
      fetchCategories(groupId);
      setIsDeleteDialogOpen(null);
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error('Failed to delete category');
      console.error('Error deleting category:', error);
    }
  }, [fetchCategories]);

  // Handle deletion confirmation
  const handleConfirmDelete = useCallback(() => {
    if (!isDeleteDialogOpen) return;
    
    if (isDeleteDialogOpen.type === 'group') {
      handleDeleteGroup(isDeleteDialogOpen.id);
    } else {
      const groupId = Object.keys(groupCategories).find(groupId => 
        groupCategories[Number(groupId)]?.some(cat => cat.id === isDeleteDialogOpen.id)
      );
      
      if (groupId) {
        handleDeleteCategory(isDeleteDialogOpen.id, Number(groupId));
      }
    }
  }, [isDeleteDialogOpen, handleDeleteGroup, groupCategories, handleDeleteCategory]);

  // Handle category editing
  const handleCategoryNameChange = useCallback((name: string) => {
    if (editingCategory) {
      setEditingCategory({
        ...editingCategory,
        name,
      });
    }
  }, [editingCategory]);

  const handleCategoryIconChange = useCallback((icon: string) => {
    if (editingCategory) {
      setEditingCategory({
        ...editingCategory,
        icon,
      });
    }
  }, [editingCategory]);

  const handleCategoryDefaultChange = useCallback((defaultCat: boolean) => {
    if (editingCategory) {
      setEditingCategory({
        ...editingCategory,
        defaultCat,
      });
    }
  }, [editingCategory]);

  const handleCategoryBudgetChange = useCallback((budgetId: number) => {
    if (editingCategory) {
      setEditingCategory({
        ...editingCategory,
        budgetId,
      });
    }
  }, [editingCategory]);

  return {
    // State
    categoryGroups,
    groupCategories,
    expandedGroups,
    newGroupName,
    editingGroupId,
    editingGroupName,
    isAddingCategory,
    newCategoryName,
    newCategoryIcon,
    newCategoryIsDefault,
    selectedBudgetId,
    activeBudgetId,
    budgets,
    editingCategory,
    isDeleteDialogOpen,
    
    // Setters
    setNewGroupName,
    setEditingGroupName,
    setNewCategoryName,
    setNewCategoryIcon,
    setNewCategoryIsDefault,
    setSelectedBudgetId,
    setActiveBudgetId,
    
    // Actions
    fetchCategoryGroups,
    fetchCategories,
    toggleGroupExpansion,
    handleCreateGroup,
    handleEditGroupClick,
    handleSaveGroupEdit,
    handleCancelGroupEdit,
    handleDeleteGroup,
    handleAddCategoryClick,
    handleCreateCategory,
    handleEditCategory,
    handleSaveCategory,
    handleToggleCategoryDefault,
    handleDeleteCategory,
    handleConfirmDelete,
    handleCategoryNameChange,
    handleCategoryIconChange,
    handleCategoryDefaultChange,
    handleCategoryBudgetChange,
    setIsDeleteDialogOpen,
  };
};