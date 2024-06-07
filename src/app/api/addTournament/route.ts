import { type NextRequest, NextResponse } from "next/server";
import { addTournament } from "~/server/queries";

interface TournamentRequestBody {
  name: string;
}

export async function POST(request: NextRequest) {
  try {
    const { name } = (await request.json()) as TournamentRequestBody;

    if (!name) {
      return NextResponse.json(
        { message: "Tournament name is required" },
        { status: 400 },
      );
    }

    await addTournament({ name });

    return NextResponse.json({ message: "Tournament added successfully" });
  } catch (error) {
    console.error("Failed to add tournament:", error);
    return NextResponse.json(
      { message: "Failed to add tournament" },
      { status: 500 },
    );
  }
}
