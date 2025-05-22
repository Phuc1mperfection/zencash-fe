export interface GoalSpendingData {
  id: number;
  budgetId: number;
  categoryGroupId: number;
  goalAmount: number;          // Hạn mức chi tiêu
  spentAmount: number;         // Tổng chi tiêu hiện tại (tính từ transaction)
  month: string;               // Dạng ISO: "2025-05-01"
  repeatMonth: boolean;        // Có lặp lại hàng tháng không
  warning: boolean;            // true nếu spent >= 80% goalAmount
}
