
import { DataTable } from "@/components/table/admin/admin-table-dashboard"
import { SectionCards } from "@/components/cards/section-cards"
import { SiteHeader } from "@/components/site-header"
import data from "@/models/dummy/data.json"
import { fetchWithAuth } from "@/controllers/fetchwithauths"

export default function Page() {
  return (
    
    <div className="flex flex-1 flex-col">
        <SiteHeader title="Dashboard" />
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <DataTable data={data} />
            </div>
          </div>
        </div>
    
  )
}