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
import { useNavigate } from "react-router-dom";
import { ReportShopActivityDialog } from "@/components/dialog/activity-add-dialog";

export default function Page() {
  const [openDialogReport, setOpenDialogReport] = React.useState(false);
  const { purchase_report_id } = useParams<{ purchase_report_id: string }>()
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 flex-col">
      
      <ReportShopActivityDialog   
        open={openDialogReport}
        onOpenChange={setOpenDialogReport}
        onSuccess={loadReport} 
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
                <Button variant={"outline"} size={"lg"} className="hidden sm:inline-flex"onClick={()=>setOpenDialogEditReport(true)}><IconEdit /> Edit Laporan</Button>
                <Button variant={"outline"} size={"default"} className="sm:hidden text-xs" onClick={()=>setOpenDialogEditReport(true)}><IconEdit /> Edit Laporan</Button>
              </div>
              <div className="flex flex-row gap-2">
                <Button variant={"outline"} size={"lg"} className="hidden sm:inline-flex"><IconCashBanknoteEdit /> Edit Sumber Dana</Button>
                <Button variant={"outline"} size={"default"} className="sm:hidden text-xs"><IconCashBanknoteEdit/> Edit Sumber Dana</Button>
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
            <div className="flex flex-row gap-2">
              <SectionCard title="Dana Anggaran" fund={report?.budget_amount}/>
              <SectionCard title="Dana Realisasi" fund={report?.realization_amount}/>
              {report?.remaining_fund > 0 ?
              <SectionCard title="Sisa Dana" fund={report?.remaining_fund}/>:
              <SectionCard title="Sisa Dana"  fund={report?.remaining_fund}/>
              }
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
