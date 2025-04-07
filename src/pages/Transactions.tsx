import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Filter, 
  Plus, 
  Search,
  ArrowUpDown,
  X, 
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionsList from "@/components/transactions/TransactionsList";
import { Transaction } from "@/components/transactions/TransactionsList";
import { Badge } from "@/components/ui/badge";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { InvoiceRecognition } from "@/components/transactions/InvoiceRecognition";

const mockTransactions: Transaction[] = [
  { id: 1, description: 'Grocery Store', amount: -120, date: '2023-06-20', category: 'Food' },
  { id: 2, description: 'Salary Deposit', amount: 3500, date: '2023-06-15', category: 'Income' },
  { id: 10, description: 'Side Project Payment', amount: 250, date: '2023-05-25', category: 'Income' },
];

type FilterType = {
  date?: Date,
  category?: string,
  type?: 'all' | 'income' | 'expense'
};

export const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterType>({
    type: 'all'
  });
  const [date, setDate] = useState<Date>();
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);

  const categories = Array.from(new Set(mockTransactions.map(t => t.category)));

  const filteredTransactions = mockTransactions.filter((transaction) => {
    if (searchQuery && !transaction.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filters.category && transaction.category !== filters.category) {
      return false;
    }
    
    if (filters.type === 'income' && transaction.amount < 0) {
      return false;
    }
    if (filters.type === 'expense' && transaction.amount > 0) {
      return false;
    }
    
    if (filters.date && format(new Date(transaction.date), 'yyyy-MM-dd') !== format(filters.date, 'yyyy-MM-dd')) {
      return false;
    }
    
    return true;
  });

  const handleDateSelect = (date?: Date) => {
    setDate(date);
    setFilters(prev => ({ ...prev, date }));
  };

  const clearFilters = () => {
    setFilters({ type: 'all' });
    setDate(undefined);
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <div className="flex gap-2">
          <Button className="sm:w-auto" onClick={() => setIsTransactionFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
          <Button variant="outline" className="sm:w-auto" onClick={() => setIsTransactionFormOpen(true)}>
            <FileText className="mr-2 h-4 w-4" /> Scan Receipt
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="list">Transaction List</TabsTrigger>
          <TabsTrigger value="scan">Receipt Scanner</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-10 gap-2">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filters</span>
                    {Object.keys(filters).length > 1 && (
                      <Badge variant="secondary" className="h-5 px-1 rounded-full">
                        {Object.keys(filters).length - 1}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filter Transactions</h4>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Transaction Type</label>
                      <Select
                        value={filters.type}
                        onValueChange={(value) => 
                          setFilters(prev => ({ ...prev, type: value as 'all' | 'income' | 'expense' }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Transactions</SelectItem>
                          <SelectItem value="income">Income Only</SelectItem>
                          <SelectItem value="expense">Expenses Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select
                        value={filters.category}
                        onValueChange={(value) => 
                          setFilters(prev => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Categories</SelectItem>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={clearFilters}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear Filters
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Select
                value={filters.type}
                onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, type: value as 'all' | 'income' | 'expense' }))
                }
              >
                <SelectTrigger className="h-10 w-[180px]">
                  <SelectValue placeholder="All Transactions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="income">Income Only</SelectItem>
                  <SelectItem value="expense">Expenses Only</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" className="h-10 w-10">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionsList transactions={filteredTransactions} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scan">
          <InvoiceRecognition />
        </TabsContent>
      </Tabs>

      <TransactionForm 
        open={isTransactionFormOpen} 
        onOpenChange={setIsTransactionFormOpen} 
      />
    </div>
  );
};

export default Transactions;