import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, DollarSign, PieChart, Shield, Smartphone } from 'lucide-react';
import { BudgetApp } from '@/components/BudgetApp';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // If user is authenticated, show the budget app directly
  useEffect(() => {
    if (!loading && user) {
      // User is authenticated, we can show the budget app
      return;
    }
  }, [user, loading]);

  // If user is authenticated, show the budget app
  if (!loading && user) {
    return <BudgetApp />;
  }

  // If still loading, show a loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Take Control of Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}Finances
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            A powerful, intuitive budget manager that helps you track expenses, visualize spending patterns, and achieve your financial goals.
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
          >
            Start Managing Your Budget
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-16 px-4">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-3 sm:pb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <CardTitle className="text-base sm:text-lg">Smart Tracking</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-center text-sm sm:text-base">
                Effortlessly track income and expenses with intelligent categorization
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-3 sm:pb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <PieChart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <CardTitle className="text-base sm:text-lg">Visual Insights</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-center text-sm sm:text-base">
                Beautiful charts and graphs to understand your spending patterns
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-3 sm:pb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <CardTitle className="text-base sm:text-lg">Secure & Private</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-center text-sm sm:text-base">
                Your financial data is encrypted and stored securely with Supabase
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-3 sm:pb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <CardTitle className="text-base sm:text-lg">Mobile Ready</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-center text-sm sm:text-base">
                Optimized for all devices - manage your budget anywhere, anytime
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Demo Preview */}
        <div className="text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
            Everything You Need to Manage Your Money
          </h2>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-gray-900">📊 Advanced Analytics</h3>
                <ul className="space-y-1 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                  <li>• Expense distribution charts</li>
                  <li>• Monthly income vs expenses</li>
                  <li>• Category-wise breakdowns</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-gray-900">🔍 Smart Filtering</h3>
                <ul className="space-y-1 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                  <li>• Date range filtering</li>
                  <li>• Category-based search</li>
                  <li>• CSV export functionality</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-gray-900">🌙 Modern Experience</h3>
                <ul className="space-y-1 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                  <li>• Dark mode support</li>
                  <li>• Real-time updates</li>
                  <li>• Responsive design</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-8 sm:mt-16 px-4">
          <Button 
            onClick={() => navigate('/auth')}
            variant="outline" 
            size="lg"
            className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
