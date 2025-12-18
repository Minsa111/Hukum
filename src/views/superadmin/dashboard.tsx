// src/app/dashboard/page.tsx
import { DataTable } from "@/components/table/public/public-dashboard-table"
import { SectionCards } from "@/components/cards/section-cards"
import { SiteHeader } from "@/components/site-header"
import { ChartAreaInteractive } from "@/components/chart/chart-area-interactive"
import { fetchWithAuth } from "@/controllers/fetchwithauths"
import { useEffect, useState} from "react"
import { API_PURCHASE, API_PUBLIC_ALL} from "@/api/api"

export default function Page() {
  const [report, setReport] = useState<any>(null);
  const [schoolReport, setSchoolReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <p>Loading...</p>

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader title="Dashboard" />
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards data={report} />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive chartData={report} />
          </div>
          <DataTable reports={schoolReport} selectedYear="Semua"/>
        </div>
      </div>
    </div>
  )
}
