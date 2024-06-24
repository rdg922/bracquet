import { z } from "zod";
import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Define Enums using Zod
export const divisionTypeEnum = z.enum(["novice", "intermediate", "open"]);
export const eventTypeEnum = z.enum([
  "m_single",
  "w_single",
  "m_double",
  "w_double",
  "x_double",
]);
export const bracketTypeEnum = z.enum([
  "single_elim",
  "double_elim",
  "single_consol",
  "round_robin",
  "custom",
]);
export const gameStatusEnum = z.enum([
  "not started",
  "in progress",
  "finished",
]);

// Define Schemas using Zod
export const userSchema = z.object({
  userId: z.string().uuid(),
  phoneNumber: z.string().nullish(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  schoolId: z.number().nullish(),
});

export const tournamentSchema = z.object({
  tournamentId: z.number().optional(),
  name: z.string().optional(),
  startTime: z.date().optional(),
  venue: z.string().optional(),
  organizerId: z.string().uuid().optional(),
});

export const eventSchema = z.object({
  eventId: z.number().optional(),
  tournamentId: z.number().nullish(),
  name: z.string().nullish(),
  eventType: eventTypeEnum,
  division: divisionTypeEnum,
  bracketType: bracketTypeEnum,
});

export const registrationSchema = z.object({
  registrationId: z.number().nullish(),
  userId: z.string().uuid().nullish(),
  eventId: z.number().nullish(),
});

export const gameSchema = z.object({
  gameId: z.number().optional(),
  eventId: z.number().nullish(),
  bracketPosition: z.number().nullish(),
  startTime: z.date().nullish(),
  venue: z.string().nullish(),
  status: gameStatusEnum,
  data: z.string(),
});

// Define Types from Schemas
export type IUser = z.infer<typeof userSchema>;
export type ITournament = z.infer<typeof tournamentSchema>;
export type IEvent = z.infer<typeof eventSchema>;
export type IRegistration = z.infer<typeof registrationSchema>;
export type IGame = z.infer<typeof gameSchema>;

// TODO: make usage of these interfaces more consistent
export interface IPlayer {
  playerType: string;
  playerId: string;
}

export interface IGameData {
  player1: IPlayer;
  player2: IPlayer;
  winnerOfMatch: string | null;
}

export interface IRegistrationWithDetails extends IRegistration {
  userName?: string | null;
  eventName?: string | null;
  eventType?: string | null;
  bracketType?: string | null;
}

export interface IGameWithDetails extends IGame {
  eventName?: string | null;
  tournamentId?: number | null;
}

// Create Table Helper
export const createTable = pgTableCreator((name) => `bracquet_${name}`);

// Create Tables
export const users = createTable(
  "users",
  {
    userId: varchar("user_id", { length: 255 }).primaryKey(),
    phoneNumber: varchar("phone_number", { length: 12 }),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }),
    schoolId: integer("school_id"),
  },
  (users) => {
    return {
      userIdIndex: index("users_user_id_idx").on(users.userId),
    };
  },
);

export const registrations = createTable(
  "registrations",
  {
    registrationId: serial("registration_id").primaryKey(),
    userId: varchar("user_id", { length: 255 }).references(() => users.userId),
    eventId: integer("event_id").references(() => events.eventId),
  },
  (registration) => {
    return {
      userEventUniqueIndex: uniqueIndex(
        "registration_user_event_unique_idx",
      ).on(registration.userId, registration.eventId),
      userIdIndex: index("registration_user_id_idx").on(registration.userId),
      eventIdIndex: index("registration_event_id_idx").on(registration.eventId),
    };
  },
);

export const schools = createTable("schools", {
  schoolId: serial("school_id").primaryKey(),
  schoolName: varchar("school_name", { length: 255 }).notNull().unique(),
});

