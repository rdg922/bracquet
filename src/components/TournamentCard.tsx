"use client";

import { Button } from "~/components/ui/button";

export default function TournamentCard({ tournament }) {
  return (
    <div>
      <div>{tournament.id}</div>
      <h1>{tournament.name}</h1>
      <Button
        onClick={() => {
          fetch("/api/deleteTournament", {
            method: "POST",
            body: JSON.stringify({ id: tournament.tournamentId }),
          });
        }}
      >
        Delete
      </Button>
    </div>
  );
}
