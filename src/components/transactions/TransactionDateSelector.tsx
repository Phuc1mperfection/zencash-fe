import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "@/schemas/transactionFormSchema";
import { useEffect, useState } from "react";

interface TransactionDateSelectorProps {
  form: UseFormReturn<TransactionFormValues>;
  handleDateChange?: (date: Date | undefined) => void;
}

export function TransactionDateSelector({
  form,
  handleDateChange,
}: TransactionDateSelectorProps) {
  // State to control the drawer
  const [openDrawer, setOpenDrawer] = useState(false);
  // Local state for display
  const [displayDate, setDisplayDate] = useState<Date | undefined>(
    form.getValues().date
  );

  // Update displayDate when form value changes
  useEffect(() => {
    const date = form.getValues().date;
    if (date) {
      setDisplayDate(date);
    }
  }, [form]);

  // Subscribe to form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.date) {
        setDisplayDate(value.date);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Handler for date selection
  const onSelectDate = (date: Date | undefined) => {
    if (!date) return;

    console.log("[TransactionDateSelector] Date selected:", date);

    // Close drawer first
    setOpenDrawer(false);

    // Update local display immediately for better UX
    setDisplayDate(date);

    // Update form with the new date (with delay to ensure drawer closes)
    setTimeout(() => {
      // Direct setValue with all flags for immediate validation
      form.setValue("date", date, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      // Call custom handler if provided
      if (handleDateChange) {
        handleDateChange(date);
      }

      // Trigger validation explicitly as a backup
      form.trigger("date");
    }, 100);
  };

  return (
    <FormField
      control={form.control}
      name="date"
      render={() => (
        <FormItem className="flex flex-col">
          <FormLabel>Date</FormLabel>
          <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
            <DrawerTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !displayDate && "text-muted-foreground"
                  )}
                  type="button"
                >
                  {displayDate ? (
                    format(displayDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </DrawerTrigger>
            <DrawerContent className="flex items-center justify-center">
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Select Date</DrawerTitle>
                </DrawerHeader>

                <div className="p-4">
                  <Calendar
                    mode="single"
                    selected={displayDate}
                    onSelect={onSelectDate}
                    disabled={(date) => date > new Date()}
                    className="mx-auto rounded-md"
                  />
                </div>

                <DrawerFooter className="pt-2">
                  <DrawerClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => setOpenDrawer(false)}
                    >
                      Cancel
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
