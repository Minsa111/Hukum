import { DataTable } from "@/components/admin/admin-table-dashboard"
import { ChartPieLegendFund} from "@/components/pie-chart-fund"
import { ChartPieLegendSpend } from "@/components/pie-chart-spend"
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
        <div className="flex flex-1 flex-col gap-2 bg-background relative px-16 w-full">
          <div className="@container/main flex flex-1 flex-col gap-2 ">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="grid gap-y-4 gap-x-6 lg:grid-cols-2 mx-0 lg:mx-6">
                <ChartPieLegendFund />
                <ChartPieLegendSpend />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
    </div>
  )
}
