import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionTier: varchar("subscription_tier").default("free"), // free, pro, elite
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// NBA Teams
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  abbreviation: varchar("abbreviation").notNull(),
  city: varchar("city").notNull(),
  conference: varchar("conference").notNull(), // Eastern, Western
  division: varchar("division").notNull(),
  logoUrl: varchar("logo_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// NBA Players
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  teamId: integer("team_id").references(() => teams.id),
  position: varchar("position").notNull(), // PG, SG, SF, PF, C
  jerseyNumber: integer("jersey_number"),
  height: varchar("height"),
  weight: integer("weight"),
  age: integer("age"),
  profileImageUrl: varchar("profile_image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Player Statistics
export const playerStats = pgTable("player_stats", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => players.id),
  season: varchar("season").notNull(), // e.g., "2023-24"
  gamesPlayed: integer("games_played").default(0),
  pointsPerGame: decimal("points_per_game", { precision: 5, scale: 2 }).default("0"),
  reboundsPerGame: decimal("rebounds_per_game", { precision: 5, scale: 2 }).default("0"),
  assistsPerGame: decimal("assists_per_game", { precision: 5, scale: 2 }).default("0"),
  fieldGoalPercentage: decimal("field_goal_percentage", { precision: 5, scale: 2 }).default("0"),
  threePointPercentage: decimal("three_point_percentage", { precision: 5, scale: 2 }).default("0"),
  freeThrowPercentage: decimal("free_throw_percentage", { precision: 5, scale: 2 }).default("0"),
  stealsPerGame: decimal("steals_per_game", { precision: 5, scale: 2 }).default("0"),
  blocksPerGame: decimal("blocks_per_game", { precision: 5, scale: 2 }).default("0"),
  turnoversPerGame: decimal("turnovers_per_game", { precision: 5, scale: 2 }).default("0"),
  fantasyPoints: decimal("fantasy_points", { precision: 6, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fantasy Leagues
export const leagues = pgTable("leagues", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  ownerId: varchar("owner_id").references(() => users.id),
  maxTeams: integer("max_teams").default(12),
  entryFee: decimal("entry_fee", { precision: 10, scale: 2 }).default("0"),
  prizePool: decimal("prize_pool", { precision: 10, scale: 2 }).default("0"),
  isPublic: boolean("is_public").default(true),
  isActive: boolean("is_active").default(true),
  draftDate: timestamp("draft_date"),
  season: varchar("season").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fantasy Teams (User teams within leagues)
export const fantasyTeams = pgTable("fantasy_teams", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  leagueId: integer("league_id").references(() => leagues.id),
  userId: varchar("user_id").references(() => users.id),
  totalPoints: decimal("total_points", { precision: 10, scale: 2 }).default("0"),
  weeklyPoints: decimal("weekly_points", { precision: 8, scale: 2 }).default("0"),
  wins: integer("wins").default(0),
  losses: integer("losses").default(0),
  rank: integer("rank").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fantasy Team Rosters
export const fantasyRosters = pgTable("fantasy_rosters", {
  id: serial("id").primaryKey(),
  fantasyTeamId: integer("fantasy_team_id").references(() => fantasyTeams.id),
  playerId: integer("player_id").references(() => players.id),
  position: varchar("position").notNull(), // starter, bench, IR
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Weekly matchups
export const matchups = pgTable("matchups", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id").references(() => leagues.id),
  week: integer("week").notNull(),
  season: varchar("season").notNull(),
  team1Id: integer("team1_id").references(() => fantasyTeams.id),
  team2Id: integer("team2_id").references(() => fantasyTeams.id),
  team1Score: decimal("team1_score", { precision: 8, scale: 2 }).default("0"),
  team2Score: decimal("team2_score", { precision: 8, scale: 2 }).default("0"),
  winnerId: integer("winner_id").references(() => fantasyTeams.id),
  isComplete: boolean("is_complete").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  leagues: many(leagues),
  fantasyTeams: many(fantasyTeams),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  players: many(players),
}));

export const playersRelations = relations(players, ({ one, many }) => ({
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.id],
  }),
  stats: many(playerStats),
  fantasyRosters: many(fantasyRosters),
}));

export const playerStatsRelations = relations(playerStats, ({ one }) => ({
  player: one(players, {
    fields: [playerStats.playerId],
    references: [players.id],
  }),
}));

export const leaguesRelations = relations(leagues, ({ one, many }) => ({
  owner: one(users, {
    fields: [leagues.ownerId],
    references: [users.id],
  }),
  fantasyTeams: many(fantasyTeams),
  matchups: many(matchups),
}));

export const fantasyTeamsRelations = relations(fantasyTeams, ({ one, many }) => ({
  league: one(leagues, {
    fields: [fantasyTeams.leagueId],
    references: [leagues.id],
  }),
  user: one(users, {
    fields: [fantasyTeams.userId],
    references: [users.id],
  }),
  roster: many(fantasyRosters),
  team1Matchups: many(matchups, {
    relationName: "team1Matchups",
  }),
  team2Matchups: many(matchups, {
    relationName: "team2Matchups",
  }),
}));

export const fantasyRostersRelations = relations(fantasyRosters, ({ one }) => ({
  fantasyTeam: one(fantasyTeams, {
    fields: [fantasyRosters.fantasyTeamId],
    references: [fantasyTeams.id],
  }),
  player: one(players, {
    fields: [fantasyRosters.playerId],
    references: [players.id],
  }),
}));

export const matchupsRelations = relations(matchups, ({ one }) => ({
  league: one(leagues, {
    fields: [matchups.leagueId],
    references: [leagues.id],
  }),
  team1: one(fantasyTeams, {
    fields: [matchups.team1Id],
    references: [fantasyTeams.id],
    relationName: "team1Matchups",
  }),
  team2: one(fantasyTeams, {
    fields: [matchups.team2Id],
    references: [fantasyTeams.id],
    relationName: "team2Matchups",
  }),
  winner: one(fantasyTeams, {
    fields: [matchups.winnerId],
    references: [fantasyTeams.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
});

export const insertPlayerStatsSchema = createInsertSchema(playerStats).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeagueSchema = createInsertSchema(leagues).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFantasyTeamSchema = createInsertSchema(fantasyTeams).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFantasyRosterSchema = createInsertSchema(fantasyRosters).omit({
  id: true,
  createdAt: true,
});

export const insertMatchupSchema = createInsertSchema(matchups).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type Player = typeof players.$inferSelect;
export type PlayerStats = typeof playerStats.$inferSelect;
export type League = typeof leagues.$inferSelect;
export type FantasyTeam = typeof fantasyTeams.$inferSelect;
export type FantasyRoster = typeof fantasyRosters.$inferSelect;
export type Matchup = typeof matchups.$inferSelect;

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type InsertPlayerStats = z.infer<typeof insertPlayerStatsSchema>;
export type InsertLeague = z.infer<typeof insertLeagueSchema>;
export type InsertFantasyTeam = z.infer<typeof insertFantasyTeamSchema>;
export type InsertFantasyRoster = z.infer<typeof insertFantasyRosterSchema>;
export type InsertMatchup = z.infer<typeof insertMatchupSchema>;
