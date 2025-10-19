import { 
  // GalleryVerticalEnd, 
  // AudioWaveform, 
  Book,
  // BookOpen,
  LayoutDashboard,
  ArrowRightLeft,
  
  // Bot, 
  // Command, 
  Settings2,  } from "lucide-react"

export const Dropdown= {
  user: {
    name: "Saiful",
    sekolah: "SMA Muhammadiyah 3 Batu",
    email: "o9C9t@example.com",
  },
  navMain: [
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
      title: "Pergeseran",
      url: "#",
      icon: ArrowRightLeft,
      isActive: true,
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