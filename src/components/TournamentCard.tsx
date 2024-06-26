import React from "react";
import { type ITournament } from "~/server/db/schema";
import { Button } from "./ui/button";
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from "./ui/card";
import { deleteTournament, getUser } from "~/server/queries";
import { useToast } from "~/components/ui/use-toast";

export default async function TournamentCard({
  tournament,
  isOrganizer,
}: {
  tournament: ITournament;
  isOrganizer: boolean;
}) {
  const user = await getUser(tournament.organizerId!);

  const handleDelete = async () => {
    "use server";

    if (!tournament.tournamentId) {
      console.error("Tournament ID is missing");
      return;
    }

    await deleteTournament(tournament.tournamentId);
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>
            {
              <a href={`/tournament/${tournament.tournamentId}`}>
                {tournament.name}
              </a>
            }
          </CardTitle>
          <CardDescription>{tournament.tournamentId}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p>Organizer: {user?.name ?? tournament.organizerId}</p>
        <p>Start Time: {tournament.startTime?.toISOString()}</p>
        <p>Venue: {tournament.venue}</p>
      </CardContent>

      <CardFooter className="space-x-2">
        <a href={`/tournament/${tournament.tournamentId}`}>
          <Button variant="secondary">View Tournament</Button>
        </a>
        {isOrganizer && (
          <>
            <a href={`/dashboard/tournament/${tournament.tournamentId}`}>
              <Button variant="secondary">Manage</Button>
            </a>
            <form action={handleDelete}>
              <Button variant="destructive">Delete</Button>
            </form>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
