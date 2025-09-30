// src/schemas/table-schema.ts
import { z } from "zod"

export const schema= z.object({
    id: z.number(),
    title: z.string(),
    fundsource: z.string(),
    fundtotal: z.number(),
    spendtotal: z.number(),
    fundremain: z.number(),
    lastedit: z.preprocess((arg) => {
        if(typeof arg === "string" || arg === "number") {
            return new Date(arg)
        }
        return arg;
    },z.date()),
})

export type Schema = z.infer<typeof schema>
