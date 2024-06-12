import { db } from "./db";
import { tournaments, users } from "./db/schema";
import { eq } from "drizzle-orm";
import { type IUser } from "~/server/db/schema";

export async function getTournaments() {
  const tournaments = await db.query.tournaments.findMany();
  return tournaments;
}

export async function addTournament(tournament: {
  name: string;
  organizerId: string;
}) {
  const newTournament = await db
    .insert(tournaments)
    .values(tournament)
    .execute();
  return newTournament;
}

export async function deleteTournament(tournamentId: number) {
  const deletedTournament = await db
    .delete(tournaments)
    .where(eq(tournaments.tournamentId, tournamentId));
  return deletedTournament;
}

export async function isTournamentOrganizer({
  organizerId,
  tournamentId,
}: {
  organizerId: string;
  tournamentId: number;
}) {
  const tournament = await db
    .select()
    .from(tournaments)
    .where(eq(tournaments.tournamentId, tournamentId))
    .limit(1)
    .execute();

  if (tournament.length > 0 && tournament[0]?.organizerId === organizerId) {
    return true;
  }
  return false;
}

export async function isUserSetup(userId: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.userId, userId))
    .limit(1)
    .execute();
  return user.length > 0;
}

export async function setupUser({ userId, name, email, phoneNumber }: IUser) {
  return await db
    .insert(users)
    .values({ userId, name, email, phoneNumber })
    .execute();
}
