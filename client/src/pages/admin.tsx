import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { 
  Server, 
  Users, 
  CreditCard, 
  Activity, 
  Download, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

export default function Admin() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: adminStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated,
  });

  const handleForceSync = async () => {
    try {
      toast({
        title: "Data Sync",
        description: "Initiating data synchronization...",
      });
      // This would trigger actual data sync
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadLogs = async () => {
    try {
      toast({
        title: "Download",
        description: "Preparing log files for download...",
      });
      // This would trigger log download
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download logs. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInitMockData = async () => {
    try {
      await apiRequest("POST", "/api/init-mock-data");
      toast({
        title: "Success",
        description: "Mock data initialized successfully!",
      });
    } catch (error) {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to initialize mock data. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-800 mb-4">Admin Dashboard</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive management tools for league administrators
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* API Status & Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="w-5 h-5 mr-2 text-blue-600" />
                API Status & Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                  <span className="font-semibold text-gray-700">NBA API Connection</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-yellow-500 mr-3" />
                  <span className="font-semibold text-gray-700">Data Scraper</span>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Running</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <Activity className="w-4 h-4 text-blue-500 mr-3" />
                  <span className="font-semibold text-gray-700">Last Sync</span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">2 mins ago</Badge>
              </div>
              
              <div className="space-y-3 pt-4">
                <Button onClick={handleForceSync} className="w-full bg-blue-600 hover:bg-blue-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Force Data Sync
                </Button>
                <Button onClick={handleDownloadLogs} variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Logs
                </Button>
                <Button onClick={handleInitMockData} variant="outline" className="w-full">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Initialize Mock Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* League Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-red-600" />
                League Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Active Leagues</span>
                  <span className="font-bold text-2xl text-blue-600">
                    {adminStats?.totalLeagues || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Users</span>
                  <span className="font-bold text-2xl text-blue-600">
                    {adminStats?.totalUsers || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Premium Subscribers</span>
                  <span className="font-bold text-2xl text-yellow-600">
                    {adminStats?.premiumUsers || 0}
                  </span>
                </div>
              </div>
              
              {/* Simple chart placeholder */}
              <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">User Growth Chart</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment & Subscription Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-yellow-600" />
              Payment & Subscription Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">
                  ${adminStats?.monthlyRevenue?.toLocaleString() || "0"}
                </div>
                <div className="text-sm text-gray-600">Monthly Revenue</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">47</div>
                <div className="text-sm text-gray-600">New Subscriptions</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">3.2%</div>
                <div className="text-sm text-gray-600">Churn Rate</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-600">12</div>
                <div className="text-sm text-gray-600">Failed Payments</div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Export Transactions
              </Button>
              <Button variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                Manage Subscriptions
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
