"use client"

import { useState, useMemo } from "react"
import { ChartPieLegendFund } from "@/components/piechart/fund-pie-chart"
import { ChartPieLegendSpend } from "@/components/piechart/spend-pie-chart"
import { usePublicReports } from "@/api/hooks/use-public-report"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTable } from "@/components/table/public/spend-fund-table"
import { ChartAreaSpendBySchool } from "@/components/chart/public-chart-area-interactive"

export default function Page() {
  const { data, loading, error, reload } = usePublicReports()
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  )
  const availableYears = useMemo(() => {
    const years = new Set<string>()
    data?.forEach((school: any) => {
      school.reports?.forEach((r: any) => {
        r.fundingSources?.forEach((f: any) => {
          if (f.received_date) {
            years.add(new Date(f.received_date).getFullYear().toString())
          }
        })
        r.activities?.forEach((a: any) => {
          if (a.activityDate) {
            years.add(new Date(a.activityDate).getFullYear().toString())
          }
        })
      })
    })
    const sorted = Array.from(years).sort((a, b) => Number(b) - Number(a))
    return ["Semua", ...sorted]
  }, [data])
  return (
      <div className="flex flex-1 flex-col gap-2 bg-background relative lg:px-16 px-2 w-full">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex justify-end items-center px-2 md:px-6">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-y-4 gap-x-6 md:grid-cols-2 mx-0 md:mx-6 lg:mx-6">
              <ChartPieLegendFund reports={data} year={selectedYear} />
              <ChartPieLegendSpend reports={data} year={selectedYear} />
            </div>
            <div className="grid gap-y-4 gap-x-6 mx-0 md:mx-6 lg:mx-6">
              <ChartAreaSpendBySchool chartData={data} selectedYear={selectedYear} />
            </div>
            <DataTable reports={data}selectedYear={selectedYear}/>
          </div>
        </div>
      </div>
  )
}
