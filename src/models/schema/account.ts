// schemas/users.ts
import { z } from "zod"

/**
 * School object (may be null in the user object)
 */
export const schoolSchema = z.object({
    id: z.string(),
    nisn: z.string(),
    school_name: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
})

/**
 * User object. `school` is nullable because some users may not be tied to a school.
 * If you have a fixed set of roles, consider replacing `role: z.string()` with:
 *   role: z.enum(['instansi', 'admin', 'superadmin'])
 */
export const userSchema = z.object({
    id: z.string(),
    school: schoolSchema.nullable(),
    username: z.string(),
    password: z.string(),
    role: z.string(),
    status: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
})

/**
 * Top-level array
 */
export const usersSchema = z.array(userSchema)

export type School = z.infer<typeof schoolSchema>
export type User = z.infer<typeof userSchema>
export type Users = z.infer<typeof usersSchema>
