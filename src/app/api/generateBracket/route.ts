// import { type NextRequest } from "next/server";
// import { type IGame, type IRegistration } from "~/server/db/schema";
// import { addGames, getRegistrations } from "~/server/queries";
//
// export default async function POST(request: NextRequest) {
//   const { eventId } = (await request.json()) as { eventId: number };
//   const registrations = (await getRegistrations(eventId)) as IRegistration[];
//   const games: IGame[] = [];
//
//   // add all registrations to the game in a single elimination with a bracketPosition of 0
//   for (let i = 0; i < Math.ceil(registrations.length / 2); i += 1) {
//     games.push({
//       eventId,
//       bracketPosition: 0,
//       status: "not started",
//     });
//   }
//
// }
