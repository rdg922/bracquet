import {
  getTournament,
  getEventsForTournament,
  getRegistrationsWithDetails,
  getGamesWithDetails,
} from "~/server/queries";
import {
  type IRegistrationWithDetails,
  type IGameWithDetails,
} from "~/server/db/schema";
import DataTable from "../../../../components/DataTable";
import { registrationColumns } from "./registrationColumns";
import { gameColumns } from "./gameColumns";

async function getRegistrationData(
  tournamentId: number,
): Promise<IRegistrationWithDetails[]> {
  const events = await getEventsForTournament(tournamentId);
  const eventIds = events.map((event) => event.eventId);
  return await getRegistrationsWithDetails(eventIds);
}

async function getGameData(tournamentId: number): Promise<IGameWithDetails[]> {
  const events = await getEventsForTournament(tournamentId);
  const eventIds = events.map((event) => event.eventId);
  return await getGamesWithDetails(eventIds);
}

export default async function ManageTournamentPage({
  params,
}: {
  params: { tournamentId: number };
}) {
  if (!params.tournamentId) return <main>No Tournament Found</main>;

  const [registrationData, gameData] = await Promise.all([
    getRegistrationData(params.tournamentId),
    getGameData(params.tournamentId),
  ]);
  const tournament = await getTournament(params.tournamentId);

  return (
    <main>
      <h2>Manage &quot;{tournament?.name}&quot;</h2>
      <h3>Registrations</h3>
      <DataTable columns={registrationColumns} data={registrationData} />
      <h3>Games</h3>
      <DataTable columns={gameColumns} data={gameData} />
    </main>
  );
}
