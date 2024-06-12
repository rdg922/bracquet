import { getMyTournaments } from "~/server/queries";
import TournamentCard from "~/components/TournamentCard";
import { type ITournament } from "~/server/db/schema";
import AddTournamentForm from "~/components/AddTournament";

async function Tournaments() {
  const tournaments = (await getMyTournaments()) as ITournament[];
  return (
    <div className="grid grid-cols-3 gap-8">
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.tournamentId} tournament={tournament} />
      ))}
    </div>
  );
}
export default async function Dashboard() {
  return (
    <main>
      <Tournaments />
      <AddTournamentForm />
    </main>
  );
}
