import { TransactionFormValues } from "@/schemas/transactionFormSchema";
import { TransactionFormMain } from "./TransactionFormMain";


interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillData?: Partial<TransactionFormValues>;
  editMode?: boolean;
  transactionId?: number;
  onEditSuccess?: () => void; // Maintain backward compatibility
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
      onSuccess={onEditSuccess}
    />
  );
}

// Export types for backward compatibility
export type { TransactionFormValues };
