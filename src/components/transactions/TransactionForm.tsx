import { TransactionFormValues } from "@/schemas/transactionFormSchema";
import { TransactionFormMain } from "./TransactionFormMain";

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillData?: Partial<TransactionFormValues>;
  editMode?: boolean;
  transactionId?: number;
  onEditSuccess?: () => void; // Callback sau khi edit thành công
  onSuccess?: () => void; // Callback chung cho cả add và edit
}

export function TransactionForm({
  open,
  onOpenChange,
  prefillData,
  editMode = false,
  transactionId,
  onEditSuccess,
  onSuccess,
}: TransactionFormProps) {
  return (
    <TransactionFormMain
      open={open}
      onOpenChange={onOpenChange}
      prefillData={prefillData}
      editMode={editMode}
      transactionId={transactionId}
      onEditSuccess={onEditSuccess} // Giữ lại để tương thích với code hiện tại
      onSuccess={onSuccess} // Truyền callback mới
    />
  );
}

// Export types for backward compatibility
export type { TransactionFormValues };
