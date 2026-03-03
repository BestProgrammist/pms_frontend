// app/dashboard/page.tsx
"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Clock, 
  Award,
  ChevronRight,
  Bell,
  Users,
  Target
} from 'lucide-react'
import { ScheduleCalendar } from '@/components/dashboard/schedule-calendar'
// import { ChatNotifications } from '@/components/dashboard/chat-notifications'
import Link from 'next/link'
import { ChatNotifications } from '@/components/dashboard/chat-notifications'

const upcomingClasses = [
  { time: '09:00', subject: 'Matematika', teacher: 'Azizova M.', room: '302' },
  { time: '11:00', subject: 'Fizika', teacher: 'Rahimov A.', room: '305' },
  { time: '14:00', subject: 'Ingliz tili', teacher: 'Karimova S.', room: '401' },
]

const recentGrades = [
  { subject: 'Matematika', grade: 5, date: '15.01.2024', max: 5 },
  { subject: 'Fizika', grade: 4, date: '12.01.2024', max: 5 },
  { subject: 'Ingliz tili', grade: 5, date: '10.01.2024', max: 5 },
]

const quickActions = [
  { label: 'Uy vazifasi', icon: BookOpen, count: 3, href: '/dashboard/materials' },
  { label: 'Yangi xabarlar', icon: MessageSquare, count: 5, href: '/dashboard/chat' },
  { label: 'Yaqinlashayotgan imtihon', icon: Bell, count: 1, href: '/dashboard/schedule' },
  { label: 'Topshiriqlar', icon: FileText, count: 2, href: '/dashboard/materials' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-transparent rounded-2xl p-6 lg:p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              Salom, Sardor! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Bugun sizning 3 ta darsingiz bor. Matematika darsi 9:00 da boshlanadi.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">95%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Davomat</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">4.8</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">O'rtacha baho</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">12</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Jami kurslar</div>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2 hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">3</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Bugungi darslar</div>
                </div>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Clock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2 hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">5</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Yangi xabarlar</div>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">3</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Uy vazifalari</div>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Schedule Calendar */}
          <ScheduleCalendar />

          {/* Recent Grades */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                So'nggi Baholar
              </CardTitle>
              <CardDescription>Oxirgi 3 ta bahoingiz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentGrades.map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        grade.grade === 5 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' :
                        grade.grade === 4 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                        'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                      }`}>
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{grade.subject}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{grade.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        grade.grade === 5 ? 'text-emerald-600' :
                        grade.grade === 4 ? 'text-blue-600' :
                        'text-amber-600'
                      }`}>
                        {grade.grade}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">/{grade.max}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 gap-2" asChild>
                <Link href="/dashboard/grades">
                  Barcha baholarni ko'rish
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Upcoming Classes */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Yaqinlashayotgan Darslar
              </CardTitle>
              <CardDescription>Bugungi darslar ro'yxati</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingClasses.map((cls, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div>
                      <div className="font-medium">{cls.subject}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{cls.teacher}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{cls.time}</div>
                      <Badge variant="outline" className="text-xs">{cls.room}</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 gap-2" asChild>
                <Link href="/dashboard/schedule">
                  To'liq jadval
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Tezkor Harakatlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start gap-3 h-auto py-3"
                    asChild
                  >
                    <Link href={action.href}>
                      <div className={`p-2 rounded-lg ${
                        index === 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                        index === 1 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' :
                        index === 2 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                        'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                      }`}>
                        <action.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div>{action.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {action.count} ta yangi
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Notifications */}
          <ChatNotifications />
        </div>
      </div>
    </div>
  )
}
