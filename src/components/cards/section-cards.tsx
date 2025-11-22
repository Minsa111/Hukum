import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
// import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards({ data }: { data: any[] }) {
  const now = new Date()
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(now.getMonth() - 6)

  const prevEnd = new Date(sixMonthsAgo)
  const prevStart = new Date(sixMonthsAgo)
  prevStart.setMonth(prevStart.getMonth() - 6)

  const inRange = (dateStr: string, start: Date, end: Date) => {
    const date = new Date(dateStr)
    return date >= start && date <= end
  }

  const sumRealization = (start: Date, end: Date) => {
    return data.reduce((total, report) => {
      const activities = report.activities || []
      const filtered = activities.filter((a: any) => inRange(a.activityDate, start, end))
      const sum = filtered.reduce(
        (s: number, a: any) => s + (parseFloat(a.unitPrice) * (a.quantity || 0)),
        0
      )
      return total + sum
    }, 0)
  }

  const sumFund = (start: Date, end: Date) => {
    return data.reduce((total, report) => {
      const funds = report.fundingSources || []
      const filtered = funds.filter((f: any) => inRange(f.received_date, start, end))
      const sum = filtered.reduce(
        (s: number, f: any) => s + (parseFloat(f.budget_amount) || 0),
        0
      )
      return total + sum
    }, 0)
  }

  const countActivity = (start: Date, end: Date) => {
    return data.reduce((count, report) => {
      const activities = report.activities || []
      return count + activities.filter((a: any) => inRange(a.activityDate, start, end)).length
    }, 0)
  }

  const currentRealization = sumRealization(sixMonthsAgo, now)
  const currentFund = sumFund(sixMonthsAgo, now)
  const currentActivities = countActivity(sixMonthsAgo, now)

  const prevRealization = sumRealization(prevStart, prevEnd)
  const prevFund = sumFund(prevStart, prevEnd)
  const prevActivities = countActivity(prevStart, prevEnd)

  const calcGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const realizationGrowth = calcGrowth(currentRealization, prevRealization)
  const fundGrowth = calcGrowth(currentFund, prevFund)
  const activityGrowth = calcGrowth(currentActivities, prevActivities)


  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @lg/main:grid-cols-2 @5xl/main:grid-cols-3">
      <Card className="@container/card gap-2">
        <CardHeader>
          <CardDescription>Total Anggaran</CardDescription>
          <CardAction>
            <Badge variant="outline" className="flex items-center gap-1">
              {fundGrowth >= 0 
              ? 
              <div className="flex gap-1 text-green-600"> 
                <IconTrendingUp className="size-3"/> 
                {fundGrowth.toFixed(1)}%
              </div>
              :
              <div className="flex gap-1 text-red-600">
                <IconTrendingDown className="size-3"/>
                {fundGrowth.toFixed(1)}%
              </div>
              }
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="flex">
          <CardTitle className="text-left text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            Rp. {currentFund.toLocaleString("id-ID")}
          </CardTitle>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {fundGrowth >= 0 
              ?
              <p className="flex line-clamp-1 gap-2 font-medium">
                <span>Meningkat
                  <span className="text-green-600"> 
                    {fundGrowth.toFixed(1)}%
                  </span>
                </span><IconTrendingUp className="size-4 text-green-600" />
              </p>
              :
              <p className="flex line-clamp-1 gap-2 font-medium">
                Berkurang <span className="text-red-600"> 
                    {fundGrowth.toFixed(1)}%
                  </span> <IconTrendingDown className="text-red-600 size-4" /> 
                  
              </p>
            }
          </div>
          <div className="text-muted-foreground text-left text-xs">
            Anggaran yang diterima selama 6 bulan terakhir
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card gap-2">
        <CardHeader>
          <CardDescription>Total Realisasi</CardDescription>
          <CardAction>
            <Badge variant="outline" >
              {realizationGrowth >= 0 ? 
                <div className="flex gap-1 text-red-600"> 
                  <IconTrendingUp className="size-3"/> {realizationGrowth.toFixed(1)}%
                </div> 
                : 
                <div className="flex gap-1 text-green-600"> 
                  <IconTrendingDown className="size-3"/> {realizationGrowth.toFixed(1)}%
                </div>
              }
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="flex">
          <CardTitle className="text-xl text-left font-semibold tabular-nums @[250px]/card:text-2xl">
            Rp.{currentRealization.toLocaleString("id-ID")}
          </CardTitle>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {realizationGrowth >= 0 
              ?
              <p className="flex line-clamp-1 gap-2 font-medium">
                <span>Meningkat
                  <span className="text-red-600"> {realizationGrowth.toFixed(1)}%
                  </span>
                </span><IconTrendingUp className="size-4 text-red-600" />
              </p>
              :
              <p className="flex line-clamp-1 gap-2 font-medium text-green-600">Penurunan Realisasi <IconTrendingDown className="size-4 text-green-600" /> </p>}
          </div>
          <div className="text-muted-foreground text-xs">
            Realisasi selama 6 bulan terakhir
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card gap-2">
        <CardHeader>
          <CardDescription>Kegiatan</CardDescription>
          <CardAction>
            <Badge variant="outline">
              {activityGrowth >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {activityGrowth.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="flex">
          <CardTitle className="text-l font-semibold tabular-nums @[250px]/card:text-2xl text-left">
            {currentActivities.toLocaleString("id-ID")}
          </CardTitle>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Kegiatan selama 6 bulan terakhir
          </div>
          <div className="text-muted-foreground text-xs">Jumlah kegiatan selama 6 bulan terakhir</div>
        </CardFooter>
      </Card>
    </div>
  )
}
