import {
  getTournament,
  getEventsForTournament,
  getRegistrationsWithDetails,
} from "~/server/queries";
import { type IRegistrationWithDetails } from "~/server/db/schema";
import DataTable from "../../../../components/DataTable";
import { type ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<IRegistrationWithDetails>[] = [
  {
    accessorKey: "registrationId",
    header: "ID",
  },
  {
    accessorKey: "userId",
    header: "User ID",
  },
  {
    accessorKey: "userName",
    header: "User Name",
  },
  {
    accessorKey: "eventId",
    header: "Event ID",
  },
  {
    accessorKey: "eventName",
    header: "Event Name",
  },
  {
    accessorKey: "eventType",
    header: "Event Type",
  },
  {
    accessorKey: "bracketType",
    header: "Bracket Type",
  },
];

async function getData(
  tournamentId: number,
): Promise<IRegistrationWithDetails[]> {
  // Step 1: Get all events for the tournament
  const events = await getEventsForTournament(tournamentId);
  const eventIds = events.map((event) => event.eventId);

  // Step 2: Get all registrations with details for the retrieved event IDs
  const registrations = await getRegistrationsWithDetails(eventIds);
  console.log(registrations);

  return registrations;
}

export default async function manageTournamentPage({
  params,
}: {
  params: { tournamentId: number };
}) {
  if (!params.tournamentId) return <main>No Tournament Found</main>;

  const data = await getData(params.tournamentId);
  const tournament = await getTournament(params.tournamentId);

  return (
    <main>
      <h2>Manage &quot;{tournament?.name}&quot;</h2>
      <DataTable columns={columns} data={data} />
    </main>
  );
}
