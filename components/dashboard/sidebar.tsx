// components/dashboard/sidebar.tsx
"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  FileText, 
  Users, 
  BarChart, 
  Settings,
  GraduationCap,
  Home,
  Clock,
  Award
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/lib/hooks/useAuth'
import { UserRole } from '@/types/user'

const studentNavItems = [
  { href: '/dashboard/student', label: 'Asosiy', icon: LayoutDashboard },
  { href: '/dashboard/student/schedule', label: 'Dars Jadvali', icon: Calendar },
  { href: '/dashboard/student/courses', label: 'Mening Kurslarim', icon: BookOpen },
  { href: '/dashboard/student/materials', label: 'O\'quv Materiallari', icon: FileText },
  { href: '/dashboard/student/chat', label: 'Chat', icon: MessageSquare },
  { href: '/dashboard/student/grades', label: 'Baholar', icon: BarChart },
  { href: '/dashboard/student/progress', label: 'Progress', icon: Award },
  { href: '/dashboard/student/attendance', label: 'Davomat', icon: Clock },
]

const teacherNavItems = [
  { href: '/dashboard/teacher', label: 'Asosiy', icon: LayoutDashboard },
  { href: '/dashboard/teacher/schedule', label: 'Dars Jadvali', icon: Calendar },
  { href: '/dashboard/teacher/courses', label: 'Kurslarim', icon: BookOpen },
  { href: '/dashboard/teacher/students', label: 'O\'quvchilar', icon: Users },
  { href: '/dashboard/teacher/materials', label: 'Materiallar', icon: FileText },
  { href: '/dashboard/teacher/chat', label: 'Chat', icon: MessageSquare },
  { href: '/dashboard/teacher/grades', label: 'Baholash', icon: BarChart },
  { href: '/dashboard/teacher/analytics', label: 'Analitika', icon: Award },
]

export function DashboardSidebar() {
  const{ user } = useAuth()
  const pathname = usePathname()
  const userRole: UserRole = user?.role || UserRole.GUEST // Bu keyin backenddan keladi
  const navItems = userRole === UserRole.TEACHER ? teacherNavItems : studentNavItems

  return (
    <div className="flex h-full flex-col border-r bg-white dark:bg-gray-900">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">Ta`lim Olami</span>
        </Link>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-lg">
              {user?.firstName?.[0]}{user?.lastName?.[0] || "SA"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{user?.firstName} {user?.lastName}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{user?.role}</div>
          </div>
        </div>
        <Link href="/dashboard" className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="w-full mt-4 rounded-lg">
          <Home className="h-4 w-4 mr-2" />
          Bosh sahifaga
        </Button></Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-800",
                isActive 
                  ? "bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/30 dark:to-emerald-900/30 text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t p-4">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-800",
            pathname === '/dashboard/settings'
              ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
              : "text-gray-700 dark:text-gray-300"
          )}
        >
          <Settings className="h-5 w-5" />
          Sozlamalar
        </Link>
      </div>
    </div>
  )
}