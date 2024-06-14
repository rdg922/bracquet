import { type IEvent } from "~/server/db/schema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { deleteEvent } from "~/server/queries";

export default function EventCard({ event }: { event: IEvent }) {
  async function deleteEventAction() {
    "use server";
    if (!event.eventId) {
      throw new Error("Event ID is required to delete an event");
    }
    await deleteEvent(event.eventId);
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
      <CardFooter>
        <Button>Register</Button>
        <form action={deleteEventAction}>
          <Button variant="destructive">Delete</Button>
        </form>
      </CardFooter>
    </Card>
  );
}
