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
// import { useState } from "react"
// This is sample data.

//   projects: [
//     {
//       name: "Design Engineering",
//       url: "#",
//       icon: Frame,
//     },
//     {
//       name: "Sales & Marketing",
//       url: "#",
//       icon: PieChart,
//     },
//     {
//       name: "Travel",
//       url: "#",
//       icon: Map,
//     },
//   ],
// }

// const [open, setOpen] = useState(false)
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
            <img src="/images/logo.png" alt="logo" className="mx-auto w-24 h-auto" />
            <div className="text-center text-2xl font-bold text-primary">DIKDASMEN<br/>PDM BATU</div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={Dropdown.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={Dropdown.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
