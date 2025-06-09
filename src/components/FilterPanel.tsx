
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionType } from '@/types/budget';

interface FilterPanelProps {
  onFilter: (filters: {
    dateRange: { start: Date | null; end: Date | null };
    type: TransactionType | 'all';
    category: string;
  }) => void;
}

export const FilterPanel = ({ onFilter }: FilterPanelProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState<TransactionType | 'all'>('all');
  const [category, setCategory] = useState('');

  const handleFilter = () => {
    onFilter({
      dateRange: {
        start: startDate ? new Date(startDate) : null,
        end: endDate ? new Date(endDate) : null,
      },
      type,
      category,
    });
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setType('all');
    setCategory('');
    onFilter({
      dateRange: { start: null, end: null },
      type: 'all',
      category: '',
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label htmlFor="start-date">From</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-date">To</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type-filter">Type</Label>
        <Select value={type} onValueChange={(value: TransactionType | 'all') => setType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category-filter">Category</Label>
        <Input
          id="category-filter"
          placeholder="Search by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleFilter} className="flex-1">
          Apply Filters
        </Button>
        <Button onClick={handleReset} variant="outline" className="flex-1">
          Reset
        </Button>
      </div>
    </div>
  );
};
