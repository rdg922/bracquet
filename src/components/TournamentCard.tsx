"use client";

import React from "react";
import { type ITournament } from "~/server/db/schema";
import { Button } from "./ui/button";

export default function TournamentCard({
  tournament,
}: {
  tournament: ITournament;
}) {
  const handleDelete = async () => {
    try {
      // Call the server function through an API route
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
        const data = await response.json();
        console.error("Error deleting tournament:", data.message);
      }
    } catch (error) {
      console.error("Error deleting tournament:", error);
    }
  };

  return (
    <div>
      <div>{tournament.tournamentId}</div>
      <h1>{tournament.name}</h1>
      <Button onClick={handleDelete}>Delete!</Button>
    </div>
  );
}
