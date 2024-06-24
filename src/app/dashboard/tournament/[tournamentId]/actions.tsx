"use server";

import { type IRegistrationWithDetails } from "~/server/db/schema";
import { getUser } from "~/server/queries";

export async function onKickUserAction(_params: IRegistrationWithDetails) {
  //not implemented yet!
}
