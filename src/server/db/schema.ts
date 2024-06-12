import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `bracquet_${name}`);
export const divisionTypeEnum = pgEnum("division", [
  "novice",
  "intermediate",
  "open",
]);

export const eventTypeEnum = pgEnum("event_type", [
  "m_single",
  "w_single",
  "m_double",
  "w_double",
  "x_double",
]);

export const bracketTypeEnum = pgEnum("bracket_type", [
  "single_elim",
  "double_elim",
  "single_consol",
  "round_robin",
  "custom",
]);

export const gameStatusEnum = pgEnum("game_status", [
  "not started",
  "in progress",
  "finished",
]);

export const users = createTable(
  "users",
  {
    userId: serial("user_id").primaryKey(),
    authId: varchar("auth_id", { length: 255 }).notNull().unique(),
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

export interface IUser {
  userId?: number; // Serial type for user_id
  phoneNumber?: string; // Serial type for phone number
  authId: string; // Auth ID, must be unique
  name?: string; // Name, optional
  email?: string; // Email, optional
  schoolId?: number; // School ID, optional
}

export const schools = createTable("schools", {
  schoolId: serial("school_id").primaryKey(),
  schoolName: varchar("school_name", { length: 255 }).notNull().unique(),
});

export const tournaments = createTable(
  "tournaments",
  {
    tournamentId: serial("tournament_id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    startTime: timestamp("start_time", { withTimezone: true }),
    venue: varchar("venue", { length: 255 }),
    organizerId: integer("organizer_id").references(() => users.userId),
  },
  (tournaments) => {
    return {
      startTimeIndex: index("tournaments_start_time_idx").on(
        tournaments.startTime,
      ),
    };
  },
);

export interface ITournament {
  tournamentId: number;
  name: string;
  startTime?: Date;
  venue?: string;
  organizerId?: number;
}

export const events = createTable(
  "events",
  {
    eventId: serial("event_id").primaryKey(),
    tournamentId: integer("tournament_id").references(
      () => tournaments.tournamentId,
    ),
    name: varchar("name", { length: 256 }).notNull(),
    type: eventTypeEnum("event_type"),
    division: divisionTypeEnum("division"),
    bracketType: bracketTypeEnum("bracket_type"),
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
    status: gameStatusEnum("status"),
    score: varchar("score", { length: 1024 }), // Using varchar to store JSON as text
  },
  (games) => {
    return {
      eventIdIndex: index("games_event_id_idx").on(games.eventId),
      startTimeIndex: index("games_start_time_idx").on(games.startTime),
    };
  },
);

export const participants = createTable(
  "participants",
  {
    participantId: serial("participant_id").primaryKey(),
    userId: integer("user_id").references(() => users.userId),
    gameId: integer("game_id").references(() => games.gameId),
  },
  (participants) => {
    return {
      userIdIndex: index("participants_user_id_idx").on(participants.userId),
      gameIdIndex: index("participants_game_id_idx").on(participants.gameId),
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
    userId: integer("user_id").references(() => users.userId),
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
    fromUserId: integer("from_user_id").references(() => users.userId),
    toUserId: integer("to_user_id").references(() => users.userId),
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
    userId: integer("user_id").references(() => users.userId),
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
