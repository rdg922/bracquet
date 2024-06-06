// pages/index.tsx
import { getTournaments } from "~/server/queries";
import AddTournamentForm from "~/components/AddTournament";
import TournamentCard from "~/components/TournamentCard";

export const dynamic = "force-dynamic";

async function Tournaments() {
  const tournaments = await getTournaments();
  return (
    <div>
      {tournaments.map((tournament) => (
        <TournamentCard tournament={tournament} />
      ))}
    </div>
  );
}

export default async function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-3xl font-bold">Tournament List</h1>
        <Tournaments />
      </div>
      <AddTournamentForm />
    </main>
  );
}
