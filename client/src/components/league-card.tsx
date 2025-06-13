import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, DollarSign } from "lucide-react";

interface League {
  id: number;
  name: string;
  description?: string;
  maxTeams: number;
  entryFee: string;
  prizePool: string;
  isPublic: boolean;
  season: string;
  createdAt: string;
}

interface LeagueCardProps {
  league: League;
  showJoinButton?: boolean;
}

export default function LeagueCard({ league, showJoinButton = false }: LeagueCardProps) {
  const entryFee = parseFloat(league.entryFee || "0");
  const prizePool = parseFloat(league.prizePool || "0");
  const isPaid = entryFee > 0;

  const handleManageTeam = () => {
    // Navigate to team management
    console.log("Manage team for league:", league.id);
  };

  const handleJoinLeague = () => {
    // Handle joining league
    console.log("Join league:", league.id);
  };

  return (
    <Card className="hover:shadow-xl transition-shadow overflow-hidden">
      {/* Header with gradient background */}
      <div className={`p-6 text-white ${
        isPaid 
          ? "bg-gradient-to-r from-blue-600 to-blue-700" 
          : "bg-gradient-to-r from-green-500 to-green-600"
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold truncate">{league.name}</h3>
          <Badge className={isPaid ? "bg-yellow-400 text-gray-900" : "bg-green-400 text-white"}>
            {isPaid ? "Pro" : "Free"}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-80">Max Teams</div>
            <div className="text-2xl font-bold">{league.maxTeams}</div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-80">Prize Pool</div>
            <div className="text-xl font-semibold">
              {prizePool > 0 ? `$${prizePool.toLocaleString()}` : "Bragging Rights"}
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <CardContent className="p-6">
        {league.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{league.description}</p>
        )}
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Season
            </span>
            <span className="font-semibold text-gray-800">{league.season}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Entry Fee
            </span>
            <span className="font-semibold text-gray-800">
              {entryFee > 0 ? `$${entryFee}` : "Free"}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Type
            </span>
            <span className="font-semibold text-gray-800">
              {league.isPublic ? "Public" : "Private"}
            </span>
          </div>
        </div>
        
        {showJoinButton ? (
          <Button 
            onClick={handleJoinLeague}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Join League
          </Button>
        ) : (
          <Button 
            onClick={handleManageTeam}
            className={`w-full font-semibold ${
              isPaid 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            <Trophy className="w-4 h-4 mr-2" />
            Manage Team
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
