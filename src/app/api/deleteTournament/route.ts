import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { deleteTournament } from "~/server/queries";

interface deleteTournamentRequestBody {
  id: number;
}

export async function POST(request: NextRequest) {
  try {
    const user = auth();
    if (!user.userId) {
      throw new Error("Not signed in");
    }
    const { id } = (await request.json()) as deleteTournamentRequestBody;

    // if (await !isUserOrganizer(user.userId, id))
    return NextResponse.json(
      { message: deleteTournament(id) },
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
