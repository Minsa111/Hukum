import * as React from "react"
import { Dropdown } from "@/models/sidebarmenu"

// import { NavProjects } from "./nav-projects"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// const [open, setOpen] = useState(false)
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarContent className="gap-0 py-1">
            <p className="text-blue-500 text-2xl font-black">FINSIGHT</p>
            <p className="text-blue-500 text-lg font-semibold">Financial Insight</p>
          </SidebarContent>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={Dropdown.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
