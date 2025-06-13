import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Trophy, Users, BarChart3, CheckCircle, X } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-lg border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-black text-blue-800">
                <span className="text-red-600 mr-2">🏀</span>
                BasketballStatsNBA
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button onClick={handleLogin} className="bg-red-600 hover:bg-red-700 text-white font-semibold">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-800 to-red-600 text-white py-20">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            Fantasy Basketball
            <span className="block text-yellow-400">Redefined</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-medium">
            Real-time NBA stats, advanced analytics, and the most competitive fantasy leagues. 
            Join thousands of players already dominating the court.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleLogin}
              size="lg" 
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold text-lg px-8 py-4"
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-800 font-bold text-lg px-8 py-4"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-800 mb-4">Why Choose BasketballStatsNBA?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to dominate your fantasy basketball leagues</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4 text-blue-600">
                  <BarChart3 className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-bold mb-2">Real-Time Stats</h3>
                <p className="text-gray-600">Live NBA statistics updated instantly for all players and teams</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4 text-red-600">
                  <Users className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-bold mb-2">Fantasy Leagues</h3>
                <p className="text-gray-600">Create and join competitive fantasy leagues with friends</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4 text-yellow-500">
                  <Trophy className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-bold mb-2">Win Prizes</h3>
                <p className="text-gray-600">Compete for cash prizes and bragging rights</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4 text-green-600">
                  <Star className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
                <p className="text-gray-600">Deep insights and analytics to optimize your lineup</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Unlock premium features and take your fantasy game to the next level</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="bg-white text-gray-800">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Free</h3>
                  <div className="text-4xl font-black mb-2">$0<span className="text-lg font-normal text-gray-600">/month</span></div>
                  <p className="text-gray-600">Perfect for getting started</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>1 Fantasy League</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Basic Player Stats</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Weekly Recaps</span>
                  </li>
                  <li className="flex items-center text-gray-400">
                    <X className="w-5 h-5 mr-3" />
                    <span>Advanced Analytics</span>
                  </li>
                </ul>
                
                <Button onClick={handleLogin} className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-4 border-yellow-400 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-400 text-gray-900 px-6 py-2 text-sm font-bold">
                  MOST POPULAR
                </Badge>
              </div>
              
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <div className="text-4xl font-black mb-2">$19<span className="text-lg font-normal text-blue-200">/month</span></div>
                  <p className="text-blue-200">For serious fantasy players</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-yellow-400 mr-3" />
                    <span>Unlimited Fantasy Leagues</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-yellow-400 mr-3" />
                    <span>Advanced Player Analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-yellow-400 mr-3" />
                    <span>Real-time Notifications</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-yellow-400 mr-3" />
                    <span>Trade Analyzer</span>
                  </li>
                </ul>
                
                <Button onClick={handleLogin} className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold">
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>

            {/* Elite Plan */}
            <Card className="bg-white text-gray-800">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Elite</h3>
                  <div className="text-4xl font-black mb-2">$49<span className="text-lg font-normal text-gray-600">/month</span></div>
                  <p className="text-gray-600">For championship seekers</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>AI-Powered Lineup Optimizer</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Exclusive Expert Content</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Priority Customer Support</span>
                  </li>
                </ul>
                
                <Button onClick={handleLogin} className="w-full bg-red-600 text-white hover:bg-red-700">
                  Upgrade to Elite
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-black text-red-600 mb-4">
                <span className="mr-2">🏀</span>
                BasketballStatsNBA
              </div>
              <p className="text-gray-300 mb-4">The ultimate fantasy basketball platform with real-time stats and competitive leagues.</p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><button onClick={handleLogin} className="text-gray-300 hover:text-white transition-colors">Dashboard</button></li>
                <li><button onClick={handleLogin} className="text-gray-300 hover:text-white transition-colors">My Leagues</button></li>
                <li><button onClick={handleLogin} className="text-gray-300 hover:text-white transition-colors">Player Stats</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">API Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-8 pt-8 text-center">
            <p className="text-gray-300">&copy; 2024 BasketballStatsNBA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
