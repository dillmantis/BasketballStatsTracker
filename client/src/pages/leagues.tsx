import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import LeagueCard from "@/components/league-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Trophy, Users } from "lucide-react";

const createLeagueSchema = z.object({
  name: z.string().min(1, "League name is required").max(50, "League name must be under 50 characters"),
  description: z.string().max(200, "Description must be under 200 characters").optional(),
  maxTeams: z.number().min(4, "Minimum 4 teams").max(20, "Maximum 20 teams").default(12),
  entryFee: z.number().min(0, "Entry fee cannot be negative").default(0),
  isPublic: z.boolean().default(true),
});

type CreateLeagueForm = z.infer<typeof createLeagueSchema>;

export default function Leagues() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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

  const { data: userLeagues = [], isLoading: leaguesLoading } = useQuery({
    queryKey: ["/api/leagues/user"],
    enabled: isAuthenticated,
  });

  const { data: publicLeagues = [], isLoading: publicLoading } = useQuery({
    queryKey: ["/api/leagues"],
    enabled: isAuthenticated,
  });

  const form = useForm<CreateLeagueForm>({
    resolver: zodResolver(createLeagueSchema),
    defaultValues: {
      name: "",
      description: "",
      maxTeams: 12,
      entryFee: 0,
      isPublic: true,
    },
  });

  const createLeagueMutation = useMutation({
    mutationFn: async (data: CreateLeagueForm) => {
      await apiRequest("POST", "/api/leagues", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "League created successfully!",
      });
      setIsCreateDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/leagues/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leagues"] });
    },
    onError: (error) => {
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
        description: "Failed to create league. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateLeagueForm) => {
    createLeagueMutation.mutate(data);
  };

  if (isLoading || leaguesLoading) {
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
            <h1 className="text-4xl font-black text-gray-800 mb-4">My Fantasy Leagues</h1>
            <p className="text-xl text-gray-600">Manage your teams, check standings, and make strategic moves to dominate your leagues.</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create League
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New League</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>League Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter league name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe your league" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="maxTeams"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Teams</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="4" 
                            max="20" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="entryFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entry Fee ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={createLeagueMutation.isPending} className="flex-1">
                      {createLeagueMutation.isPending ? "Creating..." : "Create League"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* My Leagues */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {userLeagues.map((league: any) => (
            <LeagueCard key={league.id} league={league} />
          ))}
          
          {/* Create New League Card */}
          <Card className="border-2 border-dashed border-gray-300 hover:border-blue-600 transition-colors cursor-pointer" onClick={() => setIsCreateDialogOpen(true)}>
            <CardContent className="flex items-center justify-center p-8 min-h-[300px]">
              <div className="text-center">
                <div className="text-6xl text-gray-300 mb-4">
                  <Plus className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Create New League</h3>
                <p className="text-gray-500 mb-6">Start a new fantasy league with friends or join existing ones</p>
                <Button className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold">
                  Get Started
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Public Leagues */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            Public Leagues to Join
          </h2>
          
          {publicLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {publicLeagues.slice(0, 6).map((league: any) => (
                <LeagueCard key={league.id} league={league} showJoinButton />
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {userLeagues.length === 0 && (
          <Card className="mt-8">
            <CardContent className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No leagues yet</h3>
              <p className="text-gray-500 mb-6">Create your first fantasy league or join an existing one to get started!</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First League
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
