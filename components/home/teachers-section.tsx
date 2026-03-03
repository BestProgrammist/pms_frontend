// components/home/teachers-section.tsx
"use client"

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Award, Star, MessageSquare, Book, Users, Target, TrendingUp } from 'lucide-react'

const teachers = [
  {
    id: 1,
    name: "Azizova Malika",
    subject: "Matematika",
    experience: "10 yil",
    bio: "Matematika fanidan malaka oshirgan ustoz. 150+ o'quvchi imtihon topshirgan.",
    rating: 4.9,
    students: 320,
    courses: 5,
    image: "/teachers/teacher1.jpg",
    specialties: ["Algebra", "Geometriya", "Matematik analiz"],
    education: "Toshkent Davlat Universiteti magistri",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    name: "Rahimov Alisher",
    subject: "Fizika",
    experience: "8 yil",
    bio: "Fizika olimpiadalariga tayyorlovchi. Innovatsion o'qitish metodlari.",
    rating: 4.8,
    students: 280,
    courses: 4,
    image: "/teachers/teacher2.jpg",
    specialties: ["Mexanika", "Elektrodinamika", "Kvant fizikasi"],
    education: "Moskva Fizika Texnika Instituti",
    color: "from-emerald-500 to-green-500"
  },
  {
    id: 3,
    name: "Karimova Sanobar",
    subject: "Ingliz tili",
    experience: "12 yil",
    bio: "IELTS 8.5 sohibi. Chet elda tahsil olgan. Speaking club asoschisi.",
    rating: 4.9,
    students: 450,
    courses: 6,
    image: "/teachers/teacher3.jpg",
    specialties: ["IELTS", "Business English", "Conversation"],
    education: "Cambridge CELTA sertifikati",
    color: "from-amber-500 to-orange-500"
  },
  {
    id: 4,
    name: "Yusupov Dilmurod",
    subject: "Dasturlash",
    experience: "6 yil",
    bio: "Full-stack developer. Start-up loyihalar ishtirokchisi. Mentor.",
    rating: 4.7,
    students: 380,
    courses: 7,
    image: "/teachers/teacher4.jpg",
    specialties: ["Python", "JavaScript", "React", "Node.js"],
    education: "Stanford University kurslari",
    color: "from-purple-500 to-pink-500"
  }
]

const stats = [
  { value: "50+", label: "Professional ustoz", icon: Users },
  { value: "2000+", label: "Muvaffaqiyatli o'quvchi", icon: GraduationCap },
  { value: "15+", label: "O'quv yili tajribasi", icon: Award },
  { value: "95%", label: "Imtihon o'tish darajasi", icon: TrendingUp }
]

