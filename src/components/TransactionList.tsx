
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, TrendingUp, TrendingDown, Edit, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { Transaction } from '@/types/budget';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export const TransactionList = ({ transactions, onDelete, onEdit }: TransactionListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card className="backdrop-blur-sm bg-card/50 border shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl">Recent Transactions</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg mb-2">
              {searchTerm ? 'No matching transactions found' : 'No transactions found'}
            </p>
            <p className="text-sm text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms' : 'Add your first transaction to get started!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-xl hover:bg-accent/50 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-card to-card/50 overflow-x-hidden"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`p-2 sm:p-3 rounded-full shadow-sm flex-shrink-0 ${
                    transaction.type === 'income' 
                      ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-700 dark:from-green-900 dark:to-green-800 dark:text-green-300' 
                      : 'bg-gradient-to-br from-red-100 to-red-200 text-red-700 dark:from-red-900 dark:to-red-800 dark:text-red-300'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground truncate max-w-[150px] sm:max-w-full">{transaction.description}</p>
                      <Badge 
                        variant="secondary" 
                        className="text-xs px-2 py-0.5 bg-muted/50 truncate max-w-[100px] sm:max-w-full"
                      >
                        {transaction.category}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <span className={`font-bold text-sm sm:text-lg truncate ${
                    transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)}
                  </span>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(transaction)}
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(transaction.id)}
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
