import { getMyTournaments, getOthersTournaments } from "~/server/queries";
import TournamentCard from "~/components/TournamentCard";
import { type ITournament } from "~/server/db/schema";
import AddTournamentForm from "~/components/AddTournamentForm/AddTournamentForm";

async function MyTournaments() {
  const tournaments = (await getMyTournaments()) as ITournament[];
  return (
    <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
      {tournaments.map((tournament) => (
        <TournamentCard
          key={tournament.tournamentId}
          tournament={tournament}
          isOrganizer
        />
      ))}
    </div>
  );
}

async function AllTournaments() {
  const tournaments = (await getOthersTournaments()) as ITournament[];
  return (
    <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
      {tournaments.map((tournament) => (
        <TournamentCard
          key={tournament.tournamentId}
          tournament={tournament}
          isOrganizer={false}
        />
      ))}
    </div>
  );
}

export default async function Dashboard() {
  return (
    <main>
      <h2 className="my-6">Your Tournaments</h2>
      <MyTournaments />
      <h2 className="my-6">Other Tournaments</h2>
      <AllTournaments />
      <AddTournamentForm />
    </main>
  );
}
