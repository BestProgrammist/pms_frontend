// app/dashboard/parent/page.tsx
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
  Bell,
  Calendar,
  Target,
  Eye
} from 'lucide-react'
import Link from 'next/link'

const children = [
  { name: 'Azizov Sardor', grade: '9B', subject: 'Matematika', progress: 85, avatar: 'AS' },
  { name: 'Azizova Malika', grade: '11A', subject: 'Fizika', progress: 92, avatar: 'AM' },
]

const childrenStats = [
  { label: 'O\'rtacha Baho', value: '4.8', icon: Award, color: 'bg-blue-500' },
  { label: 'Davomat Foizi', value: '96%', icon: Clock, color: 'bg-emerald-500' },
  { label: 'Uy Vazifalari', value: '3', icon: FileText, color: 'bg-amber-500' },
  { label: 'Xabarlar', value: '5', icon: MessageSquare, color: 'bg-purple-500' },
]

const notifications = [
  { text: 'Sardorning algebra testi 5/5', time: '2 soat oldin', type: 'grade' },
  { text: 'Malikadan yangi baho qo\'shildi', time: '1 kun oldin', type: 'grade' },
  { text: 'Ota-ona majlisi ertaga', time: '2 kun oldin', type: 'meeting' },
  { text: 'Yangi o\'quv materiali qo\'shildi', time: '3 kun oldin', type: 'material' },
]

export default function ParentDashboardPage() {
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
              Salom, Alisher aka! 👨‍👩‍👧‍👦
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Farzandlaringizning ta'lim jarayonini kuzatish va boshqarish.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">2</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Farzandlar</div>
            </div>
            <Button className="gap-2" asChild>
              <Link href="/dashboard/parent/children">
                <Eye className="h-4 w-4" />
                Farzandlarni ko'rish
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Children Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((child, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-2 hover:shadow-lg transition-all h-full">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-xl font-bold">
                    {child.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg">{child.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{child.grade} sinf</div>
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">{child.subject}</div>
                  </div>
                  <Badge className="bg-gradient-to-r from-blue-600 to-emerald-600">
                    {child.progress}%
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Umumiy progress</span>
                    <span className="font-semibold">{child.progress}%</span>
                  </div>
                  <Progress value={child.progress} className="h-2" />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-xl font-bold">4.7</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">O'rtacha</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">98%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Davomat</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">2</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Uy vaz.</div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-6 gap-2" asChild>
                  <Link href={`/dashboard/parent/children/${child.name.toLowerCase().replace(' ', '-')}`}>
                    Batafsil ko'rish
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {childrenStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card className="border-2 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                  </div>
                  <div className={`p-3 ${stat.color}/10 rounded-lg`}>
                    <stat.icon className={`h-5 w-5 ${stat.color.replace('bg-', 'text-')}`} />
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
          {/* Children Schedule */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Farzandlarning Dars Jadvali
              </CardTitle>
              <CardDescription>Bugungi darslar ro'yxati</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { child: 'Azizov Sardor', time: '09:00', subject: 'Matematika', teacher: 'Azizova M.' },
                  { child: 'Azizova Malika', time: '10:30', subject: 'Fizika', teacher: 'Rahimov A.' },
                  { child: 'Azizov Sardor', time: '14:00', subject: 'Ingliz tili', teacher: 'Karimova S.' },
                ].map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500/20 to-emerald-500/20 flex items-center justify-center">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {schedule.child.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{schedule.child}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{schedule.subject}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{schedule.time}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{schedule.teacher}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 gap-2" asChild>
                <Link href="/dashboard/parent/schedule">
                  To'liq jadvalni ko'rish
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
              <CardDescription>Oxirgi 1 haftadagi baholar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { child: 'Azizov Sardor', subject: 'Matematika', grade: 5, date: '15.01.2024' },
                  { child: 'Azizova Malika', subject: 'Fizika', grade: 4, date: '14.01.2024' },
                  { child: 'Azizov Sardor', subject: 'Ingliz tili', grade: 5, date: '12.01.2024' },
                  { child: 'Azizova Malika', subject: 'Kimyo', grade: 5, date: '10.01.2024' },
                ].map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div>
                      <div className="font-medium">{grade.child}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{grade.subject}</div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          grade.grade === 5 ? 'text-emerald-600' :
                          grade.grade === 4 ? 'text-blue-600' :
                          'text-amber-600'
                        }`}>
                          {grade.grade}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{grade.date}</div>
                      </div>
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        grade.grade === 5 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' :
                        grade.grade === 4 ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
                        'bg-amber-100 text-amber-600 dark:bg-amber-900/30'
                      }`}>
                        <Award className="h-5 w-5" />
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
          {/* Notifications */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Yangi Xabarlar
              </CardTitle>
              <CardDescription>So'nggi bildirishnomalar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className={`p-2 rounded-lg ${
                      notification.type === 'grade' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      notification.type === 'meeting' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                      'bg-amber-100 dark:bg-amber-900/30'
                    }`}>
                      <Bell className={`h-4 w-4 ${
                        notification.type === 'grade' ? 'text-blue-600' :
                        notification.type === 'meeting' ? 'text-emerald-600' :
                        'text-amber-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{notification.text}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{notification.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 gap-2">
                Barcha xabarlar
                <ChevronRight className="h-4 w-4" />
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
                {[
                  { label: 'Ustoz bilan bog\'lanish', icon: MessageSquare, href: '/dashboard/parent/chat' },
                  { label: 'Hisobotlarni ko\'rish', icon: FileText, href: '/dashboard/parent/reports' },
                  { label: 'To\'lovlar tarixi', icon: TrendingUp, href: '/dashboard/parent/payments' },
                  { label: 'Sozlamalar', icon: 'Settings', href: '/dashboard/parent/settings' },
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

          {/* Contact Teachers */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Ustozlar bilan Aloqa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Azizova Malika', subject: 'Matematika', status: 'online' },
                  { name: 'Rahimov Alisher', subject: 'Fizika', status: 'offline' },
                  { name: 'Karimova Sanobar', subject: 'Ingliz tili', status: 'online' },
                ].map((teacher, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-sm">
                        {teacher.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium">{teacher.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{teacher.subject}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        teacher.status === 'online' ? 'bg-emerald-500' : 'bg-gray-300'
                      }`} />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {teacher.status === 'online' ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 gap-2">
                <MessageSquare className="h-4 w-4" />
                Chatga o'tish
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}