
import { DataTable } from "@/components/table/admin/admin-table-dashboard"
import { SectionCards } from "@/components/cards/section-cards"
import { SiteHeader } from "@/components/site-header"
import { useState, useEffect } from "react"
import { fetchWithAuth } from "@/controllers/fetchwithauths"
import { API_PURCHASE, API_SCHOOL } from "@/api/api"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"

export default function Page() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const school_id = localStorage.getItem("school_id");
  useEffect(() => {

    async function loadReport() {
      try {
        const data = await fetchWithAuth(`${API_PURCHASE}${API_SCHOOL}/${school_id}`);
        console.log("✅ Report:", data);
        setReport(data);
      } catch (err) {
        console.error("❌ Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  });
  if (loading) return <p>Loading...</p>;
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader title="Dashboard" />
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
                <ChartAreaInteractive chartData={report}/>
              </div>
          <DataTable data={report} />
        </div>
      </div>
    </div>
  )
}