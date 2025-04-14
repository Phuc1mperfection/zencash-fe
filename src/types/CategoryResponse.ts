export interface CategoryResponse {
    id: number;
    name: string;
    icon?: string;
    categoryGroupId: number;
    userId: string;
    budgetId: number;
    budgetName?: string;
    defaultCat: boolean;
}