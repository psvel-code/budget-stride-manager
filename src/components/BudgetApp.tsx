
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { TransactionForm } from './TransactionForm';
import { TransactionList } from './TransactionList';
import { SummaryPanel } from './SummaryPanel';
import { FilterPanel } from './FilterPanel';
import { ChartsPanel } from './ChartsPanel';
import { Transaction, TransactionType } from '@/types/budget';
import { exportToCSV } from '@/utils/csvExport';
import { useToast } from '@/hooks/use-toast';

export const BudgetApp = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('budget-transactions');
    const savedDarkMode = localStorage.getItem('budget-dark-mode');
    
    if (savedTransactions) {
      const parsed = JSON.parse(savedTransactions);
      setTransactions(parsed);
      setFilteredTransactions(parsed);
    }
    
    if (savedDarkMode) {
      const isDark = JSON.parse(savedDarkMode);
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem('budget-transactions', JSON.stringify(transactions));
    setFilteredTransactions(transactions);
  }, [transactions]);

  // Handle dark mode toggle
  useEffect(() => {
    localStorage.setItem('budget-dark-mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    toast({
      title: "Transaction Added",
      description: `${transaction.type} of $${transaction.amount} has been recorded.`,
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Transaction Deleted",
      description: "Transaction has been removed successfully.",
    });
  };

  const handleFilter = (filters: {
    dateRange: { start: Date | null; end: Date | null };
    type: TransactionType | 'all';
    category: string;
  }) => {
    let filtered = [...transactions];

    // Filter by date range
    if (filters.dateRange.start) {
      filtered = filtered.filter(t => new Date(t.date) >= filters.dateRange.start!);
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(t => new Date(t.date) <= filters.dateRange.end!);
    }

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(t => 
        t.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleExport = () => {
    exportToCSV(filteredTransactions);
    toast({
      title: "Export Successful",
      description: `${filteredTransactions.length} transactions exported to CSV.`,
    });
  };

  const goBack = () => {
    window.location.reload(); // Simple way to go back to landing
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={goBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Budget Manager</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              id="dark-mode"
            />
            <Moon className="h-4 w-4" />
            <Label htmlFor="dark-mode" className="sr-only">
              Toggle dark mode
            </Label>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column - Forms and Summary */}
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Transaction</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionForm onSubmit={addTransaction} />
              </CardContent>
            </Card>

            <SummaryPanel transactions={filteredTransactions} />

            <Card>
              <CardHeader>
                <CardTitle>Filter & Export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FilterPanel onFilter={handleFilter} />
                <Button 
                  onClick={handleExport} 
                  className="w-full"
                  variant="outline"
                >
                  Export to CSV ({filteredTransactions.length} transactions)
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Lists and Charts */}
          <div className="lg:col-span-8 space-y-6">
            <TransactionList 
              transactions={filteredTransactions} 
              onDelete={deleteTransaction}
            />
            
            <ChartsPanel transactions={filteredTransactions} />
          </div>
        </div>
      </div>
    </div>
  );
};
