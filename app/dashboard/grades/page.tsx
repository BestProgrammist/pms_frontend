// app/dashboard/grades/page.tsx
"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Award, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  BookOpen,
  Download,
  Filter,
  Calendar,
  ChevronRight,
  Trophy,
  Target,
  Sparkles
} from 'lucide-react'

const subjects = [
  {
    name: 'Matematika',
    teacher: 'Azizova M.',
    grades: [5, 5, 4, 5, 5, 4, 5, 5],
    average: 4.8,
    total: 45,
    max: 50,
    color: 'blue'
  },
  {
    name: 'Fizika',
    teacher: 'Rahimov A.',
    grades: [4, 5, 4, 4, 5, 4, 4, 5],
    average: 4.4,
    total: 38,
    max: 45,
    color: 'emerald'
  },
  {
    name: 'Ingliz tili',
    teacher: 'Karimova S.',
    grades: [5, 5, 5, 5, 4, 5, 5, 5],
    average: 4.9,
    total: 48,
    max: 50,
    color: 'amber'
  },
  {
    name: 'Dasturlash',
    teacher: 'Yusupov D.',
    grades: [5, 4, 5, 5, 4, 5, 5, 4],
    average: 4.6,
    total: 42,
    max: 50,
    color: 'purple'
  },
  {
    name: 'Kimyo',
    teacher: 'Nazarova D.',
    grades: [4, 4, 5, 4, 4, 5, 4, 4],
    average: 4.2,
    total: 35,
    max: 45,
    color: 'pink'
  },
  {
    name: 'Tarix',
    teacher: 'Karimov B.',
    grades: [5, 5, 5, 4, 5, 5, 5, 5],
    average: 4.9,
    total: 49,
    max: 50,
    color: 'orange'
  }
]

const recentGrades = [
  { subject: 'Matematika', grade: 5, date: '15.01.2024', topic: 'Kvadrat tenglamalar', teacher: 'Azizova M.' },
  { subject: 'Fizika', grade: 4, date: '14.01.2024', topic: 'Elektromagnit induksiya', teacher: 'Rahimov A.' },
  { subject: 'Ingliz tili', grade: 5, date: '12.01.2024', topic: 'Present Perfect Tense', teacher: 'Karimova S.' },
  { subject: 'Dasturlash', grade: 5, date: '11.01.2024', topic: 'JavaScript Functions', teacher: 'Yusupov D.' },
  { subject: 'Kimyo', grade: 4, date: '10.01.2024', topic: 'Kimyoviy reaksiyalar', teacher: 'Nazarova D.' },
  { subject: 'Tarix', grade: 5, date: '09.01.2024', topic: 'Amir Temur', teacher: 'Karimov B.' },
]

const semesterStats = {
  gpa: 4.6,
  totalCredits: 24,
  rank: '3/45',
  bestSubject: 'Matematika',
  improvement: '+0.3'
}

export default function GradesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('semester1')

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Baholar va Natijalar</h1>
            <p className="text-gray-600 dark:text-gray-300">
              1-semestr | 2023-2024 o'quv yili
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtr
            </Button>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Davr
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-emerald-600">
              <Download className="h-4 w-4" />
              Hisobot
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">GPA</div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {semesterStats.gpa}
                    </div>
                    <div className="text-xs text-emerald-600 mt-1">
                      {semesterStats.improvement} o'tgan semestrga
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Trophy className="h-6 w-6 text-blue-600" />
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
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Reyting</div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {semesterStats.rank}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Sinf bo'yicha</div>
                  </div>
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <Target className="h-6 w-6 text-emerald-600" />
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
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Eng yaxshi fan</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {semesterStats.bestSubject}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">O'rtacha 4.9</div>
                  </div>
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <Sparkles className="h-6 w-6 text-amber-600" />
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
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Jami kredit</div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {semesterStats.totalCredits}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">24/30 kredit</div>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Subjects Grades */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">Barcha fanlar</TabsTrigger>
            <TabsTrigger value="high">Yuqori baholar</TabsTrigger>
            <TabsTrigger value="low">Yaxshilash kerak</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-2 hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 bg-${subject.color}-100 dark:bg-${subject.color}-900/30 rounded-lg`}>
                            <BookOpen className={`h-5 w-5 text-${subject.color}-600`} />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{subject.name}</h3>
                            <p className="text-sm text-gray-500">{subject.teacher}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold text-${subject.color}-600`}>
                            {subject.average}
                          </div>
                          <div className="text-xs text-gray-500">o'rtacha</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Umumiy ball</span>
                          <span className="font-semibold">{subject.total}/{subject.max}</span>
                        </div>
                        <Progress value={(subject.total / subject.max) * 100} className="h-2" />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {subject.grades.map((grade, i) => (
                          <Badge
                            key={i}
                            className={`text-base px-3 py-1 ${
                              grade === 5 ? 'bg-emerald-500' :
                              grade === 4 ? 'bg-blue-500' :
                              'bg-amber-500'
                            }`}
                          >
                            {grade}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Recent Grades Table */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              So'nggi Baholar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGrades.map((grade, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      grade.grade === 5 ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                      grade.grade === 4 ? 'bg-blue-100 dark:bg-blue-900/30' :
                      'bg-amber-100 dark:bg-amber-900/30'
                    }`}>
                      {grade.grade === 5 ? (
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                      ) : grade.grade === 4 ? (
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{grade.subject}</div>
                      <div className="text-sm text-gray-500">{grade.topic}</div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <span>{grade.teacher}</span>
                        <span>•</span>
                        <span>{grade.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${
                      grade.grade === 5 ? 'text-emerald-600' :
                      grade.grade === 4 ? 'text-blue-600' :
                      'text-amber-600'
                    }`}>
                      {grade.grade}
                    </div>
                    <div className="text-xs text-gray-500">/5</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}