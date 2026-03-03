// app/dashboard/teacher/page.tsx
"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Clock, 
  Award,
  ChevronRight,
  BarChart,
  Calendar,
  Target,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

const teacherStats = [
  { label: 'Jami O\'quvchilar', value: '45', icon: Users, color: 'bg-blue-500' },
  { label: 'Faol Kurslar', value: '3', icon: BookOpen, color: 'bg-emerald-500' },
  { label: 'Jarayondagi Topshiriqlar', value: '15', icon: FileText, color: 'bg-amber-500' },
  { label: 'Yangi Xabarlar', value: '8', icon: MessageSquare, color: 'bg-purple-500' },
]

const recentStudents = [
  { name: 'Aliyev Jahongir', group: '9B Matematika', progress: 85, avatar: 'AJ' },
  { name: 'Karimova Diyora', group: '9B Matematika', progress: 92, avatar: 'KD' },
  { name: 'Yusupov Farrux', group: '9B Matematika', progress: 78, avatar: 'YF' },
  { name: 'Rahimova Malika', group: '9B Matematika', progress: 95, avatar: 'RM' },
]

const upcomingTasks = [
  { task: 'Algebra testini tayyorlash', deadline: 'Bugun 18:00', priority: 'high' },
  { task: 'O\'quvchilar baholarini kiritish', deadline: 'Ertaga 12:00', priority: 'medium' },
  { task: 'Video dars yuklash', deadline: 'Hafta oxiri', priority: 'low' },
]

export default function TeacherDashboardPage() {
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
              Salom, Malika ustoz! 👩‍🏫
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Bugun sizning 2 ta darsingiz bor. 9B guruhi uchun algebra darsi soat 9:00 da.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-1.5">
              <CheckCircle className="h-4 w-4 mr-2" />
              Active
            </Badge>
            <Button className="gap-2" asChild>
              <Link href="/dashboard/teacher/schedule">
                <Calendar className="h-4 w-4" />
                Dars jadvali
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teacherStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-2 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                  </div>
                  <div className={`p-3 ${stat.color}/10 rounded-lg`}>
                    <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Students Progress */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                O'quvchilar Progressi
              </CardTitle>
              <CardDescription>Eng yuqori natijaga ega o'quvchilar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentStudents.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                        {student.avatar}
                      </div>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{student.group}</div>
                      </div>
                    </div>
                    <div className="w-48">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span className="font-semibold">{student.progress}%</span>
                      </div>
                      <Progress value={student.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 gap-2" asChild>
                <Link href="/dashboard/teacher/students">
                  Barcha o'quvchilarni ko'rish
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Course Analytics */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Kurslar Analitikasi
              </CardTitle>
              <CardDescription>O'rtacha baholar va o'qitish samaradorligi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { course: 'Algebra', avgGrade: 4.2, completion: 85, students: 45 },
                  { course: 'Geometriya', avgGrade: 4.5, completion: 92, students: 45 },
                  { course: 'Matematik Analiz', avgGrade: 3.8, completion: 72, students: 30 },
                ].map((course, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{course.course}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {course.students} o'quvchi
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">O'rtacha baho</div>
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold">{course.avgGrade}</div>
                          <Badge variant="outline" className="text-xs">
                            /5
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Kursni tugatish</div>
                        <div className="flex items-center gap-2">
                          <Progress value={course.completion} className="flex-1 h-2" />
                          <div className="text-sm font-semibold">{course.completion}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Upcoming Tasks */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Yaqinlashayotgan Vazifalar
              </CardTitle>
              <CardDescription>Bugun va ertaga bo'lgan vazifalar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium">{task.task}</div>
                      <Badge variant={
                        task.priority === 'high' ? 'destructive' :
                        task.priority === 'medium' ? 'default' : 'outline'
                      }>
                        {task.priority === 'high' ? 'Yuqori' :
                         task.priority === 'medium' ? "O'rta" : 'Past'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      {task.deadline}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 gap-2">
                Yangi vazifa qo'shish
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Tezkor Harakatlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { label: 'Yangi dars qo\'shish', icon: BookOpen, href: '/dashboard/teacher/materials' },
                  { label: 'Baholarni kiritish', icon: FileText, href: '/dashboard/teacher/grades' },
                  { label: 'O\'quvchilar bilan chat', icon: MessageSquare, href: '/dashboard/teacher/chat' },
                  { label: 'Hisobot yaratish', icon: BarChart, href: '/dashboard/teacher/analytics' },
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
                      <div className="flex-1 text-left">
                        {action.label}
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                So'nggi Yutuqlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: 'O\'quvchilar reytingi', description: 'Eng yuqori o\'rtacha baho', date: '1 kun oldin' },
                  { title: 'Kurs tugatish darajasi', description: '95% o\'quvchi kursni tugatdi', date: '3 kun oldin' },
                  { title: 'Mijozlar mamnunligi', description: '4.9/5 reyting', date: '1 hafta oldin' },
                ].map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{achievement.date}</div>
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