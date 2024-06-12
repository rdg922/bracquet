import { getMyTournaments } from "~/server/queries";
import TournamentCard from "~/components/TournamentCard";
import { type ITournament } from "~/server/db/schema";
import AddTournamentForm from "~/components/AddTournament";

async function Tournaments() {
  const tournaments = (await getMyTournaments()) as ITournament[];
  return (
    <div>
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.tournamentId} tournament={tournament} />
      ))}
    </div>
  );
}
export default async function Dashboard() {
  return (
    <div className="bg-blue-200">
      <Tournaments />
      <AddTournamentForm />
    </div>
  );
}
