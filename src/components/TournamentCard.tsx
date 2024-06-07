"use client";

import { Button } from "~/components/ui/button";
import { type ITournament } from "~/server/db/schema";

export default function TournamentCard({
  tournament,
}: {
  tournament: ITournament;
}) {
  return (
    <div>
      <div>{tournament.tournamentId}</div>
      <h1>{tournament.name}</h1>
      <Button
        onClick={async () => {
          await fetch("/api/deleteTournament", {
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
