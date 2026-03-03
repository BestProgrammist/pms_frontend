// components/home/courses-section.tsx
"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, Users, Star, ArrowRight, Target, CheckCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const courses = [
  {
    id: 1,
    title: "Matematika",
    description: "7-11 sinflar uchun matematika kursi. Geometriya, algebra va hisob",
    level: "Boshlang'ich",
    duration: "3 oy",
    students: 45,
    price: "300 000 so'm",
    rating: 4.9,
    features: ["Har hafta test", "Video darslar", "Shaxsiy ustoz", "Guruh darslari"],
    icon: Target,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
  },
  {
    id: 2,
    title: "Fizika",
    description: "Fizika fanidan chuqur bilim. Tajribalar va laboratoriya ishlari",
    level: "O'rta",
    duration: "4 oy",
    students: 32,
    price: "350 000 so'm",
    rating: 4.8,
    features: ["Laboratoriya", "Amaliy mashqlar", "Olimpiada tayyorlov", "Testlar"],
    icon: TrendingUp,
    gradient: "from-emerald-500 to-green-500",
    bgGradient: "from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20"
  },
  {
    id: 3,
    title: "Ingliz Tili",
    description: "IELTS va umumiy ingliz tili. Speaking, writing, listening, reading",
    level: "Boshlang'ich",
    duration: "6 oy",
    students: 68,
    price: "400 000 so'm",
    rating: 4.9,
    features: ["Speaking club", "IELTS tayyorlov", "Native speaker", "Audio materiallar"],
    icon: BookOpen,
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20"
  },
  {
    id: 4,
    title: "Dasturlash",
    description: "Python va JavaScript asoslari. Loyiha asosida o'qitish",
    level: "Boshlang'ich",
    duration: "5 oy",
    students: 56,
    price: "450 000 so'm",
    rating: 4.7,
    features: ["Real loyihalar", "Git va GitHub", "Portfolio", "Mentorlik"],
    icon: CheckCircle,
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100
    }
  }
}

