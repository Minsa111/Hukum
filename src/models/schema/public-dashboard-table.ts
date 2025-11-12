import { z } from "zod"

export const activitySchema = z.object({
  id: z.string(),
  activity: z.string(),
  supportingFile: z.string().nullable(),
  activityDate: z.string(), // ISO date string
  spendingAccount: z.string(),
  description: z.string(),
  unitPrice: z.string(), // stored as string, e.g. "123.00"
  quantity: z.number(),
  unit: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const fundingSourceSchema = z.object({
  id: z.string(),
  source_of_fund: z.string(),
  budget_amount: z.string(), // stored as string, e.g. "123123.00"
  received_date: z.string(), // ISO date string
  created_at: z.string(),
  updated_at: z.string(),
})

export const reportSchema = z.object({
  id: z.string(),
  title: z.string(),
  report_date: z.string(),
  last_edited_date: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  activities: z.array(activitySchema),
  fundingSources: z.array(fundingSourceSchema),
  source_of_fund: z.string(),
  budget_amount: z.number(),
  realization_amount: z.number(),
  remaining_fund: z.number(),
})

export const schoolReportSchema = z.object({
  nisn: z.string(),
  school_name: z.string(),
  reports: z.array(reportSchema),
})

export const reportDataSchema = z.array(schoolReportSchema)
