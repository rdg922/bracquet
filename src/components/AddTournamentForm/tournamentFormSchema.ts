import { z } from "zod";

export const tournamentFormSchema = z.object({
  name: z.string().min(2).max(255),
  startTime: z.date(),
  venue: z.string().optional(),
  events: z.array(
    z.object({
      name: z.string().min(2).max(256),
      eventType: z.enum([
        "m_single",
        "m_double",
        "w_single",
        "w_double",
        "x_double",
      ]),
      division: z.enum(["novice", "intermediate", "open"]),
      bracketType: z.enum([
        "single_elim",
        "double_elim",
        "single_consol",
        "round_robin",
        "custom",
      ]),
    }),
  ),
});
