// components/home/news-section.tsx
"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Clock, ArrowRight, Megaphone, Trophy, GraduationCap, Award, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const news = [
  {
    id: 1,
    title: "Yangi O'quv Yili Boshlanmoqda",
    excerpt: "2024-2025 o'quv yili uchun qabul davom etmoqda. Barcha kurslar uchun 30% chegirma",
    date: "15 Yanvar, 2024",
    author: "Admin",
    category: "Yangilik",
    readTime: "3 min",
    gradient: "from-blue-500 to-cyan-500",
    icon: Megaphone
  },
  {
    id: 2,
    title: "Matematika Olimpiadasi G'oliblari",
    excerpt: "Respublika matematika olimpiadasida 3 ta oltin medal va 5 ta kumush medal",
    date: "10 Yanvar, 2024",
    author: "Sport Bo'limi",
    category: "Musobaqa",
    readTime: "4 min",
    gradient: "from-emerald-500 to-green-500",
    icon: Trophy
  },
  {
    id: 3,
    title: "IELTS Natijalari - Rekord Ko'rsatkich",
    excerpt: "O'quvchilarimiz IELTS imtihonida o'rtacha 7.5 ball to'pladi",
    date: "5 Yanvar, 2024",
    author: "Ingliz Tili Bo'limi",
    category: "Yutuq",
    readTime: "5 min",
    gradient: "from-amber-500 to-orange-500",
    icon: Award
  },
  {
    id: 4,
    title: "Yangi Kompyuter Laboratoriyasi",
    excerpt: "Zamonaviy kompyuterlar bilan jihozlangan yangi laboratoriya ochildi",
    date: "28 Dekabr, 2023",
    author: "Texnika Bo'limi",
    category: "Yangilanish",
    readTime: "3 min",
    gradient: "from-purple-500 to-pink-500",
    icon: TrendingUp
  }
]

const announcements = [
  {
    title: "Olimpiada Tayyorlov",
    description: "Respublika va xalqaro olimpiadalarga tayyorlov kurslari",
    icon: Trophy,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
  },
  {
    title: "Sertifikat Kurslari",
    description: "Xalqaro darajadagi sertifikatlar uchun tayyorlov",
    icon: GraduationCap,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
  },
  {
    title: "Master-klasslar",
    description: "Har oy mutaxassislar tomonidan bepul seminar va treninglar",
    icon: Megaphone,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
  }
]

