import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import {
  tournaments,
  users,
  events,
  registrations,
  games,
  type IGameWithDetails,
  type IRegistrationWithDetails,
  type IGameData,
} from "./db/schema";
import { and, eq, inArray, not } from "drizzle-orm";
import {
  type IUser,
  type IEvent,
  type ITournament,
  type IGame,
} from "~/server/db/schema";

export async function getEventsForTournament(tournamentId: number) {
  return await db.query.events.findMany({
    where: eq(events.tournamentId, tournamentId),
  });
}
export async function getRegistrationsForEvents(eventIds: number[]) {
  return await db.query.registrations.findMany({
    where: inArray(registrations.eventId, eventIds),
  });
}

export async function getRegistrationsWithDetails(
  eventIds: number[],
): Promise<IRegistrationWithDetails[]> {
  const registrationsWithDetails = await db
    .select({
      registrationId: registrations.registrationId,
      userId: registrations.userId,
      eventId: registrations.eventId,
      userName: users.name,
      eventName: events.name,
      eventType: events.eventType,
      bracketType: events.bracketType,
    })
    .from(registrations)
    .innerJoin(users, eq(registrations.userId, users.userId))
    .innerJoin(events, eq(registrations.eventId, events.eventId))
    .where(inArray(registrations.eventId, eventIds));

  return registrationsWithDetails;
}

export async function getGamesWithDetails(
  eventIds: number[],
): Promise<IGameWithDetails[]> {
  const gamesWithDetails = await db
    .select({
      gameId: games.gameId,
      eventId: games.eventId,
      eventName: events.name,
      tournamentId: events.tournamentId,
      startTime: games.startTime,
      venue: games.venue,
      status: games.status,
      data: games.data,
    })
    .from(games)
    .innerJoin(events, eq(games.eventId, events.eventId))
    .where(inArray(games.eventId, eventIds));

  // Extract player IDs from the game data
  const playerIds = gamesWithDetails.flatMap((game) => {
    const data = JSON.parse(game.data) as IGameData;
    return [data.player1.playerId, data.player2.playerId];
  });

  // Fetch player names for the extracted player IDs
  const players = await db
    .select({
      userId: users.userId,
      name: users.name,
    })
    .from(users)
    .where(inArray(users.userId, playerIds));

  const playerMap = new Map(
    players.map((player) => [player.userId, player.name]),
  );

  // Map player names back to game details
  return gamesWithDetails.map((game) => {
    const data = JSON.parse(game.data) as IGameData;
    return {
      gameId: game.gameId,
      eventId: game.eventId,
      eventName: game.eventName,
      tournamentId: game.tournamentId,
      startTime: game.startTime,
      venue: game.venue,
      status: game.status,
      data: game.data, // Include the data field
      player1Name: playerMap.get(data.player1.playerId) ?? "Unknown",
      player2Name: playerMap.get(data.player2.playerId) ?? "Unknown",
      winnerOfMatch: data.winnerOfMatch
        ? playerMap.get(data.winnerOfMatch) ?? "Unknown"
        : "TBD",
    };
  });
}

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

export async function isMeTournamentOrganizer(tournamentId: number) {
  const user = auth();
  const userId = user.userId;
  if (!userId) {
    throw new Error("not authorized");
  }
  return isTournamentOrganizer({ organizerId: userId, tournamentId });
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
