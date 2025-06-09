
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Transaction } from '@/hooks/useTransactions';

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  transaction?: Transaction | null;
}

export const TransactionDialog = ({ open, onOpenChange, onSubmit, transaction }: TransactionDialogProps) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');

  // Reset form when dialog opens/closes or transaction changes
  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setDescription(transaction.description);
      setAmount(transaction.amount.toString());
      setDate(transaction.date);
      setCategory(transaction.category);
    } else {
      setType('expense');
      setDescription('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('');
    }
  }, [transaction, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) return;

    onSubmit({
      type,
      description,
      amount: parseFloat(amount),
      date,
      category,
    });

    // Reset form only if not editing
    if (!transaction) {
      setDescription('');
      setAmount('');
      setCategory('');
    }
  };

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Business', 'Other Income'];
  const expenseCategories = ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Other'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {transaction ? 'Edit Transaction' : 'Add New Transaction'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(value: 'income' | 'expense') => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {(type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-primary to-primary/80">
              {transaction ? 'Update' : 'Add'} Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
