"use client";

export default function TournamentCard({ tournament }) {
  return (
    <div>
      <div>{tournament.id}</div>
      <h1>{tournament.name}</h1>
      <button
        onClick={() => {
          fetch("/api/deleteTournament", {
            method: "POST",
            body: JSON.stringify({ id: tournament.id }),
          });
        }}
      >
        Delete
      </button>
    </div>
  );
}
