import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { type IUser } from "~/server/db/schema";
import { setupUser } from "~/server/queries";
// import { env } from "process";

// import Twilio from "twilio";

// Initialize Twilio client with your credentials
// const twilioClient = Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

export async function POST(request: NextRequest) {
  const user = auth();
  const userId = user.userId;
  const { name, email, phoneNumber }: IUser = (await request.json()) as IUser; // TODO: get email address here rather than frontend

  try {
    if (!userId || !name || !email || !phoneNumber)
      throw new Error("bad credentials");

    await setupUser({ userId, name, email, phoneNumber });
    // await twilioClient.messages
    //   .create({
    //     body: `Hello ${name}, your account has been successfully set up!`,
    //     from: env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
    //     to: phoneNumber,
    //   });
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
