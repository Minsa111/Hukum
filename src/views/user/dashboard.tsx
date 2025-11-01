// src/app/dashboard/page.tsx
import { DataTable } from "@/components/table/admin/admin-table-dashboard"
import { SectionCards } from "@/components/cards/section-cards"
import { SiteHeader } from "@/components/site-header"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { useReports } from "@/api/hooks/use-report"

export default function Page() {
  const school_id = localStorage.getItem("school_id")
  const { data: report, loading, error} = useReports(school_id)

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">Error loading reports.</p>

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader title="Dashboard" />
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards data={report} />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive chartData={report} />
          </div>
          <DataTable data={report} />
        </div>
      </div>
    </div>
  )
}
