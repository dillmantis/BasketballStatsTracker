import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import DashboardCharts from "@/components/dashboard-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Trophy, TrendingUp, Users, DollarSign } from "lucide-react";

export default function Home() {
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

  const { data: userTeams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ["/api/fantasy-teams/user"],
    enabled: isAuthenticated,
  });

  const { data: userLeagues = [], isLoading: leaguesLoading } = useQuery({
    queryKey: ["/api/leagues/user"],
    enabled: isAuthenticated,
  });

  if (isLoading || teamsLoading || leaguesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  // Calculate user stats
  const totalPoints = userTeams.reduce((sum: number, team: any) => sum + (parseFloat(team.totalPoints) || 0), 0);
  const weeklyPoints = userTeams.reduce((sum: number, team: any) => sum + (parseFloat(team.weeklyPoints) || 0), 0);
  const activeLeagues = userLeagues.length;
  const totalWinnings = 347; // This would come from actual data

  // Get user's best ranking
  const bestRank = userTeams.reduce((best: number, team: any) => {
    const rank = team.rank || 999;
    return rank < best ? rank : best;
  }, 999);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-800 mb-4">Your Fantasy Dashboard</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your teams, monitor player performance, and stay ahead of the competition with real-time insights.
          </p>
        </div>

        {/* Dashboard Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Trophy className="w-8 h-8" />
                <div className="text-right">
                  <div className="text-sm opacity-80">Best League Rank</div>
                  <div className="text-2xl font-bold">{bestRank === 999 ? 'N/A' : `${bestRank}${bestRank === 1 ? 'st' : bestRank === 2 ? 'nd' : bestRank === 3 ? 'rd' : 'th'}`}</div>
                </div>
              </div>
              <div className="text-sm opacity-90">Across all leagues</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-600 to-red-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8" />
                <div className="text-right">
                  <div className="text-sm opacity-80">Total Points</div>
                  <div className="text-2xl font-bold">{totalPoints.toFixed(1)}</div>
                </div>
              </div>
              <div className="text-sm opacity-90">+{weeklyPoints.toFixed(1)} this week</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8" />
                <div className="text-right">
                  <div className="text-sm opacity-80">Active Leagues</div>
                  <div className="text-2xl font-bold">{activeLeagues}</div>
                </div>
              </div>
              <div className="text-sm opacity-90">{userTeams.length} teams total</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8" />
                <div className="text-right">
                  <div className="text-sm opacity-80">Winnings</div>
                  <div className="text-2xl font-bold">${totalWinnings}</div>
                </div>
              </div>
              <div className="text-sm opacity-90">This season</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <DashboardCharts />

        {/* Recent Activity */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Recent Fantasy Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userTeams.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No fantasy teams found</p>
                  <p className="text-sm text-gray-400">Join a league to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userTeams.slice(0, 5).map((team: any) => (
                    <div key={team.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-gray-800">{team.name}</div>
                        <div className="text-sm text-gray-600">League ID: {team.leagueId}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">{parseFloat(team.totalPoints || 0).toFixed(1)}</div>
                        <div className="text-xs text-gray-500">Total Points</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
