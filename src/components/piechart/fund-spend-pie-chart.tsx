"use client"

import { useMemo } from "react"
import { Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import colors from "@/models/dummy/colorsconfig.json"

interface ChartPieLegendFundSpendProps {
  reports: any[]
  year: string
}

export function ChartPieLegendFundSpend({ reports, year }: ChartPieLegendFundSpendProps) {
  // 🧠 Prepare chart data (for only 1 school)
  const chartData = useMemo(() => {
    if (!reports || reports.length === 0) return []

    const school = reports[0] // Only 1 school
    let totalFund = 0
    let totalSpend = 0

    school.reports.forEach((report: any) => {
      // Count total fund (dana diterima)
      report.fundingSources?.forEach((fund: any) => {
        const fundYear = new Date(fund.received_date).getFullYear().toString()
        if (year === "Semua" || fundYear === year) {
          totalFund += parseFloat(fund.budget_amount) || 0
        }
      })

      // Count total spend (dana dibelanjakan)
      report.activities?.forEach((act: any) => {
        const actYear = new Date(act.activityDate).getFullYear().toString()
        if (year === "Semua" || actYear === year) {
          totalSpend += (parseFloat(act.unitPrice) || 0) * (Number(act.quantity) || 0)
        }
      })
    })

    return [
      {
        name: "Dana Anggaran",
        value: totalFund,
        fill: colors[2],
      },
      {
        name: "Dana Realisasi",
        value: totalSpend,
        fill: colors[4],
      },
    ]
  }, [reports, year])

  const chartConfig: ChartConfig = useMemo(
    () =>
      chartData.reduce((config, item) => {
        config[item.name] = { label: item.name, color: item.fill }
        return config
      }, {} as ChartConfig),
    [chartData]
  )


  return (
    <Card className="flex flex-col gap-6">
      <CardHeader className="items-center pb-0">
        <CardTitle>Perbandingan Dana Masuk & Keluar</CardTitle>
        <CardDescription>
          {reports[0]?.school_name} — Tahun {year}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full min-h-[225px] sm:min-h-[270px] lg:max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              label={({ name }) =>
                `${name}`
              }
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="value" />}
              className="-translate-y-2 flex-wrap gap-2 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>

<CardFooter className="flex flex-col gap-4 items-start justify-between">
  <div className="w-full flex flex-col gap-2">
    <CardTitle className="text-sm">
      <span className="text-neutral-500">Total Dana Dibelanjakan: </span>
      Rp {chartData[1]?.value.toLocaleString("id-ID")}
    </CardTitle>
    <CardTitle className="text-sm">
      <span className="text-neutral-500">Total Dana Diterima: </span>
      Rp {chartData[0]?.value.toLocaleString("id-ID")}
    </CardTitle>

    {/* Progress bar */}
    <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden mt-2">
      <div
        className="h-full bg-blue-500 transition-all duration-500"
        style={{
          width: `${
            chartData[0]?.value
              ? Math.min((chartData[1]?.value / chartData[0]?.value) * 100, 100)
              : 0
          }%`,
        }}
      />
    </div>

    {/* Percentage text */}
    <div className="flex justify-between w-full text-xs text-neutral-500">
      <span className="text-primary">
        Realisasi:{" "}
        {chartData[0]?.value
          ? ((chartData[1]?.value / chartData[0]?.value) * 100).toFixed(2)
          : 0}
        %
      </span>
      <span>
        Sisa:{" "}
        {chartData[0]?.value
          ? (100 - (chartData[1]?.value / chartData[0]?.value) * 100).toFixed(2)
          : 0}
        %
      </span>
    </div>
  </div>
</CardFooter>

    </Card>
  )
}
