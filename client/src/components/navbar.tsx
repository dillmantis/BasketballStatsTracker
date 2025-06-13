import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X, Home, Users, BarChart3, Settings, LogOut, Crown } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleUpgrade = () => {
    window.location.href = "/subscribe";
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white shadow-lg border-b-4 border-red-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="text-2xl font-black text-blue-800">
                <span className="text-red-600 mr-2">🏀</span>
                BasketballStatsNBA
              </div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <a className={`flex items-center space-x-1 font-semibold transition-colors ${
                isActive("/") ? "text-red-600" : "text-gray-700 hover:text-red-600"
              }`}>
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </a>
            </Link>
            <Link href="/leagues">
              <a className={`flex items-center space-x-1 font-semibold transition-colors ${
                isActive("/leagues") ? "text-red-600" : "text-gray-700 hover:text-red-600"
              }`}>
                <Users className="w-4 h-4" />
                <span>My Leagues</span>
              </a>
            </Link>
            <Link href="/players">
              <a className={`flex items-center space-x-1 font-semibold transition-colors ${
                isActive("/players") ? "text-red-600" : "text-gray-700 hover:text-red-600"
              }`}>
                <BarChart3 className="w-4 h-4" />
                <span>Players</span>
              </a>
            </Link>
            <Link href="/admin">
              <a className={`flex items-center space-x-1 font-semibold transition-colors ${
                isActive("/admin") ? "text-red-600" : "text-gray-700 hover:text-red-600"
              }`}>
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </a>
            </Link>
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {(!user?.subscriptionTier || user.subscriptionTier === "free") && (
              <Button 
                onClick={handleUpgrade}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Pro
              </Button>
            )}
            
            {user?.subscriptionTier && user.subscriptionTier !== "free" && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 font-semibold">
                {user.subscriptionTier.toUpperCase()}
              </Badge>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || "User"} />
                    <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                      {getInitials(user?.firstName, user?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex-col items-start">
                  <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
              <Link href="/">
                <a className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/") ? "text-red-600 bg-red-50" : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                }`}>
                  Dashboard
                </a>
              </Link>
              <Link href="/leagues">
                <a className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/leagues") ? "text-red-600 bg-red-50" : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                }`}>
                  My Leagues
                </a>
              </Link>
              <Link href="/players">
                <a className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/players") ? "text-red-600 bg-red-50" : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                }`}>
                  Players
                </a>
              </Link>
              <Link href="/admin">
                <a className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/admin") ? "text-red-600 bg-red-50" : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                }`}>
                  Admin
                </a>
              </Link>
              
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex items-center px-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || "User"} />
                    <AvatarFallback className="bg-blue-600 text-white font-semibold">
                      {getInitials(user?.firstName, user?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                </div>
                
                {(!user?.subscriptionTier || user.subscriptionTier === "free") && (
                  <Button 
                    onClick={handleUpgrade}
                    className="w-full mx-3 mb-2 bg-red-600 hover:bg-red-700 text-white font-semibold"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Pro
                  </Button>
                )}
                
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full mx-3 justify-start"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
