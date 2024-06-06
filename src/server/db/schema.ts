// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  primaryKey,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `bracquet_${name}`);

export const tournaments = createTable(
  "tournament",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (tournament) => {
    return {
      nameIndex: index("name_idx").on(tournament.name),
    };
  },
);

export interface ITournament {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const admins = createTable("admin", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const tournamentAdmins = createTable(
  "tournament_admin",
  {
    tournamentId: serial("tournament_id")
      .references(() => tournaments.id)
      .notNull(),
    adminId: serial("admin_id")
      .references(() => admins.id)
      .notNull(),
  },
  (tournamentAdmin) => {
    return {
      pk: primaryKey(tournamentAdmin.tournamentId, tournamentAdmin.adminId),
    };
  },
);
