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

interface ChartPieLegendFundProps {
  reports: any[]
  year: string
}

export function ChartPieLegendFund({ reports, year }: ChartPieLegendFundProps) {
  const chartData = useMemo(() => {
    if (!reports) return []

    return reports.map((school: any, index: number) => {
      const totalfund = school.reports?.reduce((sum: number, report: any) => {
        const yearFunds = report.fundingSources?.filter((f: any) => {
        if (!f.received_date) return false
        const fundYear = new Date(f.received_date).getFullYear().toString()
        return year === "Semua" || fundYear === year
      })

        const total =
          yearFunds?.reduce(
            (acc: number, f: any) => acc + Number(f.budget_amount || 0),
            0
          ) || 0

        return sum + total
      }, 0)

      return {
        school: school.school_name,
        totalfund,
        fill: colors[index % colors.length],
      }
    })
  }, [reports, year])

  const totalAllFunds = useMemo(
    () =>
      chartData.reduce((acc: number, curr: any) => acc + curr.totalfund, 0),
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
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Dana Anggaran</CardTitle>
        <CardDescription>Tahun {year}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 pb-0">
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
              dataKey="totalfund"
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
          Total: Rp. {totalAllFunds.toLocaleString("id-ID")}
        </CardTitle>
      </CardFooter>
    </Card>
  )
}
