import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { tournaments, users, events, registrations, games } from "./db/schema";
import { and, eq, not } from "drizzle-orm";
import {
  type IUser,
  type IEvent,
  type ITournament,
  type IGame,
} from "~/server/db/schema";

export async function getTournaments() {
  const tournaments = await db.query.tournaments.findMany();
  return tournaments;
}

export async function addGames(newGames: IGame[]): Promise<IGame[]> {
  return await db.insert(games).values(newGames).returning();
}

export async function getGame(gameId: number) {
  return await db.query.games.findFirst({
    where: eq(games.gameId, gameId),
  });
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

export async function getGames(eventId: number): Promise<IGame[]> {
  const gamesList = await db.query.games.findMany({
    where: eq(games.eventId, eventId),
  });
  return gamesList;
}

export async function getTournament(tournamentId: number) {
  const tournament = await db.query.tournaments.findFirst({
    where: eq(tournaments.tournamentId, tournamentId),
  });
  return tournament;
}

export async function isRegisteredForEvent(
  userId: string,
  eventId: number,
): Promise<boolean> {
  const registration = await db.query.registrations.findFirst({
    where: and(
      eq(registrations.userId, userId),
      eq(registrations.eventId, eventId),
    ),
  });
  console.log(registration, "registration");
  return !!registration;
}

export async function deleteBracket(eventId: number) {
  const user = auth();
  const userId = user.userId;
  if (!userId) throw new Error("not authorized");
  // Delete the event where the eventId and userId match
  const deletedBracket = await db
    .delete(games)
    .where(and(eq(games.eventId, eventId)))
    .execute();
  return deletedBracket;
}

export async function isMeRegisteredForEvent(eventId: number) {
  const user = auth();
  const userId = user.userId;
  if (!userId) {
    throw new Error("not authorized");
  }
  return isRegisteredForEvent(userId, eventId);
}

export async function addGame(newGame: IGame, context = db) {
  return await context.insert(games).values(newGame).returning();
}

export async function registerMeForEvent(eventId: number) {
  const user = auth();
  const userId = user.userId;
  if (!userId) {
    throw new Error("not authorized");
  }
  const newRegistration = await db
    .insert(registrations)
    .values({ userId, eventId })
    .returning();
  console.log(newRegistration);
  return newRegistration;
}

export async function getUser(userId: string): Promise<IUser | undefined> {
  return await db.query.users.findFirst({
    where: eq(users.userId, userId),
  });
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

export async function getRegistrations(eventId: number) {
  const registrationsList = await db.query.registrations.findMany({
    where: eq(registrations.eventId, eventId),
  });
  return registrationsList;
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
