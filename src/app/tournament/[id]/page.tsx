import { getTournament, getEvents, deleteEvent } from "~/server/queries";
import { notFound } from "next/navigation";
import EventCard from "~/components/eventCard";
import { type IEvent } from "~/server/db/schema";

export default async function TournamentPage({
  params,
}: {
  params: { id: string };
}) {
  const tournamentId = parseInt(params.id);
  const tournament = await getTournament(tournamentId);
  const events: IEvent[] = await getEvents(tournamentId);

  if (!tournament) {
    return notFound();
  }

  return (
    <main>
      <h1 className="scroll-m-20 text-4xl">{tournament.name}</h1>
      <p>
        Start Time:
        {new Date(tournament.startTime ?? Date.now()).toLocaleString()}
      </p>
      <p>Venue: {tournament.venue}</p>
      <h2>Events</h2>
      <ul>
        {events.map((event: IEvent) => (
          <EventCard key={event.eventId} event={event} />
        ))}
      </ul>
    </main>
  );
}
