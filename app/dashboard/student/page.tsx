// app/dashboard/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  Target,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
// import { apiClient } from '@/lib/api/client'
import apiClient from '@/lib/api/client'

interface DashboardData {
  user: any
  stats: {
    totalCourses: number
    todayClasses: number
    unreadMessages: number
    pendingAssignments: number
    attendance: number
    averageGrade: number
  }
  upcomingClasses: Array<{
    time: string
    subject: string
    teacher: string
    room: string
  }>
  recentGrades: Array<{
    subject: string
    grade: number
    date: string
    topic: string
    teacher: string
  }>
}

export default function StudentDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profile, stats, classes, grades] = await Promise.all([
          apiClient.get('/auth/profile'),
          apiClient.get('/students/dashboard/stats'),
          apiClient.get('/students/upcoming-classes'),
          apiClient.get('/students/recent-grades'),
        ])

        setData({
          user: profile.data,
          stats: stats.data,
          upcomingClasses: classes.data,
          recentGrades: grades.data,
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data) return null

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
              Salom, {data.user?.firstName}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {data.upcomingClasses?.length > 0 
                ? `Bugun sizning ${data.upcomingClasses.length} ta darsingiz bor. ${data.upcomingClasses[0]?.subject} darsi ${data.upcomingClasses[0]?.time} da boshlanadi.`
                : 'Bugun darslaringiz yo\'q. Dam oling!'
              }
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.stats?.attendance}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Davomat</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.stats?.averageGrade}</div>
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
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{data.stats?.totalCourses}</div>
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
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{data.stats?.todayClasses}</div>
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
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{data.stats?.unreadMessages}</div>
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
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{data.stats?.pendingAssignments}</div>
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
          {/* Upcoming Classes */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Yaqinlashayotgan Darslar
              </CardTitle>
              <CardDescription>Bugungi va ertangi darslar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.upcomingClasses?.map((cls, index) => (
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

          {/* Recent Grades */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                So'nggi Baholar
              </CardTitle>
              <CardDescription>Oxirgi baholangan darslar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentGrades?.map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        grade.grade >= 4.5 ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                        grade.grade >= 3.5 ? 'bg-blue-100 dark:bg-blue-900/30' :
                        'bg-amber-100 dark:bg-amber-900/30'
                      }`}>
                        <TrendingUp className={`h-5 w-5 ${
                          grade.grade >= 4.5 ? 'text-emerald-600' :
                          grade.grade >= 3.5 ? 'text-blue-600' :
                          'text-amber-600'
                        }`} />
                      </div>
                      <div>
                        <div className="font-medium">{grade.subject}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{grade.topic}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        grade.grade >= 4.5 ? 'text-emerald-600' :
                        grade.grade >= 3.5 ? 'text-blue-600' :
                        'text-amber-600'
                      }`}>
                        {grade.grade}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{grade.date}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 gap-2" asChild>
                <Link href="/dashboard/grades">
                  Barcha baholar
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
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
                {[
                  { label: 'Dars jadvali', icon: Calendar, href: '/dashboard/schedule' },
                  { label: 'Mening kurslarim', icon: BookOpen, href: '/dashboard/courses' },
                  { label: 'Xabarlar', icon: MessageSquare, href: '/dashboard/chat', badge: data.stats?.unreadMessages },
                  { label: 'Uy vazifalari', icon: FileText, href: '/dashboard/materials', badge: data.stats?.pendingAssignments },
                ].map((action, index) => (
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
                      <div className="flex-1 text-left">{action.label}</div>
                      {action.badge && action.badge > 0 && (
                        <Badge className="bg-primary">{action.badge}</Badge>
                      )}
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Bildirishnomalar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <Bell className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm">Yangi uy vazifasi qo'shildi</p>
                      <p className="text-xs text-gray-500">5 daqiqa oldin</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}