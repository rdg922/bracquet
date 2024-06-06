import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { tournaments, type ITournament } from "./db/schema";
import { eq } from "drizzle-orm";

export async function getTournaments() {
  const tournaments = await db.query.tournaments.findMany();
  return tournaments;
}

export async function addTournament(tournament: ITournament) {
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
    .where(eq(tournaments.id, id));
  return deletedTournament;
}
