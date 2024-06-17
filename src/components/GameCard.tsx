import { getUser } from "~/server/queries";
import { Card, CardTitle, CardContent, CardHeader } from "./ui/card";
import { type IGame } from "~/server/db/schema";

interface GameData {
  player1: { playerType: string; playerId: string | number };
  player2: { playerType: string; playerId: string | number };
  winnerOfMatch: string | null;
}

export default async function GameCard({ game }: { game: IGame }) {
  const data = JSON.parse(game.data) as GameData;

  async function getPlayerName(player: {
    playerType: string;
    playerId: string | number;
  }): Promise<string> {
    if (player?.playerType === "user") {
      const user = await getUser(player.playerId as string);
      return user?.name ? user.name : "Unknown User";
    } else if (player?.playerType === "winner") {
      return `Winner of match ${player.playerId}`;
    } else {
      return "Bye";
    }
  }

  const player1Name = await getPlayerName(data.player1);
  const player2Name = await getPlayerName(data.player2);

  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle>Game ID: {game.gameId}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Bracket Position: {game.bracketPosition}</p>
        <p>Status: {game.status}</p>
        <p>Player 1: {player1Name}</p>
        <p>Player 2: {player2Name}</p>
        <p>{!!game.startTime ?? "No start time assigned yet"}</p>
        <p>{data.winnerOfMatch ?? "No winner yet"}</p>
      </CardContent>
    </Card>
  );
}
