import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type IEvent } from "~/server/db/schema";
import { Button } from "~/components/ui/button";
import {
  deleteEvent,
  isMeRegisteredForEvent,
  registerMeForEvent,
} from "~/server/queries";

export default function EventCard({ event }: { event: IEvent }) {
  async function deleteEventAction() {
    "use server";
    if (!event.eventId) {
      throw new Error("Event ID is required to delete an event");
    }
    await deleteEvent(event.eventId);
  }

  async function registerEventAction() {
    "use server";
    if (!event.eventId) {
      throw new Error("Event ID is required to register for an event");
    }
    await registerMeForEvent(event.eventId);
  }

  async function RegisterButton({ eventId }: { eventId: number | undefined }) {
    const isRegistered = eventId && (await isMeRegisteredForEvent(eventId));
    return !isRegistered ? (
      <form action={registerEventAction}>
        <Button>Register</Button>
      </form>
    ) : (
      <Button>
        <a href={`/tournament/${event.tournamentId}/event/${event.eventId}`}>
          Go to Event
        </a>
      </Button>
    );
  }
  return (
    <Card key={event.eventId}>
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Type: {event.eventType}</p>
        <p>Division: {event.division}</p>
        <p>Bracket Type: {event.bracketType}</p>
      </CardContent>
      <CardFooter className="flex space-x-2">
        <RegisterButton eventId={event.eventId} />
        <form action={deleteEventAction}>
          <Button variant="destructive">Delete</Button>
        </form>
      </CardFooter>
    </Card>
  );
}
