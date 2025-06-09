
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Plus, LogOut, User } from 'lucide-react';
import { TransactionDialog } from './TransactionDialog';
import { TransactionList } from './TransactionList';
import { SummaryPanel } from './SummaryPanel';
import { FilterPanel } from './FilterPanel';
import { ChartsPanel } from './ChartsPanel';
import { TransactionType } from '@/types/budget';
import { exportToCSV } from '@/utils/csvExport';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactions, Transaction } from '@/hooks/useTransactions';

export const BudgetApp = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { transactions, loading: transactionsLoading, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Redirect to auth if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('budget-dark-mode');
    if (savedDarkMode) {
      const isDark = JSON.parse(savedDarkMode);
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Update filtered transactions when transactions change
  useEffect(() => {
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

  const handleSignOut = async () => {
    await signOut();
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingTransaction(null);
  };

  const handleSubmit = async (transactionData: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, transactionData);
    } else {
      await addTransaction(transactionData);
    }
    handleDialogClose();
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
    // Convert transactions to the format expected by exportToCSV
    const exportData = filteredTransactions.map(t => ({
      id: t.id,
      type: t.type,
      description: t.description,
      amount: t.amount,
      date: t.date,
      category: t.category
    }));
    exportToCSV(exportData);
  };

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
  };

  if (authLoading || transactionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 transition-colors duration-300">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Budget Manager
              </h1>
              <p className="text-muted-foreground text-sm">
                Welcome back, {user?.user_metadata?.full_name || user?.email}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
            
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-lg p-2 border">
              <Sun className="h-4 w-4 text-yellow-500" />
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                id="dark-mode"
              />
              <Moon className="h-4 w-4 text-blue-500" />
              <Label htmlFor="dark-mode" className="sr-only">
                Toggle dark mode
              </Label>
            </div>

            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column - Summary and Filters */}
          <div className="lg:col-span-4 space-y-6">
            <SummaryPanel transactions={filteredTransactions} />

            <Card className="backdrop-blur-sm bg-card/50 border shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Filter & Export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FilterPanel onFilter={handleFilter} />
                <Button 
                  onClick={handleExport} 
                  className="w-full"
                  variant="outline"
                  size="sm"
                  disabled={filteredTransactions.length === 0}
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
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
            
            <ChartsPanel transactions={filteredTransactions} />
          </div>
        </div>

        {/* Transaction Dialog */}
        <TransactionDialog
          open={isDialogOpen}
          onOpenChange={handleDialogClose}
          onSubmit={handleSubmit}
          transaction={editingTransaction}
        />
      </div>
    </div>
  );
};
