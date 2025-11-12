"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import colors from "@/models/dummy/colorsconfig.json"

const chartConfig = {
  spending: {
    label: "Pengeluaran Kumulatif",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaSpendBySchool({
  chartData,
  selectedYear,
}: {
  chartData: any[]
  selectedYear: string
}) {
  // Step 1: Collect spending by school and date
  const spendingBySchool: Record<string, Record<string, number>> = {}

  chartData?.forEach((report) => {
    const schoolName = report.school_name || "Tidak diketahui"

    if (Array.isArray(report?.reports)) {
      report.reports.forEach((r: any) => {
        if (Array.isArray(r?.activities)) {
          r.activities.forEach((activity: any) => {
            if (!activity?.activityDate) return
            const date = new Date(activity.activityDate)
            const year = date.getFullYear().toString()

            // ✅ Only filter if selectedYear is not "Semua"
            if (selectedYear !== "Semua" && year !== selectedYear) return

            const spending =
              (parseFloat(activity.unitPrice) || 0) *
              (parseFloat(activity.quantity) || 0)
            const dateKey = date.toISOString().split("T")[0]

            if (!spendingBySchool[schoolName]) spendingBySchool[schoolName] = {}
            spendingBySchool[schoolName][dateKey] =
              (spendingBySchool[schoolName][dateKey] || 0) + spending
          })
        }
      })
    }
  })

  // Step 2: Merge all dates across schools
  const allDates = new Set<string>()
  Object.values(spendingBySchool).forEach((schoolData) => {
    Object.keys(schoolData).forEach((d) => allDates.add(d))
  })

  const sortedDates = Array.from(allDates).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  // Step 3: Compute cumulative totals per school over time
  const cumulativeTotals: Record<string, number> = {}
  const formattedData = sortedDates.map((date) => {
    const entry: Record<string, any> = { date }

    Object.keys(spendingBySchool).forEach((schoolName) => {
      const spend = spendingBySchool[schoolName][date] || 0
      cumulativeTotals[schoolName] =
        (cumulativeTotals[schoolName] || 0) + spend
      entry[schoolName] = cumulativeTotals[schoolName]
    })

    return entry
  })

  const schools = Object.keys(spendingBySchool)

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>
          {selectedYear === "Semua"
            ? "Perbandingan Pengeluaran Kumulatif (Semua Tahun)"
            : `Perbandingan Pengeluaran Kumulatif (${selectedYear})`}
        </CardTitle>
        <CardDescription>
          Setiap garis menunjukkan total akumulatif pengeluaran per sekolah
          {selectedYear === "Semua" ? " sepanjang waktu" : ""}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <AreaChart data={formattedData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              angle={-25}
              textAnchor="end"
              height={60}
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Tanggal: ${value}`}
                  indicator="dot"
                />
              }
            />
            <Legend />

            {schools.map((school, index) => (
              <Area
                key={school}
                type="monotone"
                dataKey={school}
                stroke={colors[index % colors.length]}
                fillOpacity={0.15}
                fill={colors[index % colors.length]}
                name={school}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
