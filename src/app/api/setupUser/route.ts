import { type NextRequest, NextResponse } from "next/server";
import { type IUser } from "~/server/db/schema";
import { setupUser } from "~/server/queries";

export async function POST(request: NextRequest) {
  const { authId, name, email }: IUser = (await request.json()) as IUser; // TODO: get email address here rather than frontend

  try {
    if (!authId || !name || !email) throw new Error("bad credentials");

    await setupUser({ authId, name, email });
    return NextResponse.json(
      { message: "User Setup Complete" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error setting up user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
