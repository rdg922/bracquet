"use server";

import { auth } from "@clerk/nextjs/server";
import { tournamentFormSchema } from "./tournamentFormSchema";
import { addTournament, addEvent } from "~/server/queries";
import { type ITournament, type IEvent } from "~/server/db/schema";

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function onSubmitAction(
  prevState: FormState,
  data: FormData,
): Promise<FormState> {
  try {
    const user = auth();

    if (!user.userId) {
      return {
        message: "Unauthorized",
        issues: ["User is not authenticated"],
      };
    }

    const formData: Record<string, unknown> = {};
    data.forEach((value, key) => {
      if (key === "events") {
        formData[key] = JSON.parse(value as string);
      } else if (key === "startTime") {
        formData[key] = new Date(value as string);
      } else {
        formData[key] = value as string;
      }
    });

    const parsed = tournamentFormSchema.safeParse(formData);

    if (!parsed.success) {
      const fields: Record<string, string> = {};
      for (const key of Object.keys(formData)) {
        fields[key] = formData[key]?.toString() ?? "";
      }
      return {
        message: "Invalid form data",
        fields,
        issues: parsed.error.issues.map((issue) => issue.message),
      };
    }

    const tournament = parsed.data;

    const newTournament = await addTournament({
      ...(tournament as ITournament),
      organizerId: user.userId,
      startTime: tournament.startTime ?? new Date(),
    });

    if (!newTournament[0]?.tournamentId) {
      throw new Error("Tournament creation failed");
    }

    const tournamentId = newTournament[0].tournamentId;

    const eventPromises = tournament.events.map((event: IEvent) =>
      addEvent({
        ...event,
        tournamentId,
      }),
    );
    await Promise.all(eventPromises);

    return { message: "Tournament added successfully" };
  } catch (error) {
    console.error("Failed to add tournament:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to add tournament";

    return {
      message: "Failed to add tournament",
      issues: [errorMessage],
    };
  }
}
