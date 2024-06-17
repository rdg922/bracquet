import { type IGame } from "~/server/db/schema";
import { getGame, getUser } from "~/server/queries";

interface gameData {
  player1: { playerType: string; playerId: string };
  player2: { playerType: string; playerId: string };
  winnerOfMatch: string | null;
}

export default async function GamePage({
  params,
}: {
  params: { tournamentId: number; eventId: number; gameId: number };
}) {
  const game: IGame | undefined = await getGame(params.gameId);

  if (!game?.data) return <main>No Game Data Found</main>;

  const data = JSON.parse(game.data) as gameData;
  const player1 = data.player1;
  const player1User = await getUser(player1.playerId);
  if (!player1User) throw new Error("Game not found");

  const player2 = data.player2;
  const player2User = await getUser(player2.playerId);
  if (!player2User) throw new Error("Game not found");

  return (
    <main>
      <h2>
        Game: {player1User.name} vs. {player2User.name}
      </h2>
      <p>Status: {game?.status}</p>
      <p>
        Start Time:{" "}
        {game?.startTime?.toString() ?? "No start time assigned yet"}
      </p>
    </main>
  );
}
