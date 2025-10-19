import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";

export function AdminLayout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />

      {/* Page content area */}
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