export const tournaments = createTable(
  "tournaments",
  {
    tournamentId: serial("tournament_id").primaryKey(),
    name: varchar("name", { length: 256 }),
    startTime: timestamp("start_time", { withTimezone: true }),
    venue: varchar("venue", { length: 255 }),
    organizerId: varchar("organizer_id", { length: 255 }).references(
      () => users.userId,
    ),
  },
  (tournaments) => {
    return {
      startTimeIndex: index("tournaments_start_time_idx").on(
        tournaments.startTime,
      ),
    };
  },
);

export const events = createTable(
  "events",
  {
    eventId: serial("event_id").primaryKey(),
    tournamentId: integer("tournament_id").references(
      () => tournaments.tournamentId,
    ),
    name: varchar("name", { length: 256 }),
    eventType: varchar("event_type", {
      length: 50,
      enum: eventTypeEnum.options,
    }).notNull(),
    division: varchar("division", {
      length: 50,
      enum: divisionTypeEnum.options,
    }).notNull(),
    bracketType: varchar("bracket_type", {
      length: 50,
      enum: bracketTypeEnum.options,
    }).notNull(),
  },
  (events) => {
    return {
      tournamentIdIndex: index("events_tournament_id_idx").on(
        events.tournamentId,
      ),
    };
  },
);

export const games = createTable(
  "games",
  {
    gameId: serial("game_id").primaryKey(),
    eventId: integer("event_id").references(() => events.eventId),
    bracketPosition: integer("bracket_position"),
    startTime: timestamp("start_time", { withTimezone: true }),
    venue: varchar("venue", { length: 255 }),
    status: varchar("status", {
      length: 50,
      enum: gameStatusEnum.options,
    }).notNull(), // Corrected usage
    data: varchar("data", { length: 1024 }).notNull(), // Using JSON to score score data and players to work with multiple bracket types and player counts
  },
  (games) => {
    return {
      eventIdIndex: index("games_event_id_idx").on(games.eventId),
      startTimeIndex: index("games_start_time_idx").on(games.startTime),
    };
  },
);

export const teams = createTable(
  "teams",
  {
    teamId: serial("team_id").primaryKey(),
    name: varchar("name", { length: 255 }),
    gameId: integer("game_id").references(() => games.gameId),
  },
  (teams) => {
    return {
      gameIdIndex: index("teams_game_id_idx").on(teams.gameId),
    };
  },
);

export const teamParticipants = createTable(
  "team_participants",
  {
    teamParticipantId: serial("team_participant_id").primaryKey(),
    teamId: integer("team_id").references(() => teams.teamId),
    userId: varchar("user_id", { length: 255 }).references(() => users.userId),
  },
  (teamParticipants) => {
    return {
      teamIdIndex: index("team_participants_team_id_idx").on(
        teamParticipants.teamId,
      ),
      userIdIndex: index("team_participants_user_id_idx").on(
        teamParticipants.userId,
      ),
    };
  },
);

export const partnerRequests = createTable(
  "partner_requests",
  {
    requestId: serial("request_id").primaryKey(),
    fromUserId: varchar("from_user_id", { length: 255 }).references(
      () => users.userId,
    ),
    toUserId: varchar("to_user_id", { length: 255 }).references(
      () => users.userId,
    ),
    eventId: integer("event_id").references(() => events.eventId),
    message: varchar("message", { length: 255 }),
  },
  (partnerRequests) => {
    return {
      fromUserIdIndex: index("partner_requests_from_user_id_idx").on(
        partnerRequests.fromUserId,
      ),
      toUserIdIndex: index("partner_requests_to_user_id_idx").on(
        partnerRequests.toUserId,
      ),
    };
  },
);

export const partnerSearches = createTable(
  "partner_searches",
  {
    searchId: serial("search_id").primaryKey(),
    userId: varchar("user_id", { length: 255 }).references(() => users.userId),
    eventId: integer("event_id").references(() => events.eventId),
    searchStartTime: timestamp("search_start_time", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    message: varchar("message", { length: 255 }),
  },
  (partnerSearches) => {
    return {
      userIdIndex: index("partner_searches_user_id_idx").on(
        partnerSearches.userId,
      ),
      eventIdIndex: index("partner_searches_event_id_idx").on(
        partnerSearches.eventId,
      ),
    };
  },
);
