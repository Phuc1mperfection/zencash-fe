import { useState } from "react";
import { Upload, FileText, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { toast } from "@/hooks/use-toast";
import { useTransactions } from "@/hooks/useTransactions";
import * as invoiceService from "@/services/invoiceService";
import { Spinner } from "@/components/ui/spinner";
import { getCurrencySymbol } from "@/utils/currencyFormatter";
import { InvoiceData } from "@/types/InvoiceData";

interface InvoiceRecognitionProps {
  onTransactionConfirmed?: () => void;
}

export function InvoiceRecognition({
  onTransactionConfirmed,
}: InvoiceRecognitionProps) {
  const { confirmInvoiceTransaction, selectedBudgetId } = useTransactions();
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<InvoiceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];

    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG)");
      return;
    }

    setIsUploading(true);
    uploadInvoiceImage(file);
  };

  const uploadInvoiceImage = async (file: File) => {
    try {
      setIsProcessing(true);

      // Upload the invoice image to the API
      const data = await invoiceService.uploadInvoice(file);

      // Read the file for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);

      // Set the extracted data
      setExtractedData(data);
      setIsProcessing(false);

      toast({
        title: "Receipt processed successfully",
        description: "We've extracted the information from your receipt.",
      });
    } catch (err) {
      setIsProcessing(false);
      setIsUploading(false);
      console.error("Error processing invoice:", err);
      setError("Failed to process the image. Please try again.");
      toast({
        title: "Processing Error",
        description: "Could not extract data from the receipt.",
        variant: "destructive",
      });
    }
  };

  const handleCreateTransaction = async () => {
    if (!extractedData) return;

    setIsConfirming(true);

    try {
      console.log("Starting invoice confirmation process");

      // Make sure we have a budget ID - either from extractedData or from the hook
      const { ...dataToConfirm } = extractedData;

      // If extractedData doesn't have a valid budgetId, use the one from the hook
      if (!dataToConfirm.budgetId && selectedBudgetId) {
        console.log("Using selectedBudgetId from hook:", selectedBudgetId);
        dataToConfirm.budgetId = selectedBudgetId;
      }

      console.log("Confirming invoice with data:", dataToConfirm);
      await confirmInvoiceTransaction(dataToConfirm);

      // Notify parent component that a transaction was confirmed
      if (onTransactionConfirmed) {
        console.log("Calling onTransactionConfirmed callback");
        onTransactionConfirmed();
      }

      // Close the invoice recognition dialog
      toast({
        title: "Transaction created",
        description: "Your transaction has been created successfully.",
      });

      // Reset the form
      resetUpload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create transaction. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating transaction:", error);
    } finally {
      setIsConfirming(false);
    }
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setExtractedData(null);
    setError(null);
  };

  // Format date from string to Date object for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  // Open transaction form with prefilled data for editing
  const handleEditTransaction = () => {
    if (extractedData) {
      setIsTransactionFormOpen(true);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Invoice Recognition
        </CardTitle>
        <CardDescription>
          Upload a receipt or invoice image to automatically extract transaction
          details
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!uploadedImage ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center">
            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Receipt</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop or click to browse
            </p>
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              id="receipt-upload"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <Button asChild variant="outline" disabled={isUploading}>
              <label htmlFor="receipt-upload">
                {isUploading ? "Uploading..." : "Select Image"}
              </label>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <img
                src={uploadedImage}
                alt="Uploaded Receipt"
                className="w-full h-auto max-h-[300px] object-contain border rounded-md"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={resetUpload}
                className="mt-2"
              >
                Upload Different Image
              </Button>
            </div>
            <div className="flex-1">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  {isProcessing ? (
                    <>Processing Image...</>
                  ) : extractedData ? (
                    <>
                      <Check className="h-5 w-5 text-zen-green" />
                      Extracted Data
                    </>
                  ) : (
                    <>Analyzing Receipt...</>
                  )}
                </h3>

                {isProcessing ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                  </div>
                ) : extractedData ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Description
                      </p>
                      <p className="font-medium">{extractedData.note}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-medium">
                        {getCurrencySymbol()}
                        {extractedData.amount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {formatDate(extractedData.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">
                        {extractedData.type.toLowerCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Budget & Category
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-left font-medium text-primary"
                        onClick={handleEditTransaction}
                      >
                        Edit budget and category
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      Starting analysis...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {extractedData && (
        <CardFooter>
          <Button
            onClick={handleCreateTransaction}
            className="w-full"
            disabled={isConfirming}
          >
            {isConfirming ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Creating Transaction...
              </>
            ) : (
              "Confirm and Create Transaction"
            )}
          </Button>
        </CardFooter>
      )}

      {extractedData && (
        <TransactionForm
          open={isTransactionFormOpen}
          onOpenChange={setIsTransactionFormOpen}
          prefillData={{
            description: extractedData.note,
            amount: extractedData.amount,
            date: new Date(extractedData.date),
            budgetId: extractedData.budgetId,
            categoryId: extractedData.categoryId,
            isIncome: extractedData.type === "INCOME",
          }}
          onSuccess={() => {
            if (onTransactionConfirmed) {
              console.log(
                "Calling onTransactionConfirmed from TransactionForm success"
              );
              onTransactionConfirmed();
            }
            setIsTransactionFormOpen(false);
            resetUpload();
          }}
        />
      )}
    </Card>
  );
}
