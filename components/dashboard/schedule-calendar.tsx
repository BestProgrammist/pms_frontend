// components/dashboard/schedule-calendar.tsx
"use client"

import { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Clock, User, Book } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function ScheduleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'week' | 'month'>('week')

  const days = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']
  const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8:00 - 20:00

  // Fake darslar ma'lumotlari
  const lessons = [
    { id: 1, day: 1, start: 9, end: 10.5, subject: 'Matematika', teacher: 'Azizova M.', room: '302', color: 'bg-blue-100 border-blue-300' },
    { id: 2, day: 1, start: 11, end: 12.5, subject: 'Fizika', teacher: 'Rahimov A.', room: '305', color: 'bg-green-100 border-green-300' },
    { id: 3, day: 2, start: 10, end: 11.5, subject: 'Ingliz tili', teacher: 'Karimova S.', room: '401', color: 'bg-yellow-100 border-yellow-300' },
    { id: 4, day: 3, start: 14, end: 15.5, subject: 'Informatika', teacher: 'Yusupov D.', room: '202', color: 'bg-purple-100 border-purple-300' },
    { id: 5, day: 4, start: 9, end: 10.5, subject: 'Matematika', teacher: 'Azizova M.', room: '302', color: 'bg-blue-100 border-blue-300' },
  ]

  const getWeekDates = () => {
    const start = new Date(currentDate)
    start.setDate(start.getDate() - start.getDay() + 1)
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      return date
    })
  }

  const weekDates = getWeekDates()

  const formatTime = (hour: number) => {
    return `${Math.floor(hour)}:${hour % 1 === 0 ? '00' : '30'}`
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Dars Jadvali
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView(view === 'week' ? 'month' : 'week')}
            >
              {view === 'week' ? 'Haftalik' : 'Oylik'}
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const newDate = new Date(currentDate)
                  newDate.setDate(newDate.getDate() - 7)
                  setCurrentDate(newDate)
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {weekDates[0].toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })} -{' '}
                {weekDates[6].toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const newDate = new Date(currentDate)
                  newDate.setDate(newDate.getDate() + 7)
                  setCurrentDate(newDate)
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header - Days */}
            <div className="grid grid-cols-8 border-b">
              <div className="p-2 font-medium text-muted-foreground">Vaqt</div>
              {days.map((day, index) => (
                <div key={index} className="p-2 text-center">
                  <div className="font-medium">{day}</div>
                  <div className="text-sm text-muted-foreground">
                    {weekDates[index].getDate()}
                  </div>
                </div>
              ))}
            </div>

            {/* Time slots */}
            <div className="relative">
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b h-20">
                  <div className="p-2 border-r text-sm text-muted-foreground">
                    {formatTime(hour)}
                  </div>
                  {days.map((_, dayIndex) => (
                    <div key={dayIndex} className="p-1 border-r relative">
                      {/* Darslarni joylashtirish */}
                      {lessons
                        .filter(lesson => lesson.day === dayIndex + 1 && Math.floor(lesson.start) === hour)
                        .map((lesson) => {
                          const duration = (lesson.end - lesson.start) * 40 // Convert to pixels
                          return (
                            <div
                              key={lesson.id}
                              className={`absolute left-1 right-1 p-2 rounded-lg border ${lesson.color} shadow-sm z-10`}
                              style={{
                                top: `${(lesson.start % 1) * 40}px`,
                                height: `${duration}px`,
                              }}
                            >
                              <div className="text-xs font-semibold">{lesson.subject}</div>
                              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                <User className="h-3 w-3" />
                                {lesson.teacher}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatTime(lesson.start)}-{formatTime(lesson.end)}
                              </div>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {lesson.room} xona
                              </Badge>
                            </div>
                          )
                        })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Darslar ranglari:</h4>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Matematika', color: 'bg-blue-100 border-blue-300' },
              { label: 'Fizika', color: 'bg-green-100 border-green-300' },
              { label: 'Ingliz tili', color: 'bg-yellow-100 border-yellow-300' },
              { label: 'Informatika', color: 'bg-purple-100 border-purple-300' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color.replace('bg-', 'bg-').replace(' border', '')}`} />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg dark:bg-blue-900/20">
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-sm text-muted-foreground">Jami darslar</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg dark:bg-green-900/20">
            <div className="text-2xl font-bold text-secondary">8</div>
            <div className="text-sm text-muted-foreground">O'tilgan darslar</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg dark:bg-yellow-900/20">
            <div className="text-2xl font-bold text-accent">4</div>
            <div className="text-sm text-muted-foreground">Qolgan darslar</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}