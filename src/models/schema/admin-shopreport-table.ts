import { z } from "zod";

// Schema for each activity
const activitySchema = z.object({
  id: z.string(),
  activity: z.string(),
  supportingFile: z.string().nullable().optional(),
  activityDate: z.string(),
  spendingAccount: z.string(),
  description: z.string(),
  unitPrice: z.preprocess(
    (arg) => (typeof arg === "string" ? parseFloat(arg) : arg),
    z.number()
  ),
  quantity: z.number(),
  unit: z.string(),
  created_at: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
  updated_at: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
  totalPrice: z.number(),
});

// Schema for each funding source
const fundingSourceSchema = z.object({
  id: z.string(),
  source_of_fund: z.string(),
  budget_amount: z.preprocess(
    (arg) => (typeof arg === "string" ? parseFloat(arg) : arg),
    z.number()
  ),
  created_at: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
  updated_at: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
});

// Schema for each report
export const reportSchema = z.object({
  id: z.string(),
  title: z.string(),
  report_date: z.string(),
  last_edited_date: z.string(),
  created_at: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
  updated_at: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
  activities: z.array(activitySchema),
  fundingSources: z.array(fundingSourceSchema),
  total_budget_amount: z.number(),
  realization_amount: z.number(),
  remaining_fund: z.number(),
});

// The full array of reports
export const reportListSchema = z.array(reportSchema);

// Type inference for TypeScript
export type Report = z.infer<typeof reportSchema>;
export type ReportList = z.infer<typeof reportListSchema>;
