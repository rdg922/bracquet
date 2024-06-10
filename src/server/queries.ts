import { db } from "./db";
import { tournaments, users } from "./db/schema";
import { eq } from "drizzle-orm";

export async function getTournaments() {
  const tournaments = await db.query.tournaments.findMany();
  return tournaments;
}

export async function addTournament(tournament: { name: string }) {
  const newTournament = await db
    .insert(tournaments)
    .values(tournament)
    .execute();
  return newTournament;
}

export async function deleteTournament(id: number) {
  console.log(id);
  const deletedTournament = await db
    .delete(tournaments)
    .where(eq(tournaments.tournamentId, id));
  return deletedTournament;
}

export async function isUserOrganizer(userId: number, tournamentId: number) {
  const tournament = await db
    .select()
    .from(tournaments)
    .where(eq(tournaments.tournamentId, tournamentId))
    .limit(1)
    .execute();

  if (tournament.length > 0 && tournament[0]?.organizerId === userId) {
    return true;
  }
  return false;
}

export async function isUserSetup(authId: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.authId, authId))
    .limit(1)
    .execute();
  return user.length > 0;
}

export async function setupUser({
  authId,
  name,
  email,
}: {
  authId: string;
  name: string;
  email: string;
}) {
  return await db.insert(users).values({ authId, name, email }).execute();
}
