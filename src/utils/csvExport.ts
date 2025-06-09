
import { Transaction } from '@/types/budget';

export const exportToCSV = (transactions: Transaction[]) => {
  if (transactions.length === 0) {
    alert('No transactions to export');
    return;
  }

  const headers = ['Date', 'Type', 'Description', 'Category', 'Amount'];
  
  const csvContent = [
    headers.join(','),
    ...transactions.map(transaction => [
      transaction.date,
      transaction.type,
      `"${transaction.description}"`, // Wrap in quotes to handle commas
      transaction.category,
      transaction.amount.toString()
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `budget-transactions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
