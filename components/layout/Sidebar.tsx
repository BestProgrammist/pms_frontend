"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  FileText,
  Truck,
  Users,
  Calendar,
  BarChart3,
  Folder,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  Building,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "../providers/AuthProvider"

const navItems = [
  { name: "Bosh Sahifa", href: "/dashboard", icon: Home },
  { name: "Vagon turlari", href: "/dashboard/vagontypes", icon: Truck},
  { name: "Vagonlar", href: "/dashboard/vagons", icon: Truck},
  { name: "Vagon ta'mir muddatlari", href: "/dashboard/vagon-tamir-muddatlari", icon: Truck},
  { name: "Ta'mir turlari", href: "/dashboard/tamir-turlari", icon: FileText },
  // { name: "Bo'limlar", href: "/departments", icon: FileText, badge: 5 },
  // { name: "Lokomotivlar", href: "/locomotives", icon: Truck, badge: 42  },
  { name: "Xodimlar", href: "/dashboard/users", icon: Users },
  { name: "Ta'mir jadvallari", href: "/dashboard/tamir-jadvallari", icon: FileText },
  { name: "Tashkilotlar", href: "/dashboard/tashkilot", icon: Home },
  // { name: "Uzel agregatlari", href: "/uzelagregats", icon: FileText, badge: 7 },
  // { name: "Kalendar", href: "/calendar", icon: Calendar },
  { name: "Hisobotlar", href: "/dashboard/reports", icon: BarChart3 },
  // { name: "Arxiv", href: "/archive", icon: Folder },
  { name: "Sozlamalar", href: "/dashboard/settings", icon: Settings },
]

export default function Sidebar() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`flex flex-col border-r bg-card transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
      {/* Logo */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold">PMS</h1>
              <p className="text-sm text-muted-foreground">Tashkiloti</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Button
              key={item.name}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start h-10 ${collapsed ? "px-2" : "px-3"}`}
            >
              <Link href={item.href} title={collapsed ? item.name : ""}>
                <Icon className="h-4 w-4" />
                {!collapsed && (
                  <>
                    <span className="ml-3">{item.name}</span>
                    {/* {item.badge && (
                      <Badge className="ml-auto" variant="destructive">
                        {item.badge}
                      </Badge>
                    )} */}
                  </>
                )}
              </Link>
            </Button>
          )
        })}
      </nav>

      <Separator />

      {/* User Profile */}
      <div className={`p-3 ${collapsed ? "flex justify-center" : ""}`}>
        <div className={`flex items-center ${collapsed ? "justify-center" : ""}`}>
          <Avatar className="h-8 w-8">
            {/* <AvatarImage src="/avatar.jpg" alt="Akmal Rajabov" /> */}
            <AvatarFallback className="bg-primary text-primary-foreground">AR</AvatarFallback>
          </Avatar>
          
          {!collapsed && (
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
          )}
          
          <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}