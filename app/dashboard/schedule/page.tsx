// app/dashboard/schedule/page.tsx
"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  Book, 
  MapPin,
  Download,
  Bell,
  AlertCircle
} from 'lucide-react'

const weekDays = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba']
const monthDays = Array.from({ length: 30 }, (_, i) => i + 1)

const scheduleData = {
  monday: [
    { time: '09:00 - 10:30', subject: 'Matematika', teacher: 'Azizova M.', room: '302', type: 'lecture', group: '9B' },
    { time: '11:00 - 12:30', subject: 'Fizika', teacher: 'Rahimov A.', room: '305', type: 'lab', group: '9B' },
    { time: '14:00 - 15:30', subject: 'Ingliz tili', teacher: 'Karimova S.', room: '401', type: 'practice', group: '9B' },
  ],
  tuesday: [
    { time: '09:00 - 10:30', subject: 'Algebra', teacher: 'Azizova M.', room: '302', type: 'lecture', group: '9B' },
    { time: '11:00 - 12:30', subject: 'Kimyo', teacher: 'Nazarova D.', room: '308', type: 'lab', group: '9B' },
    { time: '14:00 - 15:30', subject: 'Dasturlash', teacher: 'Yusupov D.', room: '202', type: 'practice', group: '9B' },
  ],
  wednesday: [
    { time: '09:00 - 10:30', subject: 'Geometriya', teacher: 'Azizova M.', room: '302', type: 'lecture', group: '9B' },
    { time: '11:00 - 12:30', subject: 'Fizika', teacher: 'Rahimov A.', room: '305', type: 'lecture', group: '9B' },
    { time: '14:00 - 15:30', subject: 'Adabiyot', teacher: 'Yusupova G.', room: '405', type: 'lecture', group: '9B' },
  ],
  thursday: [
    { time: '09:00 - 10:30', subject: 'Matematika', teacher: 'Azizova M.', room: '302', type: 'lecture', group: '9B' },
    { time: '11:00 - 12:30', subject: 'Ingliz tili', teacher: 'Karimova S.', room: '401', type: 'practice', group: '9B' },
    { time: '14:00 - 15:30', subject: 'Tarix', teacher: 'Karimov B.', room: '408', type: 'lecture', group: '9B' },
  ],
  friday: [
    { time: '09:00 - 10:30', subject: 'Fizika', teacher: 'Rahimov A.', room: '305', type: 'lab', group: '9B' },
    { time: '11:00 - 12:30', subject: 'Matematika', teacher: 'Azizova M.', room: '302', type: 'practice', group: '9B' },
    { time: '14:00 - 15:30', subject: 'Informatika', teacher: 'Yusupov D.', room: '202', type: 'lab', group: '9B' },
  ],
  saturday: [
    { time: '10:00 - 11:30', subject: 'IELTS', teacher: 'Karimova S.', room: '401', type: 'practice', group: '9B' },
    { time: '12:00 - 13:30', subject: 'Olimpiada', teacher: 'Azizova M.', room: '302', type: 'special', group: '9B' },
  ],
  sunday: []
}

const exams = [
  { subject: 'Matematika', date: '20 Yanvar', time: '09:00', room: '302', type: 'Oraliq' },
  { subject: 'Fizika', date: '25 Yanvar', time: '11:00', room: '305', type: 'Yakuniy' },
  { subject: 'Ingliz tili', date: '28 Yanvar', time: '14:00', room: '401', type: 'IELTS' },
]

export default function SchedulePage() {
  const [view, setView] = useState<'week' | 'month'>('week')
  const [currentWeek, setCurrentWeek] = useState(0)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dars Jadvali</h1>
            <p className="text-gray-600 dark:text-gray-300">
              9B sinf | 2024 yil, Yanvar oyi
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Yuklab olish
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-emerald-600">
              <Bell className="h-4 w-4" />
              Eslatma qo'shish
            </Button>
          </div>
        </div>

        <Card className="border-2 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-lg font-semibold">
                  Yanvar 8 - 14, 2024
                </div>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Tabs value={view} onValueChange={(v) => setView(v as 'week' | 'month')}>
                <TabsList>
                  <TabsTrigger value="week">Haftalik</TabsTrigger>
                  <TabsTrigger value="month">Oylik</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {view === 'week' ? (
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day, index) => (
              <Card key={day} className="border-2 h-fit">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    {day}
                    <span className="block text-sm text-gray-500 font-normal mt-1">
                      {8 + index} Yanvar
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {scheduleData[day.toLowerCase() as keyof typeof scheduleData]?.map((lesson, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border-l-4 ${
                        lesson.type === 'lecture' ? 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                        lesson.type === 'lab' ? 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' :
                        lesson.type === 'practice' ? 'border-l-amber-500 bg-amber-50 dark:bg-amber-900/20' :
                        'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="font-semibold">{lesson.subject}</div>
                        <Badge variant="outline" className="text-xs">
                          {lesson.type === 'lecture' ? 'Ma\'ruza' :
                           lesson.type === 'lab' ? 'Laboratoriya' :
                           lesson.type === 'practice' ? 'Amaliyot' : 'Maxsus'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 mb-1">
                        <Clock className="h-3 w-3" />
                        {lesson.time}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <User className="h-3 w-3" />
                        {lesson.teacher}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <MapPin className="h-3 w-3" />
                        {lesson.room} xona
                      </div>
                    </div>
                  ))}
                  {scheduleData[day.toLowerCase() as keyof typeof scheduleData]?.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      Dam olish kuni
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-2 text-center mb-4">
                {weekDays.map(day => (
                  <div key={day} className="font-semibold">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 4 }).map((_, weekIndex) => (
                  <>
                    {Array.from({ length: 7 }).map((_, dayIndex) => {
                      const dayNumber = weekIndex * 7 + dayIndex + 1
                      return (
                        <div
                          key={dayIndex}
                          className={`p-3 min-h-[100px] border rounded-lg ${
                            dayNumber > 30 ? 'bg-gray-50 dark:bg-gray-800/50' : 'hover:border-blue-500'
                          }`}
                        >
                          <div className="text-sm mb-2">{dayNumber}</div>
                          {dayNumber === 9 && (
                            <div className="text-xs p-1 bg-blue-100 dark:bg-blue-900/30 rounded mb-1">
                              09:00 - Matematika
                            </div>
                          )}
                          {dayNumber === 11 && (
                            <div className="text-xs p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded mb-1">
                              11:00 - Fizika
                            </div>
                          )}
                          {dayNumber === 14 && (
                            <div className="text-xs p-1 bg-amber-100 dark:bg-amber-900/30 rounded">
                              14:00 - Ingliz tili
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exams Section */}
        <Card className="border-2 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Yaqinlashayotgan Imtihonlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exams.map((exam, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold">{exam.subject}</div>
                    <Badge className="bg-gradient-to-r from-blue-600 to-emerald-600">
                      {exam.type}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    {exam.date} | {exam.time}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {exam.room} xona
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-3">
                    Eslatma qo'shish
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}