import { NextResponse } from "next/server";
import { deleteTournament } from "~/server/queries";

export async function POST(request) {
  const { id } = await request.json();
  console.log(id);
  return NextResponse.json({ message: deleteTournament(id) }, { status: 200 });
}
