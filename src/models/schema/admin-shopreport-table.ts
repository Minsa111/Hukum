// src/schemas/table-schema.ts
import { z } from "zod"

export const schema= z.object({
    reportid: z.number(),
    num: z.number(),
    title: z.string(),
    fundsource: z.string(),
    fundtotal: z.number(),
    spendtotal: z.number(),
    fundremain: z.number(),
    lastcreated: z.preprocess((arg) => {
        if(typeof arg === "string" || arg === "number") {
            return new Date(arg)
        }
        return arg;
    },z.date()),
    lastedit: z.preprocess((arg) => {
        if(typeof arg === "string" || arg === "number") {
            return new Date(arg)
        }
        return arg;
    },z.date()),
})

export type Schema = z.infer<typeof schema>