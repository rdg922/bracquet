import { getMyTournaments, getTournaments } from "~/server/queries";
import TournamentCard from "~/components/TournamentCard";
import { type ITournament } from "~/server/db/schema";
import AddTournamentForm from "~/components/AddTournament";

async function MyTournaments() {
  const tournaments = (await getMyTournaments()) as ITournament[];
  return (
    <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.tournamentId} tournament={tournament} />
      ))}
    </div>
  );
}

async function AllTournaments() {
  const tournaments = (await getTournaments()) as ITournament[];
  return (
    <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.tournamentId} tournament={tournament} />
      ))}
    </div>
  );
}

export default async function Dashboard() {
  return (
    <main>
      <h2 className="my-6">Your Tournaments</h2>
      <MyTournaments />
      <h2 className="my-6">All Tournaments</h2>
      <AllTournaments />
      <AddTournamentForm />
    </main>
  );
}
