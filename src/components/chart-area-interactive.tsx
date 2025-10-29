"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useIsMobile } from "@/api/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "Cumulative realization vs budget chart"

const chartConfig = {
  realization: {
    label: "Realisasi (Kumulatif)",
    color: "var(--chart-3)",
  },
  budget: {
    label: "Anggaran (Kumulatif)",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({ chartData }: { chartData: any[] }) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d")
  }, [isMobile])

  // ✅ Step 1: Group all data by date
  const groupedData: Record<string, { realization: number; budget: number }> = {}

  chartData.forEach((report) => {
    // Sum of realization per activity date
    report.activities?.forEach((activity: any) => {
      const date = activity.activityDate
      if (!groupedData[date]) groupedData[date] = { realization: 0, budget: 0 }
      groupedData[date].realization += parseFloat(activity.totalPrice) || 0
    })

    // Sum of budgets per report_date
    const reportDate = report.report_date
    if (!groupedData[reportDate]) groupedData[reportDate] = { realization: 0, budget: 0 }
    report.fundingSources?.forEach((fund: any) => {
      groupedData[reportDate].budget += parseFloat(fund.budget_amount) || 0
    })
  })

  // ✅ Step 2: Convert and sort by date
  const formattedData = Object.entries(groupedData)
    .map(([date, value]) => ({
      date,
      realization: value.realization,
      budget: value.budget,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // ✅ Step 3: Make it cumulative (running total)
  let cumulativeRealization = 0
  let cumulativeBudget = 0
  const cumulativeData = formattedData.map((item) => {
    cumulativeRealization += item.realization
    cumulativeBudget += item.budget
    return {
      ...item,
      realization: cumulativeRealization,
      budget: cumulativeBudget,
    }
  })

  // ✅ Step 4: Filter by selected time range
  const now = new Date()
  const filteredData = cumulativeData.filter((item) => {
    const date = new Date(item.date)
    let days = 365
    if (timeRange === "90d") days = 90
    else if (timeRange === "30d") days = 30
    else if (timeRange === "7d") days = 7
    const start = new Date(now)
    start.setDate(now.getDate() - days)
    return date >= start
  })

  // ✅ Step 5: Render chart
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Realisasi vs Anggaran (Kumulatif)</CardTitle>
        <CardDescription>
          Tren pertumbuhan dana dan realisasi dalam{" "}
          {timeRange === "365d"
            ? "1 tahun terakhir" : 
            timeRange === "90d"
            ? "3 bulan terakhir"
            : timeRange === "30d"
            ? "30 hari terakhir"
            : "7 hari terakhir"}
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden @[767px]/card:flex"
          >
            <ToggleGroupItem value="365d">1 Tahun</ToggleGroupItem>
            <ToggleGroupItem value="90d">3 Bulan</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 Hari</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 Hari</ToggleGroupItem>
          </ToggleGroup>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="flex w-40 @[767px]/card:hidden" size="sm">
              <SelectValue placeholder="1 Tahun" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="365d">1 Tahun</SelectItem>
              <SelectItem value="90d">3 Bulan</SelectItem>
              <SelectItem value="30d">30 Hari</SelectItem>
              <SelectItem value="7d">7 Hari</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillRealization" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-realization)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-realization)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillBudget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-budget)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-budget)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("id-ID", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("id-ID", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="budget"
              type="natural"
              fill="url(#fillBudget)"
              stroke="var(--color-budget)"
            />
            <Area
              dataKey="realization"
              type="natural"
              fill="url(#fillRealization)"
              stroke="var(--color-realization)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
