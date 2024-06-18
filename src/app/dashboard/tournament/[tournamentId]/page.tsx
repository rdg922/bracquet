import { getTournament } from "~/server/queries";
import { type IRegistration } from "~/server/db/schema";
import DataTable from "./DataTable";
import { type ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<IRegistration>[] = [
  {
    accessorKey: "registrationId",
    header: "ID",
  },
  {
    accessorKey: "userId",
    header: "User ID",
  },
  {
    accessorKey: "eventId",
    header: "Event ID",
  },
];

async function getData(): Promise<IRegistration[]> {
  // Fetch data from your API here.
  return [
    {
      registrationId: 72852,
      userId: "1",
      eventId: 1,
    },
    {
      registrationId: 72852,
      userId: "2",
      eventId: 2,
    },
  ];
}

export default async function manageTournamentPage({
  params,
}: {
  params: { tournamentId: number };
}) {
  const data = await getData();

  if (!params.tournamentId) return <main>No Tournament Found</main>;
  const tournament = await getTournament(params.tournamentId);
  return (
    <main>
      <h2>Manage &quot;{tournament?.name}&quot;</h2>
      <DataTable columns={columns} data={data} />
    </main>
  );
}
