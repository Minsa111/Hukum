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

interface ChartPieLegendSpendProps {
  reports: any[]
  year: string
}

export function ChartPieLegendSpend({ reports, year }: ChartPieLegendSpendProps) {
  // 🧠 Prepare chart data based on selected year
  const chartData = useMemo(() => {
    if (!reports) return []

    return reports.map((school: any, index: number) => {
      // Loop through each school's reports
      const totalSpend = school.reports?.reduce((sum: number, report: any) => {
        const yearActivities = report.activities?.filter((a: any) => {
          if (!a.activityDate) return false
          const activityYear = new Date(a.activityDate).getFullYear().toString()
          return year === "Semua" || activityYear === year
        })

        const total =
          yearActivities?.reduce(
            (acc: number, a: any) =>
              acc + Number(a.unitPrice || 0) * Number(a.quantity || 0),
            0
          ) || 0

        return sum + total
      }, 0)

      return {
        school: school.school_name,
        totalspend: totalSpend,
        fill: colors[index % colors.length],
      }
    })
  }, [reports, year])

  const totalAllSpends = useMemo(
    () =>
      chartData.reduce((acc: number, curr: any) => acc + curr.totalspend, 0),
    [chartData]
  )

  const chartConfig: ChartConfig = useMemo(
    () =>
      chartData.reduce((config, item, index) => {
        config[item.school] = {
          label: item.school,
          color: colors[index % colors.length],
        }
        return config
      }, {} as ChartConfig),
    [chartData]
  )

  return (
    <Card className="flex flex-col gap-6">
      <CardHeader className="items-center pb-0">
        <CardTitle>Dana Pengeluaran</CardTitle>
        <CardDescription>Tahun {year}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full min-h-[225px] sm:min-h-[270px] lg:max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="totalspend"
              nameKey="school"
              label={({ value }) => `Rp. ${new Intl.NumberFormat("id-ID").format(value as number)}`}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="school" />}
              className="-translate-y-2 flex-wrap gap-2 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex items-start">
        <CardTitle>
          Total: Rp. {totalAllSpends.toLocaleString("id-ID")}
        </CardTitle>
      </CardFooter>
    </Card>
  )
}
