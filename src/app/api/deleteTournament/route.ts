import { type NextRequest, NextResponse } from "next/server";
import { deleteTournament } from "~/server/queries";

interface deleteTournamentRequestBody {
  id: number;
}

export async function POST(request: NextRequest) {
  const { id } = (await request.json()) as deleteTournamentRequestBody;
  console.log(id);
  return NextResponse.json({ message: deleteTournament(id) }, { status: 200 });
}
