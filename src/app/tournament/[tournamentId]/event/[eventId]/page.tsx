import { revalidatePath } from "next/cache";
import { Button } from "~/components/ui/button";
import { type IGame, type IRegistration } from "~/server/db/schema";
import {
  deleteBracket,
  getGames,
  getRegistrations,
  addGame,
  getUser,
} from "~/server/queries";
import { db } from "~/server/db";
import GameCard from "~/components/GameCard"; // Adjust the import path as needed

export default function TournamentPage({
  params,
}: {
  params: { tournamentId: number; eventId: number };
}) {
  async function Registrations() {
    const registrations: IRegistration[] = await getRegistrations(
      params.eventId,
    );

    return (
      <div className="py-2">
        <h2>Registered</h2>
        {registrations.map(async (registration) => {
          if (!registration.userId) return null;
          const name = (await getUser(registration.userId))?.name;
          return (
            <div key={registration.registrationId}>
              <p>{name}</p>
            </div>
          );
        })}
      </div>
    );
  }

  async function GenerateBracketsAction() {
    "use server";
    const eventId = params.eventId;
    const registrations = (await getRegistrations(eventId)) as IRegistration[];
    const matchIds: Record<number, number[]> = {}; // Track match IDs for each round

    await db.transaction(async (trx) => {
      let bracketPosition = 1;
      let round = registrations.map((reg) => ({
        playerType: "user",
        playerId: reg.userId,
      }));
      let byePosition = null;

      while (round.length > 1) {
        const nextRound: {
          playerType: string;
          playerId: string | null | undefined;
        }[] = [];
        matchIds[bracketPosition] = [];

        for (let i = 0; i < round.length; i += 2) {
          const match: {
            playerType: string;
            playerId: string | null | undefined;
          }[] = round.slice(i, i + 2);
          let gameData: IGame;

          if (match.length === 2) {
            gameData = {
              eventId,
              bracketPosition,
              status: "not started",
              data: JSON.stringify({
                player1: match[0],
                player2: match[1],
                winnerOfMatch: null,
              }),
            };

            const [createdGame]: IGame[] = await addGame(gameData, trx);
            if (!createdGame?.gameId) throw new Error("Game creation failed");

            matchIds[bracketPosition]?.push(createdGame.gameId);
            nextRound.push({
              playerType: "winner",
              playerId: createdGame.gameId.toString(),
            });
          } else {
            if (byePosition === null) {
              byePosition = bracketPosition;
            }
            if (!match[0]) throw new Error("Match length is 0");
            nextRound.push(match[0]);
          }
        }

        round = nextRound;
        bracketPosition++;
      }
    });

    revalidatePath(`/tournament/${params.tournamentId}/event/${eventId}`);
  }

  async function DeleteBracketsAction() {
    "use server";
    const eventId = params.eventId;
    await deleteBracket(eventId);
    revalidatePath(`/tournament/${params.tournamentId}/event/${eventId}`);
  }

  async function Games() {
    const games: IGame[] = await getGames(params.eventId);

    const gamesByPosition = games.reduce(
      (acc, game) => {
        if (game.bracketPosition == null || game.bracketPosition === undefined)
          throw new Error("Bracket position is null");
        if (!acc[game.bracketPosition]) {
          acc[game.bracketPosition] = [];
        }
        acc[game.bracketPosition]?.push(game);
        return acc;
      },
      {} as Record<number, IGame[]>,
    );

    return (
      <div className="py-2">
        {Object.keys(gamesByPosition).map((position) => (
          <div key={position}>
            {gamesByPosition[parseInt(position)]?.map((game: IGame) => (
              <a
                key={game.gameId}
                href={`/tournament/${params.tournamentId}/event/${params.eventId}/game/${game.gameId}`}
              >
                <GameCard
                  game={game}
                  link={`/tournament/${params.tournamentId}/event/${params.eventId}/game/${game.gameId}`}
                />
              </a>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <main>
      <Registrations />
      <div className="flex space-x-2 py-2">
        <form action={GenerateBracketsAction}>
          <Button>Generate Brackets</Button>
        </form>
        <form action={DeleteBracketsAction}>
          <Button variant="destructive">Delete Brackets</Button>
        </form>
      </div>
      <Games />
    </main>
  );
}
