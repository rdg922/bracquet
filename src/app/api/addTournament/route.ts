import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { type ITournament } from "~/server/db/schema";
import { addEvent, addTournament } from "~/server/queries";
import { type tournamentFormSchema } from "~/components/AddTournament";
import { type z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const user = auth();

    if (!user.userId) {
      throw new Error("unauth");
    }

    const tournament = (await request.json()) as z.infer<
      typeof tournamentFormSchema
    >;

    await addTournament({
      ...(tournament as ITournament),
      organizerId: user.userId,
      startTime: new Date(tournament.startTime ?? Date.now()),
    });

    for (const event of tournament.events) {
      await addEvent({
        ...event,
      });
    }

    return NextResponse.json({ message: "Tournament added successfully" });
  } catch (error) {
    console.error("Failed to add tournament:", error);
    return NextResponse.json(
      { message: "Failed to add tournament" },
      { status: 500 },
    );
  }
}
