import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { tournaments, users, events } from "./db/schema";
import { and, eq, not } from "drizzle-orm";
import { type IUser, type IEvent, type ITournament } from "~/server/db/schema";

export async function getTournaments() {
  const tournaments = await db.query.tournaments.findMany();
  return tournaments;
}

export async function getOthersTournaments() {
  const user = auth();
  const userId = user.userId ?? "";

  const otherTournaments = await db.query.tournaments.findMany({
    where: not(eq(tournaments.organizerId, userId)),
  });
  return otherTournaments;
}

export async function getEvents(tournamentId: number): Promise<IEvent[]> {
  const eventsList = await db.query.events.findMany({
    where: eq(events.tournamentId, tournamentId),
  });
  return eventsList;
}

export async function getTournament(tournamentId: number) {
  const tournament = await db.query.tournaments.findFirst({
    where: eq(tournaments.tournamentId, tournamentId),
  });
  return tournament;
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
    .returning({ tournamentId: tournaments.tournamentId });
  return newTournament;
}

export async function addEvent(event: IEvent) {
  const newEvent = await db.insert(events).values(event).execute();
  return newEvent;
}

export async function deleteEvent(eventId: number) {
  const user = auth();
  const userId = user.userId;
  if (!userId) throw new Error("not authorized");
  // Delete the event where the eventId and userId match
  const deletedEvent = await db
    .delete(events)
    .where(and(eq(events.eventId, eventId)))
    .execute();
  return deletedEvent;
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
