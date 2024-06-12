import { type NextRequest, NextResponse } from "next/server";
import { deleteTournament } from "~/server/queries";

interface deleteTournamentRequestBody {
  tournamentId: number;
}

export async function POST(request: NextRequest) {
  try {
    const { tournamentId } =
      (await request.json()) as deleteTournamentRequestBody;

    await deleteTournament(tournamentId);

    return NextResponse.json(
      { message: deleteTournament(tournamentId) },
      { status: 200 },
    );
  } catch (error) {
    console.log("Failed to delete tournament: ", error);
    return NextResponse.json(
      { message: "Failed to delete tournament" },
      { status: 500 },
    );
  }
}
