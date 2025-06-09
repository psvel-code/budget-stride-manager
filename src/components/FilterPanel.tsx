
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Filter, RotateCcw } from 'lucide-react';
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

  const activeFilters = [
    startDate && { label: `From: ${new Date(startDate).toLocaleDateString()}`, key: 'startDate' },
    endDate && { label: `To: ${new Date(endDate).toLocaleDateString()}`, key: 'endDate' },
    type !== 'all' && { label: `Type: ${type}`, key: 'type' },
    category && { label: `Category: ${category}`, key: 'category' },
  ].filter(Boolean);

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

  const removeFilter = (filterKey: string) => {
    switch (filterKey) {
      case 'startDate':
        setStartDate('');
        break;
      case 'endDate':
        setEndDate('');
        break;
      case 'type':
        setType('all');
        break;
      case 'category':
        setCategory('');
        break;
    }
    // Auto-apply filters after removal
    setTimeout(handleFilter, 0);
  };

  return (
    <div className="space-y-4">
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Active Filters</Label>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter: any) => (
              <Badge key={filter.key} variant="secondary" className="text-xs px-2 py-1 flex items-center gap-1">
                {filter.label}
                <button
                  onClick={() => removeFilter(filter.key)}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="start-date" className="text-sm font-medium">From</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-date" className="text-sm font-medium">To</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type-filter" className="text-sm font-medium">Type</Label>
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
        <Label htmlFor="category-filter" className="text-sm font-medium">Category</Label>
        <Input
          id="category-filter"
          placeholder="Search by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="text-sm"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button 
          onClick={handleFilter} 
          className="flex-1 bg-gradient-to-r from-primary to-primary/80"
          size="sm"
        >
          <Filter className="h-4 w-4 mr-2" />
          Apply
        </Button>
        <Button 
          onClick={handleReset} 
          variant="outline" 
          className="flex-1"
          size="sm"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
};
