import { BluetoothConnected } from "lucide-react";
import { revalidatePath } from "next/cache";
import { type NextRequest } from "next/server";
import { Button } from "~/components/ui/button";
import { type IGame, type IRegistration } from "~/server/db/schema";
import {
  addGames,
  deleteBracket,
  getGames,
  getRegistrations,
} from "~/server/queries";

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
    const games: IGame[] = [];

    // add all registrations to the game in a single elimination with a bracketPosition of 0
    for (let i = 0; i < Math.ceil(registrations.length / 2); i += 1) {
      games.push({
        eventId,
        bracketPosition: 0,
        status: "not started",
      });
    }

    await addGames(games);
  }

  async function DeleteBracketsAction() {
    "use server";
    const eventId = params.eventId;
    void deleteBracket(eventId);
  }

  async function Games() {
    const games: IGame[] = await getGames(params.eventId);
    return games.map((game) => (
      <div key={game.gameId}>
        <p>{game.bracketPosition}</p>
        <p>{game.status}</p>
      </div>
    ));
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
