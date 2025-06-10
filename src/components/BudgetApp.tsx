
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Plus, LogOut } from 'lucide-react';
import { TransactionDialog } from './TransactionDialog';
import { TransactionList } from './TransactionList';
import { SummaryPanel } from './SummaryPanel';
import { FilterPanel } from './FilterPanel';
import { ChartsPanel } from './ChartsPanel';
import { CategoryManager } from './CategoryManager';
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
      <div className="container mx-auto p-3 sm:p-4 lg:p-6 max-w-7xl">
        {/* Header - Improved Mobile Layout */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent truncate">
              Budget Manager
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm lg:text-base truncate">
              Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
            </p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between sm:justify-center gap-2 bg-card/50 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 border">
              <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" />
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                id="dark-mode"
                className="mx-px"
              />
              <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
            </div>
            
            {/* Sign Out Button */}
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="p-0 w-8 h-8 sm:w-9 sm:h-9"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span className="sr-only">Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Add Transaction Button - Always Visible */}
        <div className="mb-4 sm:mb-6">
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        {/* Main Content - Improved Responsive Layout */}
        <div className="space-y-4 sm:space-y-6">
          {/* Summary Panel - Always Full Width */}
          <div className="w-full">
            <SummaryPanel transactions={filteredTransactions} />
          </div>

          {/* Two Column Layout for Desktop, Single Column for Mobile */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Left Column - Filter & Categories */}
            <div className="xl:col-span-1 space-y-4 sm:space-y-6">
              {/* Filter Panel */}
              <Card className="backdrop-blur-sm bg-card/50 border shadow-lg">
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold">Filter & Export</h3>
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
                </div>
              </Card>

              {/* Category Manager */}
              <CategoryManager />
            </div>
            
            {/* Right Column - Transaction List */}
            <div className="xl:col-span-2">
              <TransactionList 
                transactions={filteredTransactions} 
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </div>
          </div>
          
          {/* Charts - Full Width */}
          <div className="w-full">
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