export function NewsSection() {
  return (
    <section id="news" className="py-20 sm:py-24 lg:py-28 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-amber-500/5 to-transparent rounded-full blur-3xl" />
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
            <Megaphone className="h-4 w-4 mr-2" />
            Yangiliklar va E'lonlar
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6">
            So'nggi{' '}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Yangiliklar
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            O'quv markazimizdagi eng so'nggi voqealar va yangiliklardan xabardor bo'ling
          </p>
        </motion.div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {news.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full border-2 border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Gradient Header */}
                <div className={`relative h-40 bg-gradient-to-br ${item.gradient}`}>
                  {/* Icon */}
                  <div className="absolute top-4 left-4 p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white">
                      {item.category}
                    </Badge>
                  </div>
                  
                  {/* Date & Time */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between text-white/90 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {item.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {item.readTime}
                      </div>
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {item.author}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                    {item.excerpt}
                  </p>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="gap-2 p-0 group/btn text-blue-600 dark:text-blue-400"
                    asChild
                  >
                    <Link href={`/news/${item.id}`}>
                      Batafsil o'qish
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Announcements Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {announcements.map((announcement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className={`${announcement.color} rounded-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300`}>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 dark:bg-gray-800/20 rounded-xl backdrop-blur-sm">
                    <announcement.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {announcement.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// // components/home/news-section.tsx
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { Calendar, User, Clock, ArrowRight, Megaphone, Trophy, GraduationCap } from 'lucide-react'

// const news = [
//   {
//     id: 1,
//     title: "Yangi O'quv Yili Boshlanmoqda",
//     excerpt: "2024-2025 o'quv yili uchun qabul davom etmoqda. Barcha kurslar uchun 30% chegirma",
//     date: "15 Yanvar, 2024",
//     author: "Admin",
//     category: "Yangilik",
//     readTime: "3 min",
//     image: "/news/new-year.jpg",
//     color: "bg-gradient-to-r from-blue-500 to-cyan-500"
//   },
//   {
//     id: 2,
//     title: "Matematika Olimpiadasi G'oliblari",
//     excerpt: "Respublika matematika olimpiadasida 3 ta oltin medal va 5 ta kumush medal",
//     date: "10 Yanvar, 2024",
//     author: "Sport Bo'limi",
//     category: "Musobaqa",
//     readTime: "4 min",
//     image: "/news/olympiad.jpg",
//     color: "bg-gradient-to-r from-yellow-500 to-orange-500"
//   },
//   {
//     id: 3,
//     title: "IELTS Natijalari - Rekord Ko'rsatkich",
//     excerpt: "O'quvchilarimiz IELTS imtihonida o'rtacha 7.5 ball to'pladi",
//     date: "5 Yanvar, 2024",
//     author: "Ingliz Tili Bo'limi",
//     category: "Yutuq",
//     readTime: "5 min",
//     image: "/news/ielts.jpg",
//     color: "bg-gradient-to-r from-green-500 to-emerald-500"
//   },
//   {
//     id: 4,
//     title: "Yangi Kompyuter Laboratoriyasi",
//     excerpt: "Zamonaviy kompyuterlar bilan jihozlangan yangi laboratoriya ochildi",
//     date: "28 Dekabr, 2023",
//     author: "Texnika Bo'limi",
//     category: "Yangilanish",
//     readTime: "3 min",
//     image: "/news/lab.jpg",
//     color: "bg-gradient-to-r from-purple-500 to-pink-500"
//   }
// ]

// export function NewsSection() {
//   return (
//     <section id="news" className="py-20 bg-gradient-to-b from-background to-muted/20">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <Badge variant="outline" className="mb-4 px-4 py-1 text-sm">
//             <Megaphone className="h-3 w-3 mr-2" />
//             Yangiliklar va E'lonlar
//           </Badge>
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">So'nggi Yangiliklar</h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             O'quv markazimizdagi eng so'nggi voqealar va yangiliklardan xabardor bo'ling
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {news.map((item) => (
//             <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
//               <div className="relative h-48 overflow-hidden">
//                 <div className={`${item.color} absolute inset-0`} />
//                 <div className="absolute top-4 left-4">
//                   <Badge className="bg-background/90 backdrop-blur-sm">
//                     {item.category}
//                   </Badge>
//                 </div>
//                 <div className="absolute bottom-4 left-4 right-4">
//                   <div className="flex items-center gap-4 text-white/90 text-sm">
//                     <div className="flex items-center gap-1">
//                       <Calendar className="h-3 w-3" />
//                       {item.date}
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Clock className="h-3 w-3" />
//                       {item.readTime}
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-xl group-hover:text-primary transition-colors">
//                   {item.title}
//                 </CardTitle>
//                 <CardDescription className="flex items-center gap-2">
//                   <User className="h-3 w-3" />
//                   {item.author}
//                 </CardDescription>
//               </CardHeader>
              
//               <CardContent>
//                 <p className="text-muted-foreground line-clamp-3">{item.excerpt}</p>
//               </CardContent>
              
//               <CardFooter>
//                 <Button variant="ghost" className="gap-2 p-0 group/btn">
//                   Batafsil o'qish
//                   <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>

//         <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-xl p-6 border">
//             <div className="flex items-start gap-4">
//               <div className="p-3 bg-primary/20 rounded-lg">
//                 <Trophy className="h-8 w-8 text-primary" />
//               </div>
//               <div>
//                 <h3 className="font-bold text-lg mb-2">Olimpiada Tayyorlov</h3>
//                 <p className="text-sm text-muted-foreground">Respublika va xalqaro olimpiadalarga tayyorlov kurslari</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-gradient-to-r from-secondary/10 to-green-500/10 rounded-xl p-6 border">
//             <div className="flex items-start gap-4">
//               <div className="p-3 bg-secondary/20 rounded-lg">
//                 <GraduationCap className="h-8 w-8 text-secondary" />
//               </div>
//               <div>
//                 <h3 className="font-bold text-lg mb-2">Sertifikat Kurslari</h3>
//                 <p className="text-sm text-muted-foreground">Xalqaro darajadagi sertifikatlar uchun tayyorlov</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-gradient-to-r from-accent/10 to-orange-500/10 rounded-xl p-6 border">
//             <div className="flex items-start gap-4">
//               <div className="p-3 bg-accent/20 rounded-lg">
//                 <Megaphone className="h-8 w-8 text-accent" />
//               </div>
//               <div>
//                 <h3 className="font-bold text-lg mb-2">Master-klasslar</h3>
//                 <p className="text-sm text-muted-foreground">Har oy mutaxassislar tomonidan bepul seminar va treninglar</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }