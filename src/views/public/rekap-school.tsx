import { useState, useMemo, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTable } from "@/components/table/public/spend-fund-table"
import { useParams } from "react-router-dom"
import { API_PURCHASE, API_NISN } from "@/api/api"
import { fetchWithAuth } from "@/controllers/fetchwithauths"
import { toast } from "sonner"
import { ChartPieLegendFundSpend } from "@/components/piechart/fund-spend-pie-chart"
import { ChartAreaFundVsSpend } from "@/components/chart/spend-fund-chart-area-interactive"
import { reportDataSchema } from "@/models/schema/public-dashboard-table"

export default function Page() {
  const { nisn } = useParams<{ nisn: string }>()
  const [report, setReport] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  )

  // 🧠 Load data immediately and extract reports[]
  async function loadReport() {
    try {
      const json = await fetchWithAuth(`${API_PURCHASE}${API_NISN}/${nisn}`)

      const parsed = reportDataSchema.parse(json) // ✅ validate here

      setReport(parsed) // parsed has correct types

    } catch (err) {
      toast.error("Terjadi kesalahan saat mengambil data.")
      console.error("Zod validation error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReport()
  }, [])

  const availableYears = useMemo(() => {
    const years = new Set<string>()
    report?.forEach((r: any) => {
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
    const sorted = Array.from(years).sort((a, b) => Number(b) - Number(a))
    return ["Semua", ...sorted]
  }, [report])

  if (loading) return <p>Loading...</p>

  return (
    <div className="flex flex-1 flex-col gap-2 bg-background relative lg:px-16 px-2 w-full">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex justify-between items-start pl-2 md:pl-6">
            <span className="text-2xl font-bold">
              {report[0]?.school_name || ""}
            </span>
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

          {/* 📊 Charts Section */}
          <div className="grid gap-y-4 gap-x-6 md:grid-cols-[30%_70%] mx-0 md:mx-6 lg:mx-6">
            <ChartPieLegendFundSpend reports={report} year={selectedYear} />
            <ChartAreaFundVsSpend chartData={report} selectedYear={selectedYear} />
          </div>

          {/* 📋 DataTable directly fed from extracted reports[] */}
          <div className="grid gap-y-4 gap-x-6 mx-0 md:mx-6 lg:mx-6">
            {report.length > 0 && (
              <DataTable reports={report[0]?.reports} selectedYear={selectedYear} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
