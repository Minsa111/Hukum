import { z } from "zod";

export const schema = z.object({
  id: z.string().uuid(),
  activity: z.string(),
  supportingFile: z.string().nullable().optional(),
  activityDate: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    { message: "Invalid date format" }
  ),
  spendingAccount: z.string(),
  description: z.string().optional(),
  unitPrice: z.string().transform(Number),
  quantity: z.number(),
  unit: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Schema = z.infer<typeof schema>;