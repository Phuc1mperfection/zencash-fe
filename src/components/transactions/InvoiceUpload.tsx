import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InvoiceRecognition } from "@/components/transactions/InvoiceRecognition";

export default function InvoiceUpload() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Upload Receipts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">AI Receipt Scanner</div>
        <p className="text-xs text-muted-foreground">
          Automatically extract transaction data from receipts and invoices
        </p>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Scan Receipt
        </Button>
      </CardFooter>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Receipt Scanner</DialogTitle>
            <DialogDescription>
              Upload a receipt or invoice to automatically extract the
              transaction data
            </DialogDescription>
          </DialogHeader>
          <InvoiceRecognition />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
