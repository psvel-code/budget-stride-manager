
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Settings } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';

export const CategoryManager = () => {
  const { categories, loading, addCategory, deleteCategory } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState<'income' | 'expense'>('expense');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsAddingCategory(true);
    const { error } = await addCategory({
      name: newCategoryName.trim(),
      type: newCategoryType,
    });

    if (!error) {
      setNewCategoryName('');
      setNewCategoryType('expense');
    }
    setIsAddingCategory(false);
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(id);
    }
  };

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Category Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Category Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Category Form */}
        <form onSubmit={handleAddCategory} className="space-y-4 p-4 border rounded-lg bg-muted/20">
          <h3 className="font-semibold text-sm">Add New Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-type">Type</Label>
              <Select value={newCategoryType} onValueChange={(value: 'income' | 'expense') => setNewCategoryType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={isAddingCategory || !newCategoryName.trim()} className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </form>

        {/* Categories List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Income Categories */}
          <div className="space-y-3">
            <h3 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
              Income Categories ({incomeCategories.length})
            </h3>
            {incomeCategories.length === 0 ? (
              <p className="text-muted-foreground text-sm">No custom income categories yet.</p>
            ) : (
              <div className="space-y-2">
                {incomeCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-2 border rounded bg-green-50 dark:bg-green-950/20">
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      {category.name}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                    >
                      <Trash2 className="h-3 w-3 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expense Categories */}
          <div className="space-y-3">
            <h3 className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
              Expense Categories ({expenseCategories.length})
            </h3>
            {expenseCategories.length === 0 ? (
              <p className="text-muted-foreground text-sm">No custom expense categories yet.</p>
            ) : (
              <div className="space-y-2">
                {expenseCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-2 border rounded bg-red-50 dark:bg-red-950/20">
                    <Badge variant="secondary" className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                      {category.name}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                    >
                      <Trash2 className="h-3 w-3 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
