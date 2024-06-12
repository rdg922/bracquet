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
}: {
  tournament: ITournament;
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
          <CardTitle className="text-xl font-bold text-gray-800">
            {tournament.name}
          </CardTitle>
          <CardDescription className="text-gray-500">
            Organizer ID: {tournament.organizerId}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p>ID: {tournament.tournamentId}</p>
        <p>Start Time: </p>
        <p>Venue: {tournament.venue}</p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleDelete}
          className="bg-red-500 text-white hover:bg-red-600"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