export function TeachersSection() {
  return (
    <section id="teachers" className="py-20 sm:py-24 lg:py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-500/5 to-transparent" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-emerald-500/5 via-transparent to-transparent rounded-full blur-3xl" />
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
            <GraduationCap className="h-4 w-4 mr-2" />
            Professional Ustozlar
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6">
            Bizning{' '}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Tajribali Ustozlarimiz
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Har bir ustoz - o'z sohasining mutaxassisi va o'quvchilar sevimli o'qituvchisi
          </p>
        </motion.div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {teachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="relative overflow-hidden border-2 border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-300">
                {/* Gradient Header */}
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${teacher.color}`} />
                
                {/* Avatar Section */}
                <div className="relative pt-10 px-6">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                    <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-900 shadow-xl">
                      <AvatarFallback className={`bg-gradient-to-br ${teacher.color} text-white text-xl font-bold`}>
                        {teacher.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Experience Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">
                      <Award className="h-3 w-3 mr-1" />
                      {teacher.experience}
                    </Badge>
                  </div>
                </div>

                <CardContent className="pt-12 pb-6 px-6">
                  {/* Teacher Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {teacher.name}
                    </h3>
                    <p className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                      {teacher.subject}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {teacher.education}
                    </p>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4 line-clamp-3">
                    {teacher.bio}
                  </p>

                  {/* Rating & Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">{teacher.rating}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{teacher.students}+</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Book className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{teacher.courses}</span>
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Mutaxassislik:</h4>
                    <div className="flex flex-wrap gap-1">
                      {teacher.specialties.map((spec, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
                    <MessageSquare className="h-4 w-4" />
                    Konsultatsiya
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-transparent backdrop-blur-sm rounded-2xl p-8 lg:p-10 border border-gray-200 dark:border-gray-800"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-2xl mb-4">
                  <stat.icon className={`h-8 w-8 ${
                    index === 0 ? 'text-blue-600' : 
                    index === 1 ? 'text-emerald-600' : 
                    index === 2 ? 'text-amber-600' : 
                    'text-purple-600'
                  }`} />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// // components/home/teachers-section.tsx
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { Badge } from '@/components/ui/badge'
// import { GraduationCap, Award, Star, MessageSquare, Book, Users } from 'lucide-react'

// const teachers = [
//   {
//     id: 1,
//     name: "Azizova Malika",
//     subject: "Matematika",
//     experience: "10 yil",
//     bio: "Matematika fanidan malaka oshirgan ustoz. 150+ o'quvchi imtihon topshirgan.",
//     rating: 4.9,
//     students: 320,
//     courses: 5,
//     image: "/teachers/teacher1.jpg",
//     specialties: ["Algebra", "Geometriya", "Matematik analiz"],
//     education: "Toshkent Davlat Universiteti magistri"
//   },
//   {
//     id: 2,
//     name: "Rahimov Alisher",
//     subject: "Fizika",
//     experience: "8 yil",
//     bio: "Fizika olimpiadalariga tayyorlovchi. Innovatsion o'qitish metodlari.",
//     rating: 4.8,
//     students: 280,
//     courses: 4,
//     image: "/teachers/teacher2.jpg",
//     specialties: ["Mexanika", "Elektrodinamika", "Kvant fizikasi"],
//     education: "Moskva Fizika Texnika Instituti"
//   },
//   {
//     id: 3,
//     name: "Karimova Sanobar",
//     subject: "Ingliz tili",
//     experience: "12 yil",
//     bio: "IELTS 8.5 sohibi. Chet elda tahsil olgan. Speaking club asoschisi.",
//     rating: 4.9,
//     students: 450,
//     courses: 6,
//     image: "/teachers/teacher3.jpg",
//     specialties: ["IELTS", "Business English", "Conversation"],
//     education: "Cambridge CELTA sertifikati"
//   },
//   {
//     id: 4,
//     name: "Yusupov Dilmurod",
//     subject: "Dasturlash",
//     experience: "6 yil",
//     bio: "Full-stack developer. Start-up loyihalar ishtirokchisi. Mentor.",
//     rating: 4.7,
//     students: 380,
//     courses: 7,
//     image: "/teachers/teacher4.jpg",
//     specialties: ["Python", "JavaScript", "React", "Node.js"],
//     education: "Stanford University kurslari"
//   }
// ]

// export function TeachersSection() {
//   return (
//     <section id="teachers" className="py-20 bg-gradient-to-b from-muted/30 to-background">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <Badge variant="outline" className="mb-4 px-4 py-1 text-sm">
//             <GraduationCap className="h-3 w-3 mr-2" />
//             Professional Ustozlar
//           </Badge>
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">Bizning Ustozlarimiz</h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             Tajribali va malakali o'qituvchilar jamoasi bilan ishlaymiz
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//           {teachers.map((teacher) => (
//             <Card key={teacher.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 overflow-hidden">
//               <div className="relative">
//                 <div className="absolute top-4 right-4 z-10">
//                   <Badge className="bg-primary/90 backdrop-blur-sm">
//                     <Award className="h-3 w-3 mr-1" />
//                     {teacher.experience}
//                   </Badge>
//                 </div>
                
//                 <div className="h-48 bg-gradient-to-r from-primary/20 to-secondary/20 relative overflow-hidden">
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
//                   <div className="absolute bottom-4 left-4">
//                     <Avatar className="h-20 w-20 border-4 border-background">
//                       <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
//                     </Avatar>
//                   </div>
//                 </div>
//               </div>
              
//               <CardContent className="p-6 pt-14">
//                 <div className="mb-4">
//                   <h3 className="text-xl font-bold">{teacher.name}</h3>
//                   <p className="text-primary font-semibold">{teacher.subject}</p>
//                   <p className="text-sm text-muted-foreground mt-1">{teacher.education}</p>
//                 </div>
                
//                 <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{teacher.bio}</p>
                
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between text-sm">
//                     <div className="flex items-center gap-1">
//                       <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                       <span className="font-semibold">{teacher.rating}</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Users className="h-4 w-4" />
//                       <span>{teacher.students}+</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Book className="h-4 w-4" />
//                       <span>{teacher.courses}</span>
//                     </div>
//                   </div>
                  
//                   <div className="pt-3 border-t">
//                     <h4 className="text-sm font-semibold mb-2">Mutaxassislik:</h4>
//                     <div className="flex flex-wrap gap-1">
//                       {teacher.specialties.map((spec, index) => (
//                         <Badge key={index} variant="outline" className="text-xs">
//                           {spec}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
                  
//                   <div className="pt-3 border-t">
//                     <Button className="w-full gap-2">
//                       <MessageSquare className="h-4 w-4" />
//                       Konsultatsiya
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//             <div className="text-center">
//               <div className="text-4xl font-bold text-primary mb-2">50+</div>
//               <div className="text-sm text-muted-foreground">Professional ustoz</div>
//             </div>
//             <div className="text-center">
//               <div className="text-4xl font-bold text-secondary mb-2">2000+</div>
//               <div className="text-sm text-muted-foreground">Muvaffaqiyatli o'quvchi</div>
//             </div>
//             <div className="text-center">
//               <div className="text-4xl font-bold text-accent mb-2">15+</div>
//               <div className="text-sm text-muted-foreground">O'quv yili tajribasi</div>
//             </div>
//             <div className="text-center">
//               <div className="text-4xl font-bold text-primary mb-2">95%</div>
//               <div className="text-sm text-muted-foreground">Imtihon o'tish darajasi</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }