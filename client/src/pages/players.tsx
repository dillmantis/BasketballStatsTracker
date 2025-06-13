import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import PlayerStatsTable from "@/components/player-stats-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter } from "lucide-react";

export default function Players() {
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
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

  const { data: players = [], isLoading: playersLoading } = useQuery({
    queryKey: ["/api/players"],
    enabled: isAuthenticated,
  });

  // Filter players based on search and position
  const filteredPlayers = players.filter((player: any) => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = positionFilter === "all" || player.position === positionFilter;
    return matchesSearch && matchesPosition;
  });

  if (isLoading || playersLoading) {
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-800 mb-4">Player Statistics</h1>
            <p className="text-xl text-gray-600">Real-time stats and analytics for every NBA player</p>
          </div>
          
          <div className="flex space-x-4">
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                <SelectItem value="PG">Point Guard</SelectItem>
                <SelectItem value="SG">Shooting Guard</SelectItem>
                <SelectItem value="SF">Small Forward</SelectItem>
                <SelectItem value="PF">Power Forward</SelectItem>
                <SelectItem value="C">Center</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Player Stats Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>NBA Player Statistics</span>
              <span className="text-sm font-normal text-gray-500">
                {filteredPlayers.length} of {players.length} players
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPlayers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">🏀</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No players found</h3>
                <p className="text-gray-500">
                  {searchTerm || positionFilter !== "all" 
                    ? "Try adjusting your search or filter criteria"
                    : "No player data available"
                  }
                </p>
              </div>
            ) : (
              <PlayerStatsTable players={filteredPlayers} />
            )}
          </CardContent>
        </Card>

        {/* Player Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">{players.length}</div>
              <div className="text-sm text-gray-600">Total Players</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600 mb-2">
                {players.filter((p: any) => parseFloat(p.pointsPerGame || "0") > 20).length}
              </div>
              <div className="text-sm text-gray-600">20+ PPG Scorers</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-2">
                {players.filter((p: any) => parseFloat(p.assistsPerGame || "0") > 7).length}
              </div>
              <div className="text-sm text-gray-600">Elite Playmakers (7+ APG)</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {players.filter((p: any) => parseFloat(p.reboundsPerGame || "0") > 10).length}
              </div>
              <div className="text-sm text-gray-600">Double-Double Machines (10+ RPG)</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
