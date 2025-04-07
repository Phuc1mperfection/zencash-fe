import { useState } from "react";
import { Upload, FileText, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { toast } from "@/hooks/use-toast";

interface ExtractedData {
  description?: string;
  amount?: number;
  date?: Date;
  category?: string;
}

export function InvoiceRecognition() {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file (JPEG, PNG)");
      return;
    }
    
    setIsUploading(true);
    
    // Read the file and convert it to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setIsUploading(false);
      processImage(e.target?.result as string);
    };
    
    reader.onerror = () => {
      setIsUploading(false);
      setError("Error reading the file. Please try again.");
    };
    
    reader.readAsDataURL(file);
  };
  
  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Simulate AI processing with a timeout
      setTimeout(() => {
        // This is a simulation of AI extracting data
        // In a real implementation, you would call an AI service API here
        
        // Mock extracted data (random values for demo)
        const mockData: ExtractedData = {
          description: "Office Supplies",
          amount: Math.floor(Math.random() * 100) + 10,
          date: new Date(),
          category: "shopping"
        };
        
        setExtractedData(mockData);
        setIsProcessing(false);
        
        toast({
          title: "Receipt processed successfully",
          description: "We've extracted the information from your receipt."
        });
        
      }, 2000); // 2 second delay to simulate processing
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setIsProcessing(false);
      setError("Failed to process the image. Please try again.");
    }
  };
  
  const handleCreateTransaction = () => {
    if (extractedData) {
      setIsTransactionFormOpen(true);
    }
  };
  
  const resetUpload = () => {
    setUploadedImage(null);
    setExtractedData(null);
    setError(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Invoice Recognition
        </CardTitle>
        <CardDescription>
          Upload a receipt or invoice image to automatically extract transaction details
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
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="font-medium">{extractedData.description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-medium">${extractedData.amount?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {extractedData.date?.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium capitalize">
                        {extractedData.category}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Starting analysis...</p>
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
          >
            Create Transaction
          </Button>
        </CardFooter>
      )}
      
      {extractedData && (
        <TransactionForm 
          open={isTransactionFormOpen} 
          onOpenChange={setIsTransactionFormOpen}
          prefillData={{
            description: extractedData.description || "",
            amount: extractedData.amount || 0,
            date: extractedData.date || new Date(),
            category: extractedData.category || "other",
            isIncome: false
          }}
        />
      )}
    </Card>
  );
}