import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, Trophy } from "lucide-react";

// Chart.js imports
declare global {
  interface Window {
    Chart: any;
  }
}

export default function DashboardCharts() {
  const weeklyChartRef = useRef<HTMLCanvasElement>(null);
  const performanceChartRef = useRef<HTMLCanvasElement>(null);

  const { data: players = [] } = useQuery({
    queryKey: ["/api/players"],
  });

  useEffect(() => {
    // Load Chart.js dynamically
    const loadChartJS = async () => {
      if (window.Chart) return;
      
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => {
        initializeCharts();
      };
      document.head.appendChild(script);
    };

    const initializeCharts = () => {
      if (!window.Chart || !weeklyChartRef.current || !performanceChartRef.current) return;

      // Weekly Performance Chart
      const weeklyCtx = weeklyChartRef.current.getContext('2d');
      new window.Chart(weeklyCtx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Fantasy Points',
            data: [45, 62, 38, 71, 56, 89, 67],
            borderColor: 'hsl(355, 85%, 45%)',
            backgroundColor: 'hsla(355, 85%, 45%, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'hsl(355, 85%, 45%)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0,0,0,0.1)'
              },
              ticks: {
                color: '#6B7280'
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#6B7280'
              }
            }
          },
          elements: {
            point: {
              hoverRadius: 8
            }
          }
        }
      });

      // Performance Distribution Chart
      const performanceCtx = performanceChartRef.current.getContext('2d');
      new window.Chart(performanceCtx, {
        type: 'doughnut',
        data: {
          labels: ['Wins', 'Losses', 'Ties'],
          datasets: [{
            data: [12, 6, 2],
            backgroundColor: [
              'hsl(142, 76%, 36%)',
              'hsl(355, 85%, 45%)',
              'hsl(43, 96%, 55%)'
            ],
            borderWidth: 0,
            cutout: '60%'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true,
                color: '#6B7280'
              }
            }
          }
        }
      });
    };

    loadChartJS();
  }, []);

  // Get top performers (mock data based on player names)
  const topPlayers = players.slice(0, 5).map((player: any, index: number) => ({
    ...player,
    fantasyPoints: 85 - (index * 8), // Mock descending fantasy points
    team: ['LAL', 'GSW', 'BOS', 'MIA', 'DAL'][index] || 'UNK'
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Weekly Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Weekly Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: '300px', position: 'relative' }}>
            <canvas ref={weeklyChartRef} width="400" height="300"></canvas>
          </div>
        </CardContent>
      </Card>

      {/* Top Players This Week */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-red-600" />
            Top Players This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topPlayers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">🏀</div>
              <p className="text-gray-500">No player data available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topPlayers.map((player: any, index: number) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={player.profileImageUrl} alt={player.name} />
                      <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                        {player.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-800">{player.name}</div>
                      <Badge variant="outline" className="text-xs">
                        {player.team}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{player.fantasyPoints.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">FPTS</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Performance Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: '300px', position: 'relative' }}>
            <canvas ref={performanceChartRef} width="400" height="300"></canvas>
          </div>
        </CardContent>
      </Card>

      {/* League Standings Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
            League Standings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-600' : 'bg-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Team {index + 1}</div>
                    <div className="text-sm text-gray-500">{12 - index}-{index + 2} Record</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">{(1200 - index * 50).toFixed(1)}</div>
                  <div className="text-xs text-gray-500">Points</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
