import { NextResponse } from "next/server";
import { addTournament } from "~/server/queries";

export async function GET() {
  return NextResponse.json({ message: "Hello from addTournament" });
}

export async function POST(request) {
  try {
    const { name } = await request.json();

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
