import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { tournaments, users } from "./db/schema";
import { and, eq } from "drizzle-orm";
import { type IUser, type ITournament } from "~/server/db/schema";

export async function getTournaments() {
  const tournaments = await db.query.tournaments.findMany();
  return tournaments;
}

export async function getMyTournaments() {
  const user = auth();
  const userId = user.userId;

  if (!userId) {
    throw new Error("not authorized");
  }

  const myTournaments = await db.query.tournaments.findMany({
    where: eq(tournaments.organizerId, userId),
  });
  return myTournaments;
}

export async function addTournament(tournament: ITournament) {
  const newTournament = await db
    .insert(tournaments)
    .values(tournament)
    .execute();
  return newTournament;
}

export async function deleteTournament(tournamentId: number) {
  const user = auth();
  const userId = user.userId;

  if (!userId) throw new Error("not authorized");

  // Delete the tournament where the tournamentId and organizerId match
  const deletedTournament = await db
    .delete(tournaments)
    .where(
      and(
        eq(tournaments.tournamentId, tournamentId),
        eq(tournaments.organizerId, userId),
      ),
    )
    .execute();

  // TODO: Check if any rows were affected (i.e., the tournament was deleted)

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
