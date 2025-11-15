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
  fund: { label: "Anggaran Kumulatif", color: colors[2] },
  spend: { label: "Realisasi Kumulatif", color: colors[4] },
} satisfies ChartConfig

export function ChartAreaFundVsSpend({
  chartData,
  selectedYear,
}: {
  chartData: any[]
  selectedYear: string
}) {
  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID").format(num)

  // Step 1: collect all fund & spending entries by date
  const fundByDate: Record<string, number> = {}
  const spendByDate: Record<string, number> = {}

  chartData?.forEach((school) => {
    if (Array.isArray(school?.reports)) {
      school.reports.forEach((r: any) => {
        r.fundingSources?.forEach((fund: any) => {
          if (!fund?.received_date) return
          const date = new Date(fund.received_date)
          const year = date.getFullYear().toString()
          if (selectedYear !== "Semua" && year !== selectedYear) return

          const dateKey = date.toISOString().split("T")[0]
          const amount = parseFloat(fund.budget_amount) || 0
          fundByDate[dateKey] = (fundByDate[dateKey] || 0) + amount
        })

        r.activities?.forEach((activity: any) => {
          if (!activity?.activityDate) return
          const date = new Date(activity.activityDate)
          const year = date.getFullYear().toString()
          if (selectedYear !== "Semua" && year !== selectedYear) return

          const dateKey = date.toISOString().split("T")[0]
          const spend =
            (parseFloat(activity.unitPrice) || 0) *
            (parseFloat(activity.quantity) || 0)
          spendByDate[dateKey] = (spendByDate[dateKey] || 0) + spend
        })
      })
    }
  })

  const allDates = Array.from(
    new Set([...Object.keys(fundByDate), ...Object.keys(spendByDate)])
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  let cumulativeFund = 0
  let cumulativeSpend = 0
  const formattedData = allDates.map((date) => {
    cumulativeFund += fundByDate[date] || 0
    cumulativeSpend += spendByDate[date] || 0
    return {
      date,
      fund: cumulativeFund,
      spend: cumulativeSpend,
    }
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>
          {selectedYear === "Semua"
            ? "Kumulatif Anggaran vs Realisasi (Semua Tahun)"
            : `Kumulatif Anggaran vs Realisasi (${selectedYear})`}
        </CardTitle>
        <CardDescription>
          Grafik menunjukkan total kumulatif dana yang diterima dan
          pengeluaran sepanjang waktu.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="fillFund" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartConfig.fund.color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.fund.color}
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillSpend" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartConfig.spend.color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.spend.color}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

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
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `${formatRupiah(value)}`}
            />
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

            <Area
              type="monotone"
              dataKey="fund"
              stroke={chartConfig.fund.color}
              fill="url(#fillFund)"
              name={chartConfig.fund.label}
            />
            <Area
              type="monotone"
              dataKey="spend"
              stroke={chartConfig.spend.color}
              fill="url(#fillSpend)"
              name={chartConfig.spend.label}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
