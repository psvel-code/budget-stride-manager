
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react';
import { Transaction } from '@/types/budget';

interface SummaryPanelProps {
  transactions: Transaction[];
}

export const SummaryPanel = ({ transactions }: SummaryPanelProps) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const summaryCards = [
    {
      title: "Total Balance",
      amount: balance,
      icon: Wallet,
      color: balance >= 0 ? 'green' : 'red',
      description: balance >= 0 ? 'Positive balance' : 'Negative balance',
      gradient: balance >= 0 
        ? 'from-green-500 to-emerald-600' 
        : 'from-red-500 to-rose-600'
    },
    {
      title: "Total Income",
      amount: totalIncome,
      icon: TrendingUp,
      color: 'green',
      description: `From ${transactions.filter(t => t.type === 'income').length} transactions`,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: "Total Expenses",
      amount: totalExpenses,
      icon: TrendingDown,
      color: 'red',
      description: `From ${transactions.filter(t => t.type === 'expense').length} transactions`,
      gradient: 'from-red-500 to-rose-600'
    }
  ];

  return (
    <div className="space-y-4">
      {summaryCards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Card key={card.title} className="backdrop-blur-sm bg-card/50 border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full bg-gradient-to-r ${card.gradient} shadow-lg`}>
                <IconComponent className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold mb-1 ${
                card.color === 'green' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {card.title === "Total Balance" && balance < 0 ? '-' : ''}
                {formatAmount(Math.abs(card.amount))}
              </div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
              <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transition-all duration-1000 ease-out`}
                  style={{ 
                    width: card.title === "Total Balance" 
                      ? '100%' 
                      : `${Math.min((card.amount / Math.max(totalIncome, totalExpenses, 1)) * 100, 100)}%` 
                  }}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
