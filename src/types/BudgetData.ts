import { CategoryResponse } from './CategoryResponse';
export interface BudgetData {
  id: number;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  categories?: CategoryResponse[];
}