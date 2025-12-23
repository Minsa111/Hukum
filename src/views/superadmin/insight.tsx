// src/app/dashboard/page.tsx
import { DataTable } from "@/components/table/public/public-dashboard-table"
import { SectionCards } from "@/components/cards/section-cards"
import { SiteHeader } from "@/components/site-header"
import { ChartAreaInteractive } from "@/components/chart/chart-area-interactive"
import { fetchWithAuth } from "@/controllers/fetchwithauths"
import { useEffect, useMemo, useState} from "react"
import { API_PURCHASE, API_PUBLIC_ALL} from "@/api/api"
import { ChartPieLegendFundSpend } from "@/components/piechart/fund-spend-pie-chart"
import { ChartAreaFundVsSpend } from "@/components/chart/spend-fund-chart-area-interactive"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Page() {
  const [report, setReport] = useState<any>(null);
  const [schoolReport, setSchoolReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("Semua");
  async function loadReport () {
    try {
      setLoading(true);
      const data = await fetchWithAuth(`${API_PURCHASE}`);
      const secData = await fetchWithAuth(`${API_PURCHASE}${API_PUBLIC_ALL}`);
      setReport(data);
      setSchoolReport(secData);
    } catch (err) {
        console.error("❌ Error fetching report:", err);
    }finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, []);
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

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader title="Insight" />
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
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
          <SectionCards data={report} />
          <div className="grid gap-y-4 gap-x-6 md:grid-cols-[30%_auto]">
            <ChartPieLegendFundSpend reports={report} year={selectedYear} />
            <ChartAreaFundVsSpend chartData={report} selectedYear={selectedYear}/>
          </div>
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive chartData={report} />
          </div>
          <DataTable reports={schoolReport} selectedYear="Semua" isSuperAdmin = {true}/>
        </div>
      </div>
    </div>
  )
}
