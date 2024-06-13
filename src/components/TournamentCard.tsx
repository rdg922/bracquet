"use client";
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

export default function TournamentCard({
  tournament,
  isOrganizer = false,
}: {
  tournament: ITournament;
  isOrganizer: boolean;
}) {
  const handleDelete = async () => {
    try {
      const response = await fetch("/api/deleteTournament", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tournamentId: tournament.tournamentId }),
      });

      if (response.ok) {
        console.log("Tournament deleted successfully");
      } else {
        const data = (await response.json()) as { message: string };
        console.error("Error deleting tournament:", data.message);
      }
    } catch (error) {
      console.error("Error deleting tournament:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{tournament.name}</CardTitle>
          <CardDescription>
            Organizer ID: {tournament.organizerId}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p>Start Time: {tournament.startTime?.toISOString()}</p>
        <p>Venue: {tournament.venue}</p>
      </CardContent>
      {isOrganizer && (
        <CardFooter>
          <Button onClick={handleDelete} variant="destructive">
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
