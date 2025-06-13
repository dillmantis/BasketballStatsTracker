import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertLeagueSchema, 
  insertFantasyTeamSchema, 
  insertPlayerStatsSchema 
} from "@shared/schema";

// Initialize Stripe only if the secret key is available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== '') {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Team routes
  app.get('/api/teams', async (req, res) => {
    try {
      const teams = await storage.getTeams();
      res.json(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  // Player routes
  app.get('/api/players', async (req, res) => {
    try {
      const players = await storage.getPlayers();
      res.json(players);
    } catch (error) {
      console.error("Error fetching players:", error);
      res.status(500).json({ message: "Failed to fetch players" });
    }
  });

  app.get('/api/players/:id', async (req, res) => {
    try {
      const playerId = parseInt(req.params.id);
      const player = await storage.getPlayer(playerId);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      res.json(player);
    } catch (error) {
      console.error("Error fetching player:", error);
      res.status(500).json({ message: "Failed to fetch player" });
    }
  });

  app.get('/api/players/:id/stats', async (req, res) => {
    try {
      const playerId = parseInt(req.params.id);
      const season = req.query.season as string;
      const stats = await storage.getPlayerStats(playerId, season);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching player stats:", error);
      res.status(500).json({ message: "Failed to fetch player stats" });
    }
  });

  // League routes
  app.get('/api/leagues', async (req, res) => {
    try {
      const leagues = await storage.getLeagues();
      res.json(leagues);
    } catch (error) {
      console.error("Error fetching leagues:", error);
      res.status(500).json({ message: "Failed to fetch leagues" });
    }
  });

  app.get('/api/leagues/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const leagues = await storage.getLeaguesByUser(userId);
      res.json(leagues);
    } catch (error) {
      console.error("Error fetching user leagues:", error);
      res.status(500).json({ message: "Failed to fetch user leagues" });
    }
  });

  app.post('/api/leagues', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const leagueData = insertLeagueSchema.parse({
        ...req.body,
        ownerId: userId,
        season: "2023-24",
      });
      
      const league = await storage.createLeague(leagueData);
      
      // Create fantasy team for the league owner
      const fantasyTeamData = insertFantasyTeamSchema.parse({
        name: `${req.user.claims.first_name || 'User'}'s Team`,
        leagueId: league.id,
        userId: userId,
      });
      
      await storage.createFantasyTeam(fantasyTeamData);
      
      res.json(league);
    } catch (error) {
      console.error("Error creating league:", error);
      res.status(500).json({ message: "Failed to create league" });
    }
  });

  app.get('/api/leagues/:id', async (req, res) => {
    try {
      const leagueId = parseInt(req.params.id);
      const league = await storage.getLeague(leagueId);
      if (!league) {
        return res.status(404).json({ message: "League not found" });
      }
      res.json(league);
    } catch (error) {
      console.error("Error fetching league:", error);
      res.status(500).json({ message: "Failed to fetch league" });
    }
  });

  app.get('/api/leagues/:id/teams', async (req, res) => {
    try {
      const leagueId = parseInt(req.params.id);
      const teams = await storage.getFantasyTeamsByLeague(leagueId);
      res.json(teams);
    } catch (error) {
      console.error("Error fetching league teams:", error);
      res.status(500).json({ message: "Failed to fetch league teams" });
    }
  });

  // Fantasy team routes
  app.get('/api/fantasy-teams/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const teams = await storage.getFantasyTeamsByUser(userId);
      res.json(teams);
    } catch (error) {
      console.error("Error fetching user fantasy teams:", error);
      res.status(500).json({ message: "Failed to fetch user fantasy teams" });
    }
  });

  app.post('/api/fantasy-teams', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const teamData = insertFantasyTeamSchema.parse({
        ...req.body,
        userId: userId,
      });
      
      const team = await storage.createFantasyTeam(teamData);
      res.json(team);
    } catch (error) {
      console.error("Error creating fantasy team:", error);
      res.status(500).json({ message: "Failed to create fantasy team" });
    }
  });

  app.get('/api/fantasy-teams/:id/roster', async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const roster = await storage.getFantasyRoster(teamId);
      res.json(roster);
    } catch (error) {
      console.error("Error fetching team roster:", error);
      res.status(500).json({ message: "Failed to fetch team roster" });
    }
  });

  // Admin routes
  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin (you'd implement proper role checking)
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  // Stripe subscription route
  app.post('/api/get-or-create-subscription', isAuthenticated, async (req: any, res) => {
    if (!stripe) {
      return res.status(500).json({ 
        message: "Stripe not configured. Please add STRIPE_SECRET_KEY environment variable." 
      });
    }

    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        const invoice = subscription.latest_invoice;
        let clientSecret = null;
        
        if (invoice && typeof invoice === 'object' && invoice.payment_intent) {
          const paymentIntent = invoice.payment_intent;
          clientSecret = typeof paymentIntent === 'object' ? paymentIntent.client_secret : null;
        }
        
        return res.json({
          subscriptionId: subscription.id,
          clientSecret,
        });
      }
      
      if (!user.email) {
        return res.status(400).json({ message: 'No user email on file' });
      }

      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: process.env.STRIPE_PRICE_ID || "price_1234567890", // Replace with actual price ID
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      await storage.updateUserStripeInfo(userId, customer.id, subscription.id);
      
      const invoice = subscription.latest_invoice;
      let clientSecret = null;
      
      if (invoice && typeof invoice === 'object' && invoice.payment_intent) {
        const paymentIntent = invoice.payment_intent;
        clientSecret = typeof paymentIntent === 'object' ? paymentIntent.client_secret : null;
      }
  
      res.json({
        subscriptionId: subscription.id,
        clientSecret,
      });
    } catch (error: any) {
      console.error("Stripe subscription error:", error);
      return res.status(400).json({ error: { message: error.message } });
    }
  });

  // Stripe one-time payment route
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ 
        message: "Stripe not configured. Please add STRIPE_SECRET_KEY environment variable." 
      });
    }

    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  // Initialize mock data endpoint (for development)
  app.post('/api/init-mock-data', async (req, res) => {
    try {
      // Create teams
      const teams = [
        { name: "Lakers", abbreviation: "LAL", city: "Los Angeles", conference: "Western", division: "Pacific" },
        { name: "Warriors", abbreviation: "GSW", city: "Golden State", conference: "Western", division: "Pacific" },
        { name: "Celtics", abbreviation: "BOS", city: "Boston", conference: "Eastern", division: "Atlantic" },
        { name: "Heat", abbreviation: "MIA", city: "Miami", conference: "Eastern", division: "Southeast" },
      ];

      const createdTeams = [];
      for (const team of teams) {
        createdTeams.push(await storage.createTeam(team));
      }

      // Create players
      const players = [
        { name: "LeBron James", teamId: createdTeams[0].id, position: "SF", jerseyNumber: 6, age: 39 },
        { name: "Stephen Curry", teamId: createdTeams[1].id, position: "PG", jerseyNumber: 30, age: 35 },
        { name: "Jayson Tatum", teamId: createdTeams[2].id, position: "SF", jerseyNumber: 0, age: 25 },
        { name: "Jimmy Butler", teamId: createdTeams[3].id, position: "SF", jerseyNumber: 22, age: 34 },
      ];

      const createdPlayers = [];
      for (const player of players) {
        createdPlayers.push(await storage.createPlayer(player));
      }

      // Create player stats
      const playerStatsData = [
        { playerId: createdPlayers[0].id, season: "2023-24", pointsPerGame: "25.7", reboundsPerGame: "7.3", assistsPerGame: "8.3", fieldGoalPercentage: "54.0", fantasyPoints: "45.2" },
        { playerId: createdPlayers[1].id, season: "2023-24", pointsPerGame: "26.4", reboundsPerGame: "4.5", assistsPerGame: "5.2", fieldGoalPercentage: "45.0", fantasyPoints: "42.8" },
        { playerId: createdPlayers[2].id, season: "2023-24", pointsPerGame: "26.9", reboundsPerGame: "8.1", assistsPerGame: "4.9", fieldGoalPercentage: "47.1", fantasyPoints: "44.1" },
        { playerId: createdPlayers[3].id, season: "2023-24", pointsPerGame: "20.9", reboundsPerGame: "5.3", assistsPerGame: "5.0", fieldGoalPercentage: "49.9", fantasyPoints: "38.7" },
      ];

      for (const stats of playerStatsData) {
        await storage.createPlayerStats(stats);
      }

      res.json({ message: "Mock data initialized successfully" });
    } catch (error) {
      console.error("Error initializing mock data:", error);
      res.status(500).json({ message: "Failed to initialize mock data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
