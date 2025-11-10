import { IconHome } from "@tabler/icons-react"
import { 
  // GalleryVerticalEnd, 
  // AudioWaveform, 
  Book,
  // BookOpen,
  LayoutDashboard,
  
  // Bot, 
  // Command, 
  Settings2,  } from "lucide-react"

export const Dropdown= {

  navMain: [
    {
      title: "Dashboard Publik",
      url: "/public-dashboard",
      icon: IconHome,
    },
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Laporan",
      url: "#",
      icon: Book,
      items: [
        {
          title: "Pembelanjaan",
          url: "/admin/pembelanjaan",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  admin: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Laporan",
      url: "#",
      icon: Book,
      items: [
        {
          title: "Pembelanjaan",
          url: "/admin/pembelanjaan",
        },
      ],
    },
    {
      title: "Halaman Utama",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  
  ]
}