
import { DataTable } from "@/components/table/superadmin/superadmin-report-table"
import { SiteHeader } from "@/components/site-header"
import { API_PURCHASE, API_PUBLIC_ALL } from "@/api/api";
import { fetchWithAuth } from "@/controllers/fetchwithauths";
import { useEffect, useState} from "react"

export default function Page() {
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    async function loadReport () {
      try {
        setLoading(true);
        const data = await fetchWithAuth(`${API_PURCHASE}${API_PUBLIC_ALL}`);
        setReport(data);
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
      <SiteHeader title="Pembelanjaan" />
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DataTable report = {report} selectedYear="Semua"/>
        </div>
      </div>
    </div>
  )
}
