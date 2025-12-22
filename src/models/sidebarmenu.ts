import { IconHome, IconSchool } from "@tabler/icons-react"
import {
  Book,
  LayoutDashboard,
  UserCog,
} from "lucide-react"

export const Dropdown= {

  navMain: [
    {
      title: "Dashboard Beranda",
      url: "/",
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
        {
          title: "Insight",
          url: "/admin/pembelanjaan",
        },
      ],
    },
  ],
  admin: [
    {
      title: "Dashboard Beranda",
      url: "/",
      icon: IconHome,
    },
    {
      title: "Dashboard",
      url: "/superadmin",
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
          url: "/superadmin/pembelanjaan",
        },
        {
          title: "Insight",
          url: "/superadmin/insight",
        },
      ],
    },
    {
      title: "Akun Pengguna",
      url: "/superadmin/akun",
      icon: UserCog,
    },
    {
      title: "Sekolah",
      url: "/superadmin/sekolah",
      icon: IconSchool,
    },
  
  ]
}