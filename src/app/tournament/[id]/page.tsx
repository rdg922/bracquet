import { getTournament, getEvents } from "~/server/queries";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

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
      <h1 className="scroll-m-20 text-4xl">{tournament.name}</h1>
      <p>
        Start Time:
        {new Date(tournament.startTime ?? Date.now()).toLocaleString()}
      </p>
      <p>Venue: {tournament.venue}</p>
      <h2>Events</h2>
      <ul>
        {events.map((event) => (
          <Card key={event.eventId}>
            <CardHeader>
              <CardTitle>{event.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Type: {event.eventType}</p>
              <p>Division: {event.division}</p>
              <p>Bracket Type: {event.bracketType}</p>
            </CardContent>
            <CardFooter>
              <Button>Register</Button>
            </CardFooter>
          </Card>
        ))}
      </ul>
    </main>
  );
}
