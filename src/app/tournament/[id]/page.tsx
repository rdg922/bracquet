import { getTournament, getEvents } from "~/server/queries";
import { notFound } from "next/navigation";

export default async function TournamentPage({
  params,
}: {
  params: { id: string };
}) {
  const tournamentId = parseInt(params.id);
  const tournament = await getTournament(tournamentId);
  const events = await getEvents(tournamentId);

  console.log(events);

  if (!tournament) {
    return notFound();
  }

  return (
    <main>
      <h1>{tournament.name}</h1>
      <p>
        Start Time:
        {new Date(tournament.startTime ?? Date.now()).toLocaleString()}
      </p>
      <p>Venue: {tournament.venue}</p>
      <h2>Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.eventId}>
            <h3>{event.name}</h3>
            <p>Type: {event.eventType}</p>
            <p>Division: {event.division}</p>
            <p>Bracket Type: {event.bracketType}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
