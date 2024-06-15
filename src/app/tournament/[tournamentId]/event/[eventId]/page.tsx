import { revalidatePath } from "next/cache";
import { type NextRequest } from "next/server";
import { Button } from "~/components/ui/button";
import { type IGame, type IRegistration } from "~/server/db/schema";
import {
  deleteBracket,
  getGames,
  getRegistrations,
  addGame,
} from "~/server/queries";
import { Card, CardTitle, CardContent } from "~/components/ui/card";
import { db } from "~/server/db";

interface GameCardProps {
  game: {
    gameId: number;
    bracketPosition: number;
    status: string;
    data: string;
  };
}

interface GameData {
  player1?: string;
  player2?: string;
  winnerOfMatch?: string;
}

const GameCard = async ({ game }: { game: IGame }) => {
  const data = JSON.parse(game.data) as GameData;

  const player1 = data.player1 ? data.player1 : "Bye";
  const player2 =
    data.player2 === null
      ? "Winner of previous match"
      : data.player2
        ? data.player2
        : "Bye";

  return (
    <Card>
      <CardContent>
        <CardTitle>Game ID: {game.gameId}</CardTitle>
        <p>Bracket Position: {game.bracketPosition}</p>
        <p>Status: {game.status}</p>
        <p>Player 1: {player1}</p>
        <p>Player 2: {player2}</p>
      </CardContent>
    </Card>
  );
};

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
      <>
        <h2>Registered</h2>
        {registrations.map((registration) => (
          <div key={registration.registrationId}>
            <p>{registration.userId}</p>
          </div>
        ))}
      </>
    );
  }

  async function GenerateBracketsAction() {
    "use server";
    const eventId = params.eventId;
    const registrations = (await getRegistrations(eventId)) as IRegistration[];
    const matchIds: Record<number, number[]> = {}; // Track match IDs for each round

    // Start a database transaction
    await db.transaction(async (trx) => {
      // Generate the initial matches for single elimination bracket
      let bracketPosition = 1;
      let round = registrations.map((reg) => reg.userId);

      while (round.length > 1) {
        const nextRound: string[] = [];
        matchIds[bracketPosition] = [];

        for (let i = 0; i < round.length; i += 2) {
          const match = round.slice(i, i + 2);
          const game: IGame = {
            eventId,
            bracketPosition,
            status: "not started",
            data: JSON.stringify({
              player1: match[0],
              player2: match.length === 2 ? match[1] : null,
              winnerOfMatch: null,
            }),
          };

          const createdGame = (await addGame(game, trx))[0];
          if (!createdGame) throw new Error("No game found");
          matchIds[bracketPosition]?.push(createdGame.gameId);

          if (match.length === 2) {
            nextRound.push(createdGame.gameId.toString());
          } else {
            if (!match[0]) throw new Error("No player found");
            nextRound.push(match[0]); // If odd number of participants, the last one gets a bye
          }
        }

        round = nextRound;
        bracketPosition++;
      }

      if (round.length === 1) {
        // Handle the final game if there's only one participant left
        const finalGame: IGame = {
          eventId,
          bracketPosition,
          status: "not started",
          data: JSON.stringify({
            player1: round[0],
            player2: null,
            winnerOfMatch: null,
          }),
        };

        await addGame(finalGame, trx);
      }
    });

    // Optionally, revalidate the path to refresh the data on the client side
    revalidatePath(`/tournament/${params.tournamentId}/event/${eventId}`);
  }

  async function DeleteBracketsAction() {
    "use server";
    const eventId = params.eventId;
    await deleteBracket(eventId);

    // Optionally, revalidate the path to refresh the data on the client side
    revalidatePath(`/tournament/${params.tournamentId}/event/${eventId}`);
  }

  async function Games() {
    const games: IGame[] = await getGames(params.eventId);

    const gamesByPosition = games.reduce(
      (acc, game) => {
        if (!game.bracketPosition) throw new Error("No bracket position");

        if (!acc[game.bracketPosition]) {
          acc[game.bracketPosition] = [];
        }
        acc[game.bracketPosition]?.push(game);
        return acc;
      },
      {} as Record<number, IGame[]>,
    );

    return (
      <>
        {Object.keys(gamesByPosition).map((position: string) => (
          <div key={position}>
            <h3>Bracket Position {position}</h3>
            {gamesByPosition[parseInt(position)]?.map((game: IGame) => (
              <GameCard key={game.gameId} game={game} />
            ))}
          </div>
        ))}
      </>
    );
  }

  return (
    <main>
      <Registrations />
      <div className="flex space-x-2">
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
