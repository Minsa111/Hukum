import * as React from "react"
import { Dropdown } from "@/models/sidebarmenu"

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
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  isSuperAdmin: boolean;
}

export function AppSidebar({ isSuperAdmin, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarContent className="flex gap-0 py-1">
          <img className="" src="/images/logoname.png" alt="logo" />
        </SidebarContent>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={isSuperAdmin ? Dropdown.admin : Dropdown.navMain}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser isSuperAdmin={isSuperAdmin}/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

