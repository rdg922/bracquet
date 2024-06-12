import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { addTournament } from "~/server/queries";

interface TournamentRequestBody {
  name: string;
  organizerId: string;
}

export async function POST(request: NextRequest) {
  try {
    const user = auth();

    if (!user.userId) {
      throw new Error("unauth");
    }

    const { name } = (await request.json()) as TournamentRequestBody;

    if (!name) {
      return NextResponse.json(
        { message: "Tournament name is required" },
        { status: 400 },
      );
    }

    await addTournament({ name, organizerId: user.userId });

    return NextResponse.json({ message: "Tournament added successfully" });
  } catch (error) {
    console.error("Failed to add tournament:", error);
    return NextResponse.json(
      { message: "Failed to add tournament" },
      { status: 500 },
    );
  }
}
