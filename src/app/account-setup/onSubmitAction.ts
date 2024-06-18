"use server";

import { auth } from "@clerk/nextjs/server";
import { accountSetupFormSchema } from "./accountSetupFormSchema";
import { setupUser } from "~/server/queries";
import { revalidatePath } from "next/cache";

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  redirect?: string;
};

export async function onSubmitAction(
  _prevState: FormState,
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
      formData[key] = value as string;
    });

    const parsed = accountSetupFormSchema.safeParse(formData);

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

    const accountData = parsed.data;

    await setupUser({
      userId: user.userId,
      name: accountData.name,
      phoneNumber: accountData.phoneNumber,
      email: accountData.email,
    });

    return {
      message: "Account setup completed successfully",
      redirect: "/dashboard",
    };
  } catch (error) {
    console.error("Failed to setup account:", error);

    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      message: "Failed to setup account",
      issues: [errorMessage],
    };
  }
}
