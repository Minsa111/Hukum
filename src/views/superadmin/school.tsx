
import { DataTable } from "@/components/table/superadmin/school-table"
import { SiteHeader } from "@/components/site-header"
import { API_PURCHASE, API_PUBLIC_ALL } from "@/api/api";
import { fetchWithAuth } from "@/controllers/fetchwithauths";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartPieLegendSpend } from "@/components/piechart/spend-pie-chart";
import { ChartPieLegendFund } from "@/components/piechart/fund-pie-chart";
import { Button } from "@/components/ui/button";
import { SchoolAddDialog } from "@/components/dialog/school-add-dialog";
import { IconPlus } from "@tabler/icons-react";
export default function Page() {
  const [loading, setLoading] = useState(true)
  const [report, setReport] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [openDialogAddSchool, setOpenDialogAddSchool] = useState(false);



  async function loadReport() {
    try {
      setLoading(true);
      const data = await fetchWithAuth(`${API_PURCHASE}${API_PUBLIC_ALL}`);
      setReport(data);
    } catch (err) {
      console.error("❌ Error fetching report:", err);
      toast.error("Terjadi kesalahan saat mengambil data: " + err);
    } finally {
      setLoading(false);
    }
  }
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

  useEffect(() => {
    loadReport();
  }, []);

  if (loading) return <p>Loading...</p>
  return (
    <div className="flex flex-1 flex-col">
      <SchoolAddDialog open={openDialogAddSchool} onOpenChange={setOpenDialogAddSchool} onSuccess={loadReport} />
      <SiteHeader title="Sekolah"/>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex justify-end items-center px-2 md:px-6">
            <div className="flex gap-2">
              <Button onClick={() => setOpenDialogAddSchool(true)}><IconPlus className="w-4 h-4" /> Tambah Sekolah </Button>
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
          </div>
          <div className="grid gap-y-4 gap-x-6 md:grid-cols-2 mx-0 md:mx-6 lg:mx-6">
            <ChartPieLegendFund reports={report} year={selectedYear} />
            <ChartPieLegendSpend reports={report} year={selectedYear} />
          </div>
          <DataTable reports={report} selectedYear={selectedYear} isSuperAdmin={true}/>
        </div>
      </div>
    </div>
  )
}
