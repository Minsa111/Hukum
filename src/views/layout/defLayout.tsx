import { Navbar } from "@/components/navbar";
import { Outlet } from "react-router-dom";
export function NavLayout() {
    return (
    <div
        style={
          {
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
        className="flex flex-col min-h-screen"
        >
        <Navbar />
        <Outlet />
    </div>
    );
}
