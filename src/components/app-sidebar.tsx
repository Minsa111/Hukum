import * as React from "react"
import { SingleMenu, Dropdown } from "@/models/sidebarmenu"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { NavProjects } from "./nav-projects"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div>
          <AspectRatio ratio={1/1}>
            <img src="/images/logo.png" alt="logo" className="mx-auto w-24 h-auto" />
          </AspectRatio>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={SingleMenu.projects} />
        <NavMain items={Dropdown.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={Dropdown.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
