import { DataTable } from "@/components/table/admin/admin-table-reportactivity";
import { SiteHeader } from "@/components/site-header";
import { SectionCard } from "@/components/cards/section-cards-activty";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogActionDestructive,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useParams } from "react-router-dom";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconPlus, IconEdit, IconTrash,  IconCashBanknoteEdit } from "@tabler/icons-react";
import { fetchWithAuth } from "@/controllers/fetchwithauths";
import { API_PURCHASE } from "@/api/api";
import { useNavigate } from "react-router-dom";
import { ReportShopActivityDialog } from "@/components/dialog/activity-add-dialog";
import { toast } from "sonner";
import { EditReportShopEdDialog } from "@/components/dialog/shop-report-edit-dialog";
import { EditFundDialog } from "@/components/dialog/edit-fund-source-dialog";

export default function Page() {
  const [openDialogReport, setOpenDialogReport] = React.useState(false);
  const [openDialogEditReport, setOpenDialogEditReport] = React.useState(false);
  const [openDialogEditFund, setOpenDialogEditFund] = React.useState(false);
  const { purchase_report_id } = useParams<{ purchase_report_id: string }>()
  const [report, setReport] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  async function deleteReport() {
    try {
      await fetchWithAuth(`${API_PURCHASE}/${purchase_report_id}`, {
        method: "DELETE",
      });
      navigate("/admin/pembelanjaan");
      toast.success("Laporan berhasil dihapus!");
    } catch (err) {
      console.error("❌ Error deleting report:", err);
    }
  }
  async function loadReport() {
    try {
      const data = await fetchWithAuth(`${API_PURCHASE}/${purchase_report_id}`);
      console.log("✅ Report:", data);
      setReport(data);
    } catch (err) {
        console.error("❌ Error fetching report:", err);
    } finally {
        setLoading(false);
    }
  }

  React.useEffect(() => {
    loadReport();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!report) return <p>No report found.</p>;
  return (
    <div className="flex flex-1 flex-col">
      
      <ReportShopActivityDialog   
        open={openDialogReport}
        onOpenChange={setOpenDialogReport}
        onSuccess={loadReport} 
      />
      
      <EditReportShopEdDialog   
        open={openDialogEditReport}
        onOpenChange={setOpenDialogEditReport}
        report={report}
        onSuccess={loadReport} 
      />
      <EditFundDialog   
        open={openDialogEditFund}
        onOpenChange={setOpenDialogEditFund}
        onSuccess={loadReport}
        report={report}
      />
      <SiteHeader title="Pembelanjaan" />
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="w-full flex flex-col px-4 lg:px-6 items-start pt-2 md:pt-6">
          <Button variant={"outline"} size={"lg"} className="text-blue-500" onClick={() => navigate(`/admin/pembelanjaan`)}>
            <IconArrowLeft /> Kembali
          </Button>
          <div className="w-full flex flex-col lg:flex-row items-start md:items-center justify-between gap-4 py-2 md:gap-6 md:py-4">
            <span className="text-md lg:text-2xl font-bold items-start">{report?.title}</span>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex flex-row gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                <Button variant={"outline"} size={"lg"} className="text-xs sm:text-sm sm:inline-flex text-red-500"><IconTrash /> Hapus Laporan</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah anda yakin ingin menghapus data laporan ini, aksi ini tidak dapat dibatalkan
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogActionDestructive onClick={deleteReport}>Lanjutkan</AlertDialogActionDestructive>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
                <Button variant={"outline"} size={"lg"} className="hidden sm:inline-flex"onClick={()=>setOpenDialogEditReport(true)}><IconEdit /> Edit Laporan</Button>
                <Button variant={"outline"} size={"default"} className="sm:hidden text-xs" onClick={()=>setOpenDialogEditReport(true)}><IconEdit /> Edit Laporan</Button>
              </div>
              <div className="flex flex-row gap-2">
                <Button variant={"outline"} size={"lg"} className="hidden sm:inline-flex"onClick={()=>setOpenDialogEditFund(true)}><IconCashBanknoteEdit /> Edit Sumber Dana</Button>
                <Button variant={"outline"} size={"default"} className="sm:hidden text-xs"onClick={()=>setOpenDialogEditFund(true)}><IconCashBanknoteEdit /> Edit Sumber Dana</Button>
                <Button variant={"default"} size={"lg"} className="hidden sm:inline-flex" onClick={() => setOpenDialogReport(true)}><IconPlus /> Tambah Kegiatan</Button>
                <Button variant={"default"} size={"default"} className="sm:hidden text-xs"onClick={() => setOpenDialogReport(true)}><IconPlus /> Tambah Kegiatan</Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full items-start md:items-center gap-2 justify-between">
            <div className="flex flex-col items-start">
              <span className="text-xs sm:text-sm items-start">Terakhir Dibuat: {new Date(report?.created_at).toLocaleString('en-GB')}</span>
              <span className="text-xs sm:text-sm items-start">Terakhir Diperbarui: {new Date(report.updated_at).toLocaleString('en-GB')}</span>
              <span className="text-xs sm:text-sm items-start">Sumber Dana: {report.source_of_fund}</span>
            </div>
            <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-2">
              <div className="flex flex-row gap-2">
                <SectionCard title="Dana Anggaran">
                  Rp. {report?.budget_amount.toLocaleString("id-ID")}
                </SectionCard>
                <SectionCard title="Dana Realisasi" >
                  Rp. {report?.realization_amount.toLocaleString("id-ID")}
                </SectionCard>
              </div>
              <div className="flex flex-row gap-2">
                <SectionCard title="Sisa Dana">
                  Rp. {report?.remaining_fund.toLocaleString("id-ID")}
                </SectionCard>
                <SectionCard title="Jumlah Kegiatan">
                  {report?.activities.length}
                </SectionCard>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 py-2 md:gap-6 md:py-6">
          <DataTable activities = {report.activities} onDataChange={loadReport}/>
        </div>
      </div>
    </div>
  );
}