export function CoursesSection() {
  return (
    <section id="courses" className="py-20 sm:py-24 lg:py-28 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-emerald-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12 lg:mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm border-2">
            <BookOpen className="h-4 w-4 mr-2" />
            O'quv Kurslari
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6">
            Siz uchun{' '}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Maxsus Kurslar
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Zamonaviy o'qitish metodlari va tajribali ustozlar bilan professional ta'lim oling
          </p>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="h-full group hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Course Header with Gradient */}
                <div className={`relative bg-gradient-to-br ${course.bgGradient} p-6 lg:p-8`}>
                  {/* Icon Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${course.gradient} shadow-lg`}>
                      <course.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Level Badge */}
                  <Badge className="mb-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white">
                    {course.level}
                  </Badge>
                  
                  {/* Course Title */}
                  <CardTitle className="text-xl lg:text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {course.title}
                  </CardTitle>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(course.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-300 text-gray-300 dark:fill-gray-700 dark:text-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {course.rating}
                    </span>
                  </div>
                  
                  {/* Description */}
                  <CardDescription className="text-gray-600 dark:text-gray-300 line-clamp-2">
                    {course.description}
                  </CardDescription>
                </div>
                
                <CardContent className="p-6 lg:p-8">
                  {/* Features List */}
                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Kurs imkoniyatlari:</h4>
                    <ul className="space-y-2">
                      {course.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200 dark:border-gray-800">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Davomiylik</span>
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white">{course.duration}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">O'quvchilar</span>
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white">{course.students}</div>
                    </div>
                  </div>
                  
                  {/* Price & CTA */}
                  <div className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Narxi</div>
                        <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                          {course.price}
                        </div>
                      </div>
                      <Button 
                        size="lg" 
                        className="gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                        asChild
                      >
                        <Link href={`/courses/${course.id}`}>
                          Batafsil
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 lg:mt-16"
        >
          <Button 
            size="lg" 
            variant="outline" 
            className="gap-2 px-8 py-6 text-lg rounded-xl border-2 group"
            asChild
          >
            <Link href="/courses">
              Barcha Kurslarni Ko'rish
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

// // components/home/courses-section.tsx
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { BookOpen, Clock, Users, Star, ArrowRight } from 'lucide-react'

// const courses = [
//   {
//     id: 1,
//     title: "Matematika",
//     description: "7-11 sinflar uchun matematika kursi. Geometriya, algebra va hisob",
//     level: "Boshlang'ich",
//     duration: "3 oy",
//     students: 45,
//     price: "300 000 so'm",
//     rating: 4.9,
//     features: ["Har hafta test", "Video darslar", "Shaxsiy ustoz", "Guruh darslari"],
//     color: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30"
//   },
//   {
//     id: 2,
//     title: "Fizika",
//     description: "Fizika fanidan chuqur bilim. Tajribalar va laboratoriya ishlari",
//     level: "O'rta",
//     duration: "4 oy",
//     students: 32,
//     price: "350 000 so'm",
//     rating: 4.8,
//     features: ["Laboratoriya", "Amaliy mashqlar", "Olimpiada tayyorlov", "Testlar"],
//     color: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30"
//   },
//   {
//     id: 3,
//     title: "Ingliz Tili",
//     description: "IELTS va umumiy ingliz tili. Speaking, writing, listening, reading",
//     level: "Boshlang'ich",
//     duration: "6 oy",
//     students: 68,
//     price: "400 000 so'm",
//     rating: 4.9,
//     features: ["Speaking club", "IELTS tayyorlov", "Native speaker", "Audio materiallar"],
//     color: "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30"
//   },
//   {
//     id: 4,
//     title: "Dasturlash",
//     description: "Python va JavaScript asoslari. Loyiha asosida o'qitish",
//     level: "Boshlang'ich",
//     duration: "5 oy",
//     students: 56,
//     price: "450 000 so'm",
//     rating: 4.7,
//     features: ["Real loyihalar", "Git va GitHub", "Portfolio", "Mentorlik"],
//     color: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30"
//   }
// ]

// export function CoursesSection() {
//   return (
//     <section id="courses" className="py-20 bg-gradient-to-b from-background to-muted/30">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <Badge variant="outline" className="mb-4 px-4 py-1 text-sm">
//             <BookOpen className="h-3 w-3 mr-2" />
//             O'quv Kurslari
//           </Badge>
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">Bizning Kurslarimiz</h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             Zamonaviy o'qitish metodlari va tajribali ustozlar bilan professional ta'lim oling
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {courses.map((course) => (
//             <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2">
//               <div className={`${course.color} p-6 rounded-t-lg`}>
//                 <div className="flex justify-between items-start mb-4">
//                   <Badge variant="secondary" className="text-xs">
//                     {course.level}
//                   </Badge>
//                   <div className="flex items-center gap-1">
//                     <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                     <span className="text-sm font-semibold">{course.rating}</span>
//                   </div>
//                 </div>
//                 <h3 className="text-xl font-bold mb-2">{course.title}</h3>
//                 <p className="text-sm text-muted-foreground">{course.description}</p>
//               </div>
              
//               <CardContent className="p-6">
//                 <div className="space-y-4">
//                   <div className="flex justify-between text-sm">
//                     <div className="flex items-center gap-2">
//                       <Clock className="h-4 w-4 text-muted-foreground" />
//                       <span>{course.duration}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Users className="h-4 w-4 text-muted-foreground" />
//                       <span>{course.students} o'quvchi</span>
//                     </div>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <h4 className="font-semibold text-sm">Kurs imkoniyatlari:</h4>
//                     <ul className="space-y-1">
//                       {course.features.map((feature, index) => (
//                         <li key={index} className="flex items-center gap-2 text-sm">
//                           <div className="w-1.5 h-1.5 rounded-full bg-primary" />
//                           {feature}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
                  
//                   <div className="pt-4 border-t">
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <div className="text-sm text-muted-foreground">Narxi</div>
//                         <div className="text-2xl font-bold">{course.price}</div>
//                       </div>
//                       <Button className="gap-2">
//                         Batafsil
//                         <ArrowRight className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         <div className="text-center mt-10">
//           <Button size="lg" className="gap-2">
//             Barcha Kurslarni Ko'rish
//             <ArrowRight className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </section>
//   )
// }