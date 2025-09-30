import { DataTable } from "@/components/data-table-admin"
import { SectionCards } from "@/components/section-cards"
// import { SiteHeader } from "@/components/site-header"
import { Navbar } from "@/components/navbar"

import data from "@/models/data.json"

export default function Page() {
  return (
    <div
      style={
        {
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      className="flex flex-col min-h-screen"
    >
      <Navbar/>
      {/* <SiteHeader title="Dashboard" /> */}

      {/* Main Content */}
      <main className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <DataTable data={data} />
          </div>
        </div>
      </main>
    </div>
  )
}
