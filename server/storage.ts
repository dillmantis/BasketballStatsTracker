import {
  users,
  teams,
  players,
  playerStats,
  leagues,
  fantasyTeams,
  fantasyRosters,
  matchups,
  type User,
  type UpsertUser,
  type Team,
  type Player,
  type PlayerStats,
  type League,
  type FantasyTeam,
  type FantasyRoster,
  type Matchup,
  type InsertTeam,
  type InsertPlayer,
  type InsertPlayerStats,
  type InsertLeague,
  type InsertFantasyTeam,
  type InsertFantasyRoster,
  type InsertMatchup,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  
  // Team operations
  getTeams(): Promise<Team[]>;
  createTeam(team: InsertTeam): Promise<Team>;
  
  // Player operations
  getPlayers(): Promise<Player[]>;
  getPlayer(id: number): Promise<Player | undefined>;
  getPlayersByTeam(teamId: number): Promise<Player[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  
  // Player stats operations
  getPlayerStats(playerId: number, season?: string): Promise<PlayerStats[]>;
  createPlayerStats(stats: InsertPlayerStats): Promise<PlayerStats>;
  updatePlayerStats(playerId: number, season: string, stats: Partial<InsertPlayerStats>): Promise<PlayerStats>;
  
  // League operations
  getLeagues(): Promise<League[]>;
  getLeaguesByUser(userId: string): Promise<League[]>;
  getLeague(id: number): Promise<League | undefined>;
  createLeague(league: InsertLeague): Promise<League>;
  
  // Fantasy team operations
  getFantasyTeamsByUser(userId: string): Promise<FantasyTeam[]>;
  getFantasyTeamsByLeague(leagueId: number): Promise<FantasyTeam[]>;
  createFantasyTeam(team: InsertFantasyTeam): Promise<FantasyTeam>;
  updateFantasyTeamStats(teamId: number, updates: Partial<InsertFantasyTeam>): Promise<FantasyTeam>;
  
  // Fantasy roster operations
  getFantasyRoster(fantasyTeamId: number): Promise<FantasyRoster[]>;
  addPlayerToRoster(roster: InsertFantasyRoster): Promise<FantasyRoster>;
  removePlayerFromRoster(fantasyTeamId: number, playerId: number): Promise<void>;
  
  // Matchup operations
  getMatchupsByLeague(leagueId: number, week?: number): Promise<Matchup[]>;
  createMatchup(matchup: InsertMatchup): Promise<Matchup>;
  
  // Admin operations
  getAdminStats(): Promise<{
    totalUsers: number;
    totalLeagues: number;
    premiumUsers: number;
    monthlyRevenue: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Team operations
  async getTeams(): Promise<Team[]> {
    return await db.select().from(teams).orderBy(teams.name);
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const [newTeam] = await db.insert(teams).values(team).returning();
    return newTeam;
  }

  // Player operations
  async getPlayers(): Promise<Player[]> {
    return await db
      .select()
      .from(players)
      .where(eq(players.isActive, true))
      .orderBy(players.name);
  }

  async getPlayer(id: number): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return player;
  }

  async getPlayersByTeam(teamId: number): Promise<Player[]> {
    return await db
      .select()
      .from(players)
      .where(and(eq(players.teamId, teamId), eq(players.isActive, true)))
      .orderBy(players.name);
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const [newPlayer] = await db.insert(players).values(player).returning();
    return newPlayer;
  }

  // Player stats operations
  async getPlayerStats(playerId: number, season?: string): Promise<PlayerStats[]> {
    if (season) {
      return await db
        .select()
        .from(playerStats)
        .where(and(eq(playerStats.playerId, playerId), eq(playerStats.season, season)))
        .orderBy(desc(playerStats.season));
    }
    
    return await db
      .select()
      .from(playerStats)
      .where(eq(playerStats.playerId, playerId))
      .orderBy(desc(playerStats.season));
  }

  async createPlayerStats(stats: InsertPlayerStats): Promise<PlayerStats> {
    const [newStats] = await db.insert(playerStats).values(stats).returning();
    return newStats;
  }

  async updatePlayerStats(playerId: number, season: string, stats: Partial<InsertPlayerStats>): Promise<PlayerStats> {
    const [updatedStats] = await db
      .update(playerStats)
      .set({ ...stats, updatedAt: new Date() })
      .where(and(eq(playerStats.playerId, playerId), eq(playerStats.season, season)))
      .returning();
    return updatedStats;
  }

  // League operations
  async getLeagues(): Promise<League[]> {
    return await db
      .select()
      .from(leagues)
      .where(eq(leagues.isActive, true))
      .orderBy(desc(leagues.createdAt));
  }

  async getLeaguesByUser(userId: string): Promise<League[]> {
    const results = await db
      .select({ leagues })
      .from(leagues)
      .innerJoin(fantasyTeams, eq(leagues.id, fantasyTeams.leagueId))
      .where(and(eq(fantasyTeams.userId, userId), eq(leagues.isActive, true)))
      .orderBy(desc(leagues.createdAt));
    
    return results.map(result => result.leagues);
  }

  async getLeague(id: number): Promise<League | undefined> {
    const [league] = await db.select().from(leagues).where(eq(leagues.id, id));
    return league;
  }

  async createLeague(league: InsertLeague): Promise<League> {
    const [newLeague] = await db.insert(leagues).values(league).returning();
    return newLeague;
  }

  // Fantasy team operations
  async getFantasyTeamsByUser(userId: string): Promise<FantasyTeam[]> {
    return await db
      .select()
      .from(fantasyTeams)
      .where(eq(fantasyTeams.userId, userId))
      .orderBy(desc(fantasyTeams.updatedAt));
  }

  async getFantasyTeamsByLeague(leagueId: number): Promise<FantasyTeam[]> {
    return await db
      .select()
      .from(fantasyTeams)
      .where(eq(fantasyTeams.leagueId, leagueId))
      .orderBy(fantasyTeams.rank);
  }

  async createFantasyTeam(team: InsertFantasyTeam): Promise<FantasyTeam> {
    const [newTeam] = await db.insert(fantasyTeams).values(team).returning();
    return newTeam;
  }

  async updateFantasyTeamStats(teamId: number, updates: Partial<InsertFantasyTeam>): Promise<FantasyTeam> {
    const [updatedTeam] = await db
      .update(fantasyTeams)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(fantasyTeams.id, teamId))
      .returning();
    return updatedTeam;
  }

  // Fantasy roster operations
  async getFantasyRoster(fantasyTeamId: number): Promise<FantasyRoster[]> {
    return await db
      .select()
      .from(fantasyRosters)
      .where(and(eq(fantasyRosters.fantasyTeamId, fantasyTeamId), eq(fantasyRosters.isActive, true)))
      .orderBy(fantasyRosters.position);
  }

  async addPlayerToRoster(roster: InsertFantasyRoster): Promise<FantasyRoster> {
    const [newRoster] = await db.insert(fantasyRosters).values(roster).returning();
    return newRoster;
  }

  async removePlayerFromRoster(fantasyTeamId: number, playerId: number): Promise<void> {
    await db
      .update(fantasyRosters)
      .set({ isActive: false })
      .where(and(eq(fantasyRosters.fantasyTeamId, fantasyTeamId), eq(fantasyRosters.playerId, playerId)));
  }

  // Matchup operations
  async getMatchupsByLeague(leagueId: number, week?: number): Promise<Matchup[]> {
    if (week) {
      return await db
        .select()
        .from(matchups)
        .where(and(eq(matchups.leagueId, leagueId), eq(matchups.week, week)))
        .orderBy(matchups.week);
    }
    
    return await db
      .select()
      .from(matchups)
      .where(eq(matchups.leagueId, leagueId))
      .orderBy(matchups.week);
  }

  async createMatchup(matchup: InsertMatchup): Promise<Matchup> {
    const [newMatchup] = await db.insert(matchups).values(matchup).returning();
    return newMatchup;
  }

  // Admin operations
  async getAdminStats(): Promise<{
    totalUsers: number;
    totalLeagues: number;
    premiumUsers: number;
    monthlyRevenue: number;
  }> {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [leagueCount] = await db.select({ count: count() }).from(leagues).where(eq(leagues.isActive, true));
    const [premiumCount] = await db
      .select({ count: count() })
      .from(users)
      .where(sql`${users.subscriptionTier} != 'free'`);

    return {
      totalUsers: userCount.count,
      totalLeagues: leagueCount.count,
      premiumUsers: premiumCount.count,
      monthlyRevenue: 18247, // This would be calculated from Stripe data
    };
  }
}

export const storage = new DatabaseStorage();
