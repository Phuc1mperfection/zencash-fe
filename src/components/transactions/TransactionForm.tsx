import { TransactionFormValues } from "@/schemas/transactionFormSchema";
import { TransactionFormMain } from "./TransactionFormMain";

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillData?: Partial<TransactionFormValues>;
  editMode?: boolean;
  transactionId?: number;
  onEditSuccess?: () => void; // Callback after successful edit or add
}

export function TransactionForm({
  open,
  onOpenChange,
  prefillData,
  editMode = false,
  transactionId,
  onEditSuccess,
}: TransactionFormProps) {
  return (
    <TransactionFormMain
      open={open}
      onOpenChange={onOpenChange}
      prefillData={prefillData}
      editMode={editMode}
      transactionId={transactionId}
      onSuccess={onEditSuccess} // Use for both edit and add operations
    />
  );
}

// Export types for backward compatibility
export type { TransactionFormValues };
