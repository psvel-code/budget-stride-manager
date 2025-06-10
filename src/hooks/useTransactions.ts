
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch transactions from Supabase
  const fetchTransactions = async () => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      // Properly type the data to ensure compatibility
      const typedData: Transaction[] = (data || []).map(item => ({
        ...item,
        type: item.type as 'income' | 'expense'
      }));

      setTransactions(typedData);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new transaction
  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          ...transaction,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      const typedData: Transaction = {
        ...data,
        type: data.type as 'income' | 'expense'
      };

      setTransactions(prev => [typedData, ...prev]);
      toast({
        title: "Transaction Added",
        description: `${transaction.type} of $${transaction.amount} has been recorded.`,
      });

      return { data: typedData, error: null };
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
      return { error };
    }
  };

  // Update transaction
  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const typedData: Transaction = {
        ...data,
        type: data.type as 'income' | 'expense'
      };

      setTransactions(prev =>
        prev.map(t => t.id === id ? { ...t, ...typedData } : t)
      );

      toast({
        title: "Transaction Updated",
        description: "Transaction has been updated successfully.",
      });

      return { data: typedData, error: null };
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
      return { error };
    }
  };

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTransactions(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Transaction Deleted",
        description: "Transaction has been removed successfully.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions
  };
};
