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
import { deleteTournament } from "~/server/queries";

//const handleDelete = async () => {
//  try {
//    const response = await fetch("/api/deleteTournament", {
//      method: "POST",
//      headers: {
//        "Content-Type": "application/json",
//      },
//      body: JSON.stringify({ tournamentId: tournament.tournamentId }),
//    });
//
//    if (response.ok) {
//      console.log("Tournament deleted successfully");
//    } else {
//      const data = (await response.json()) as { message: string };
//      console.error("Error deleting tournament:", data.message);
//    }
//  } catch (error) {
//    console.error("Error deleting tournament:", error);
//  }
//};
//

export default function TournamentCard({
  tournament,
  isOrganizer,
}: {
  tournament: ITournament;
  isOrganizer: boolean;
}) {
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
        <p>Organizer: {tournament.organizerId}</p>
        <p>Start Time: {tournament.startTime?.toISOString()}</p>
        <p>Venue: {tournament.venue}</p>
      </CardContent>
      {isOrganizer && (
        <CardFooter>
          <form action={handleDelete}>
            <Button variant="destructive">Delete</Button>
          </form>
        </CardFooter>
      )}
    </Card>
  );
}
