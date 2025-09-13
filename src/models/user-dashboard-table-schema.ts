// src/schemas/table-schema.ts
import { z } from "zod"

export const schema= z.object({
    id: z.number(),
    title: z.string(),
    category: z.string(),
    status: z.string(),
    budgettotal: z.number(),
    target: z.string(),
    limit: z.string(),
    reviewer: z.string(),
    })

export type Schema = z.infer<typeof schema>
