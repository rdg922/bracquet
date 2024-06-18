import { getTournament, getEvents } from "~/server/queries";
import { notFound } from "next/navigation";
import EventCard from "~/components/EventCard";
import { type IEvent } from "~/server/db/schema";
import { Button } from "~/components/ui/button";
import { isMeTournamentOrganizer } from "~/server/queries";

export default async function TournamentPage({
  params,
}: {
  params: { tournamentId: string };
}) {
  const tournamentId = parseInt(params.tournamentId);
  const tournament = await getTournament(tournamentId);
  const events: IEvent[] = await getEvents(tournamentId);

  if (!tournament) {
    return notFound();
  }

  const isOrganizer = await isMeTournamentOrganizer(tournamentId);

  return (
    <main>
      <h1 className="flex scroll-m-20 justify-between text-4xl">
        {tournament.name}
        {isOrganizer && (
          <a href={`/dashboard/tournament/${tournamentId}`}>
            <Button>Manage</Button>
          </a>
        )}
      </h1>
      <p>
        Start Time:{" "}
        {new Date(tournament.startTime ?? Date.now()).toLocaleString()}
      </p>
      <p>Venue: {tournament.venue}</p>
      <h2 className="flex justify-between py-4">Events</h2>
      <ul>
        {events.map((event: IEvent) => (
          <EventCard key={event.eventId} event={event} />
        ))}
      </ul>
    </main>
  );
}
