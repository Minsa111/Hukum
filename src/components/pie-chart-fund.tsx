"use client"

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
  ChartTooltipContent
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import chartData from "@/models/dummy/chartData.json"
import colors from "@/models/dummy/colorsconfig.json"


// 🧠 Auto-generate chartConfig from chartData
const chartConfig: ChartConfig = chartData.reduce(
  (config, item, index) => {
    config[item.school] = {
      label: item.school,
      color: colors[index % colors.length],
    }
    return config
  },
  {} as ChartConfig
)

// Add a label for totalfund
chartConfig.totalfund = { label: "Total Dana" }

export function ChartPieLegendFund() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Dana Anggaran</CardTitle>
        <CardDescription>Tahun 2025</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full min-h-[265px] sm:min-h-[250px] lg:max-h-[400px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData.map((item, index) => ({
                ...item,
                fill: colors[index % colors.length],
              }))}
              dataKey="totalfund"
              nameKey="school"
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="school" />}
              className="-translate-y-2 flex-wrap gap-2 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <CardTitle>Rp. 100.000.000</CardTitle>
      </CardFooter>
    </Card>
  )
}
