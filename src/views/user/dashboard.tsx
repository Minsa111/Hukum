import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/admin/admin-table-dashboard"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { AdminLayout } from "../layout/soonerLayout"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "@/models/dummy/data.json"

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader title="Dashboard" />
        <AdminLayout>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <DataTable data={data} />
            </div>
          </div>
        </AdminLayout>
      </SidebarInset>
    </SidebarProvider>
  )
}
