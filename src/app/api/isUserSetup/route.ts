import { type NextRequest, NextResponse } from "next/server";
import { isUserSetup } from "~/server/queries"; // Adjust the path as needed

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }

  try {
    const result = await isUserSetup(userId);
    return NextResponse.json({ message: result }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
