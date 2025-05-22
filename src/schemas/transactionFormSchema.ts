import { z } from "zod";

// Schema cho form giao dịch
export const transactionFormSchema = z.object({
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  amount: z.coerce.number().refine((val) => val !== 0, {
    message: "Amount cannot be zero.",
  }),
  budgetId: z.number({
    required_error: "Please select a budget.",
  }),
  categoryId: z.number({
    required_error: "Please select a category.",
  }),
  date: z.date({
    required_error: "A date is required.",
  }),
  isIncome: z.boolean().default(false).optional(),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;


// Giá trị mặc định cho form
export const defaultTransactionValues: Partial<TransactionFormValues> = {
  description: "",
  amount: undefined,
  date: new Date(),
  isIncome: false,
};