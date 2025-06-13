import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Player {
  id: number;
  name: string;
  teamId?: number;
  position: string;
  jerseyNumber?: number;
  profileImageUrl?: string;
  isActive: boolean;
}

interface PlayerStatsTableProps {
  players: Player[];
}

export default function PlayerStatsTable({ players }: PlayerStatsTableProps) {
  const [watchlist, setWatchlist] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const handleAddToWatchlist = (playerId: number, playerName: string) => {
    const newWatchlist = new Set(watchlist);
    if (watchlist.has(playerId)) {
      newWatchlist.delete(playerId);
      toast({
        title: "Removed from Watchlist",
        description: `${playerName} has been removed from your watchlist.`,
      });
    } else {
      newWatchlist.add(playerId);
      toast({
        title: "Added to Watchlist",
        description: `${playerName} has been added to your watchlist.`,
      });
    }
    setWatchlist(newWatchlist);
  };

  const getTeamAbbreviation = (teamId?: number) => {
    // This would normally map team IDs to abbreviations
    // For now, return a placeholder
    const teamMap: { [key: number]: string } = {
      1: "LAL",
      2: "GSW", 
      3: "BOS",
      4: "MIA"
    };
    return teamMap[teamId || 0] || "N/A";
  };

  const getPositionColor = (position: string) => {
    const colors: { [key: string]: string } = {
      "PG": "bg-blue-100 text-blue-800",
      "SG": "bg-green-100 text-green-800", 
      "SF": "bg-yellow-100 text-yellow-800",
      "PF": "bg-orange-100 text-orange-800",
      "C": "bg-purple-100 text-purple-800"
    };
    return colors[position] || "bg-gray-100 text-gray-800";
  };

  // Mock stats - in a real app these would come from player stats
  const mockStats = {
    ppg: Math.floor(Math.random() * 20) + 10,
    rpg: Math.floor(Math.random() * 8) + 3,
    apg: Math.floor(Math.random() * 7) + 2,
    fg: Math.floor(Math.random() * 20) + 40,
    fantasyPoints: Math.floor(Math.random() * 30) + 25
  };

  if (players.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">🏀</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No players found</h3>
        <p className="text-gray-500">No player data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-bold text-gray-700">Player</TableHead>
            <TableHead className="font-bold text-gray-700">Team</TableHead>
            <TableHead className="font-bold text-gray-700">Position</TableHead>
            <TableHead className="font-bold text-gray-700 text-center">PPG</TableHead>
            <TableHead className="font-bold text-gray-700 text-center">RPG</TableHead>
            <TableHead className="font-bold text-gray-700 text-center">APG</TableHead>
            <TableHead className="font-bold text-gray-700 text-center">FG%</TableHead>
            <TableHead className="font-bold text-gray-700 text-center">Fantasy Pts</TableHead>
            <TableHead className="font-bold text-gray-700 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => {
            const isInWatchlist = watchlist.has(player.id);
            const stats = {
              ppg: mockStats.ppg + (player.id % 10),
              rpg: mockStats.rpg + (player.id % 5),
              apg: mockStats.apg + (player.id % 4),
              fg: mockStats.fg + (player.id % 15),
              fantasyPoints: mockStats.fantasyPoints + (player.id % 20)
            };
            
            return (
              <TableRow key={player.id} className="hover:bg-gray-50 transition-colors">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={player.profileImageUrl} alt={player.name} />
                      <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                        {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-800">{player.name}</div>
                      {player.jerseyNumber && (
                        <div className="text-sm text-gray-500">#{player.jerseyNumber}</div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-medium">
                    {getTeamAbbreviation(player.teamId)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPositionColor(player.position)}>
                    {player.position}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-semibold">{stats.ppg.toFixed(1)}</TableCell>
                <TableCell className="text-center font-semibold">{stats.rpg.toFixed(1)}</TableCell>
                <TableCell className="text-center font-semibold">{stats.apg.toFixed(1)}</TableCell>
                <TableCell className="text-center font-semibold">{stats.fg.toFixed(1)}%</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <span className="font-bold text-blue-600">{stats.fantasyPoints.toFixed(1)}</span>
                    {stats.fantasyPoints > 40 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddToWatchlist(player.id, player.name)}
                    className={`font-semibold ${
                      isInWatchlist 
                        ? "text-yellow-600 hover:text-yellow-700" 
                        : "text-red-600 hover:text-red-700"
                    }`}
                  >
                    <Star className={`w-4 h-4 mr-1 ${isInWatchlist ? "fill-current" : ""}`} />
                    {isInWatchlist ? "Added" : "Add"}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
