import { DataTable } from "@/components/table/superadmin/account-table"
import { SiteHeader } from "@/components/site-header"
import { fetchWithAuth } from "@/controllers/fetchwithauths"
import { useState, useEffect } from "react";
import { API_ACCOUNT, API_AUTH } from "@/api/api";
import { toast } from "sonner";

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  async function loadReport() {
    try {
      setLoading(true);
      const report = await fetchWithAuth(`${API_AUTH}${API_ACCOUNT}`);
      setData(report);
    } catch (err) {
      // console.error("❌ Error fetching report:", err);
      toast.error("Terjadi kesalahan saat mengambil data: " + err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, []);

  if (loading) return <p>Loading...</p>

return (
  <div className="flex flex-1 flex-col">
    <SiteHeader title="Akun" />
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <DataTable report={data} onDataChange={loadReport}/>
      </div>
    </div>
  </div>
)
}
