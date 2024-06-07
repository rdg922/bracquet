import { db } from "./db";
import { tournaments } from "./db/schema";
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
