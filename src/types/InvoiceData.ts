export interface InvoiceData {
    id: number | null;
    budgetId: number;
    categoryId: number;
    amount: number;
    type: "EXPENSE" | "INCOME";
    note: string;
    date: string;
  }