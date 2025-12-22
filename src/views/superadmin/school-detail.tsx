import { useState, useMemo, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTable } from "@/components/table/superadmin/spend-fund-table"
import { useParams } from "react-router-dom"
import { API_PURCHASE, API_NISN } from "@/api/api"
import { fetchWithAuth } from "@/controllers/fetchwithauths"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { ChartPieLegendFundSpend } from "@/components/piechart/fund-spend-pie-chart"
import { ChartAreaFundVsSpend } from "@/components/chart/spend-fund-chart-area-interactive"
import { reportDataSchema } from "@/models/schema/public-dashboard-table"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { IconArrowLeft } from "@tabler/icons-react"

export default function Page() {
  const { school_id: nisn } = useParams<{ school_id: string }>()
  const [report, setReport] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const school = report?.[0]
  const reports = school?.reports ?? []
  const hasData = reports.length > 0

  const navigate = useNavigate()
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  )

  // 🧠 Load data immediately and extract reports[]
  async function loadReport() {
    try {
      setLoading(true)
      const json = await fetchWithAuth(`${API_PURCHASE}${API_NISN}/${nisn}`)

      const parsed = reportDataSchema.parse(json) 

      setReport(parsed) // parsed has correct types

    } catch (err) {
      toast.error("Terjadi kesalahan saat mengambil data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (nisn) {
      loadReport()
    }
  }, [])

  const availableYears = useMemo(() => {
    const years = new Set<string>()
    report?.forEach((school: any) => {
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
  }, [report])

if (loading) return <p>Loading...</p>

if (!report.length) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-muted-foreground text-lg">
        Tidak ada data untuk sekolah ini.
      </p>
    </div>
  ) 
}
return (
  <div className="flex flex-1 flex-col">
    <SiteHeader title="Sekolah" />

    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex flex-1 flex-col gap-2 md:gap-4 bg-background relative lg:px-6 px-2">
          
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
            <Button variant={"outline"} size={"lg"} className="text-blue-500" onClick={() => navigate( `/superadmin/sekolah`)}>
              <IconArrowLeft /> Kembali
            </Button>
              <span className="text-2xl font-bold">
                Rekap {school.school_name}
              </span>
            </div>

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

          {/* 🟡 EMPTY STATE */}
          {!hasData ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground text-lg">
                Belum ada laporan untuk sekolah ini.
              </p>
            </div>
          ) : (
            <>
              {/* 📊 Charts */}
              <div className="grid gap-y-4 gap-x-6 md:grid-cols-[30%_auto]">
                <ChartPieLegendFundSpend reports={report} year={selectedYear} />
                <ChartAreaFundVsSpend
                  chartData={report}
                  selectedYear={selectedYear}
                />
              </div>

              {/* 📋 Table */}
              <div className="w-full flex flex-col items-start gap-y-4">
                <DataTable
                  report={reports}
                  nisn={school.nisn}
                  selectedYear={selectedYear}
                  isSuperAdmin={true}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
)

}
