
import { DataTable } from "@/components/table/admin/admin-table-dashboard"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { AdminLayout } from "../layout/adminLayout"
import {
  SidebarInset,
} from "@/components/ui/sidebar"

import data from "@/models/dummy/data.json"

export default function Page() {
  return (
    <AdminLayout>
      <SidebarInset>
        <SiteHeader title="Dashboard" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </AdminLayout>
  )
}
