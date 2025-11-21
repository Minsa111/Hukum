import { DataTable } from "@/components/table/admin/admin-table-reportactivity";
import { SectionCard } from "@/components/cards/section-cards-activty";
import { useParams } from "react-router-dom";
import * as React from "react";
import { fetchWithAuth } from "@/controllers/fetchwithauths";
import { useNavigate } from "react-router-dom";
import { API_PUBLIC, API_PURCHASE } from "@/api/api";
import { toast } from "sonner";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function Page() {
  const [openDialogReport, setOpenDialogReport] = React.useState(false);
  const { purchase_report_id } = useParams<{ purchase_report_id: string }>()
  const { nisn } = useParams<{ nisn: string }>()
  const [report, setReport] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedYear, setSelectedYear] = React.useState<string>(new Date().getFullYear().toString());
  const navigate = useNavigate();

  async function loadReport(id: string) {
    try {
      const data = await fetchWithAuth(`${API_PURCHASE}${API_PUBLIC}/${id}`);
      console.log("✅ Report:", data);
      setReport(data);
    } catch (err) {
      toast.error("Terjadi kesalahan saat mengambil data: " + err);
      console.error("❌ Error fetching report:", err);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (purchase_report_id) {
      setLoading(true)
      loadReport(purchase_report_id);
    }
  }, [purchase_report_id]);

  if (loading!) {
    return (
      <div className="flex flex-1 flex-col">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-2 bg-background relative lg:px-16 px-2 w-full">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex justify-between items-center px-2 md:px-6">
            <div className="flex flex-col items-start">
              <span className="text-md lg:text-2xl font-bold items-start">{report?.school?.school_name}</span>
              <span className="text-md lg:text-lg font-semibold items-start">Laporan Pembelanjaan: {report?.title}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-2 justify-between px-2 md:px-6">
            <div className="flex flex-col items-start">
              <span className="text-xs sm:text-sm items-start">Terakhir Dibuat: {new Date(report?.created_at).toLocaleString('en-GB')}</span>
              <span className="text-xs sm:text-sm items-start">Terakhir Diperbarui: {new Date(report?.updated_at).toLocaleString('en-GB')}</span>
              <span className="text-xs sm:text-sm items-start">Sumber Dana: {report?.source_of_fund}</span>
            </div>
            <div className="flex flex-row gap-2">
              <SectionCard title="Dana Anggaran" >
                Rp. {report?.budget_amount.toLocaleString('id-ID')}
              </SectionCard>
              <SectionCard title="Sisa Dana" >
                Rp. {report?.remaining_fund.toLocaleString('id-ID')}
              </SectionCard>
              <SectionCard title="Dana Realisasi" >
                Rp. {report?.realization_amount.toLocaleString('id-ID')}
              </SectionCard>
              <SectionCard title="Jumlah Kegiatan"  >
                {report?.activities?.length}
              </SectionCard>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 py-2 md:gap-6 md:py-6">
          <DataTable activities={report?.activities} isPublic={true} onDataChange={() => loadReport(purchase_report_id!)} />
        </div>
      </div>
    </div>
  );
}
