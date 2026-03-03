// components/home/contact-section.tsx
"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageSquare, Users, Globe, Play } from 'lucide-react'

const contactInfo = [
  {
    icon: Phone,
    title: "Telefon Raqamlar",
    details: ["+998 90 123 45 67", "+998 71 234 56 78"],
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Mail,
    title: "Email Manzillar",
    details: ["info@talim-olami.uz", "qabul@talim-olami.uz"],
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    gradient: "from-emerald-500 to-green-500"
  },
  {
    icon: MapPin,
    title: "Manzilimiz",
    details: ["Toshkent shahar, Mirzo Ulug'bek tumani, Universitet ko'chasi, 45-uy"],
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    gradient: "from-amber-500 to-orange-500"
  },
  {
    icon: Clock,
    title: "Ish Vaqtlari",
    details: ["Dushanba - Shanba: 08:00 - 20:00", "Yakshanba: 10:00 - 16:00"],
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    gradient: "from-purple-500 to-pink-500"
  }
]

const socialMedia = [
  { name: "Telegram", icon: MessageSquare, color: "bg-blue-500 hover:bg-blue-600" },
  { name: "Instagram", icon: Users, color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" },
  { name: "Facebook", icon: Globe, color: "bg-blue-600 hover:bg-blue-700" },
  { name: "YouTube", icon: Play, color: "bg-red-600 hover:bg-red-700" }
]

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
    setFormData({ name: '', phone: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="contact" className="py-20 sm:py-24 lg:py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] dark:opacity-[0.03]" />
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
            <Phone className="h-4 w-4 mr-2" />
            Bog'lanish
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6">
            Biz bilan{' '}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Bog'laning
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Savollaringiz bormi? Bizga qo'ng'iroq qiling yoki xabar yuboring. 
            24 soat ichida javob beramiz.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Aloqa Ma'lumotlari
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Har qanday savol yoki takliflar uchun biz bilan bog'lanishingiz mumkin. 
                Sizning so'rovingizga 24 soat ichida javob beramiz.
              </p>
            </motion.div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className={`p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${info.color}`}>
                      <info.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {info.title}
                      </h4>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-sm text-gray-600 dark:text-gray-300">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="pt-8 border-t border-gray-200 dark:border-gray-800"
            >
              <h4 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
                Ijtimoiy Tarmoqlar
              </h4>
              <div className="flex flex-wrap gap-3">
                {socialMedia.map((social, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      className={`${social.color} text-white rounded-xl gap-2`}
                      size="sm"
                    >
                      <social.icon className="h-4 w-4" />
                      {social.name}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="border-2 border-gray-200 dark:border-gray-800 overflow-hidden">
              <CardContent className="p-6 lg:p-8">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mb-6">
                      <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                      Xabaringiz Yuborildi!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Tez orada operatorlarimiz siz bilan bog'lanadi. Rahmat!
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-900 dark:text-white">
                          Ismingiz *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Ismingizni kiriting"
                          required
                          className="rounded-xl border-2 focus:border-blue-500 dark:focus:border-blue-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-900 dark:text-white">
                          Telefon Raqam *
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+998 90 123 45 67"
                          required
                          className="rounded-xl border-2 focus:border-blue-500 dark:focus:border-blue-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-900 dark:text-white">
                        Email Manzil
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@misol.com"
                        className="rounded-xl border-2 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-gray-900 dark:text-white">
                        Mavzu *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Mavzuni kiriting"
                        required
                        className="rounded-xl border-2 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-900 dark:text-white">
                        Xabar *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Xabaringizni bu yerga yozing..."
                        rows={5}
                        required
                        className="rounded-xl border-2 focus:border-blue-500 dark:focus:border-blue-400 resize-none"
                      />
                    </div>

                    <div className="flex items-start space-x-3">
                      <input 
                        type="checkbox" 
                        id="consent" 
                        className="h-5 w-5 rounded border-2 text-blue-600 focus:ring-blue-500 mt-0.5" 
                        required 
                      />
                      <Label htmlFor="consent" className="text-sm text-gray-600 dark:text-gray-300">
                        Men shaxsiy ma'lumotlarni qayta ishlashga roziman *
                      </Label>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        type="submit" 
                        className="w-full gap-2 py-6 text-lg rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                      >
                        <Send className="h-5 w-5" />
                        Xabarni Yuborish
                      </Button>
                    </motion.div>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-800"
            >
              <div className="h-64 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-blue-500/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full mb-4">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">
                    Manzilimiz
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Toshkent shahar, Mirzo Ulug'bek tumani
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// // components/home/contact-section.tsx
// "use client"

// import { useState } from 'react'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Label } from '@/components/ui/label'
// import { Badge } from '@/components/ui/badge'
// import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'

// const contactInfo = [
//   {
//     icon: Phone,
//     title: "Telefon Raqamlar",
//     details: ["+998 90 123 45 67", "+998 71 234 56 78"],
//     color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20"
//   },
//   {
//     icon: Mail,
//     title: "Email Manzillar",
//     details: ["info@talim-olami.uz", "qabul@talim-olami.uz"],
//     color: "bg-green-500/10 text-green-600 dark:bg-green-500/20"
//   },
//   {
//     icon: MapPin,
//     title: "Manzilimiz",
//     details: ["Toshkent shahar, Mirzo Ulug'bek tumani, Universitet ko'chasi, 45-uy"],
//     color: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20"
//   },
//   {
//     icon: Clock,
//     title: "Ish Vaqtlari",
//     details: ["Dushanba - Shanba: 08:00 - 20:00", "Yakshanba: 10:00 - 16:00"],
//     color: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20"
//   }
// ]

// export function ContactSection() {
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     subject: '',
//     message: ''
//   })
//   const [isSubmitted, setIsSubmitted] = useState(false)

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     // Bu yerda form ma'lumotlarini backendga yuborish
//     console.log('Form submitted:', formData)
//     setIsSubmitted(true)
//     setTimeout(() => setIsSubmitted(false), 3000)
//     setFormData({ name: '', phone: '', email: '', subject: '', message: '' })
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   return (
//     <section id="contact" className="py-20 bg-gradient-to-b from-muted/20 to-background">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <Badge variant="outline" className="mb-4 px-4 py-1 text-sm">
//             <Phone className="h-3 w-3 mr-2" />
//             Bog'lanish
//           </Badge>
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">Biz bilan Bog'laning</h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             Savollaringiz bormi? Bizga qo'ng'iroq qiling yoki xabar yuboring
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Contact Info */}
//           <div className="space-y-6">
//             <h3 className="text-2xl font-bold">Aloqa Ma'lumotlari</h3>
//             <p className="text-muted-foreground">
//               Har qanday savol yoki takliflar uchun biz bilan bog'lanishingiz mumkin. 
//               Sizning so'rovingizga 24 soat ichida javob beramiz.
//             </p>
            
//             <div className="space-y-4">
//               {contactInfo.map((info, index) => (
//                 <div key={index} className="flex items-start gap-4 p-4 rounded-lg border bg-card">
//                   <div className={`p-3 rounded-lg ${info.color}`}>
//                     <info.icon className="h-6 w-6" />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold mb-1">{info.title}</h4>
//                     {info.details.map((detail, idx) => (
//                       <p key={idx} className="text-sm text-muted-foreground">{detail}</p>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Social Media */}
//             <div className="pt-6 border-t">
//               <h4 className="font-semibold mb-4">Ijtimoiy Tarmoqlar</h4>
//               <div className="flex gap-3">
//                 {['Telegram', 'Instagram', 'Facebook', 'YouTube'].map((social) => (
//                   <Button key={social} variant="outline" size="sm">
//                     {social}
//                   </Button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Contact Form */}
//           <div className="lg:col-span-2">
//             <Card className="border-2">
//               <CardContent className="p-6">
//                 {isSubmitted ? (
//                   <div className="text-center py-12">
//                     <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
//                     <h3 className="text-2xl font-bold mb-2">Xabaringiz Yuborildi!</h3>
//                     <p className="text-muted-foreground">
//                       Tez orada operatorlarimiz siz bilan bog'lanadi. Rahmat!
//                     </p>
//                   </div>
//                 ) : (
//                   <form onSubmit={handleSubmit} className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div className="space-y-2">
//                         <Label htmlFor="name">Ismingiz *</Label>
//                         <Input
//                           id="name"
//                           name="name"
//                           value={formData.name}
//                           onChange={handleChange}
//                           placeholder="Ismingizni kiriting"
//                           required
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="phone">Telefon Raqam *</Label>
//                         <Input
//                           id="phone"
//                           name="phone"
//                           value={formData.phone}
//                           onChange={handleChange}
//                           placeholder="+998 90 123 45 67"
//                           required
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="email">Email Manzil</Label>
//                       <Input
//                         id="email"
//                         name="email"
//                         type="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         placeholder="email@misol.com"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="subject">Mavzu *</Label>
//                       <Input
//                         id="subject"
//                         name="subject"
//                         value={formData.subject}
//                         onChange={handleChange}
//                         placeholder="Mavzuni kiriting"
//                         required
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="message">Xabar *</Label>
//                       <Textarea
//                         id="message"
//                         name="message"
//                         value={formData.message}
//                         onChange={handleChange}
//                         placeholder="Xabaringizni bu yerga yozing..."
//                         rows={5}
//                         required
//                       />
//                     </div>

//                     <div className="flex items-center space-x-2">
//                       <input type="checkbox" id="consent" className="h-4 w-4" required />
//                       <Label htmlFor="consent" className="text-sm">
//                         Men shaxsiy ma'lumotlarni qayta ishlashga roziman *
//                       </Label>
//                     </div>

//                     <Button type="submit" className="w-full gap-2" size="lg">
//                       <Send className="h-4 w-4" />
//                       Xabarni Yuborish
//                     </Button>
//                   </form>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Map Placeholder */}
//             <div className="mt-8 rounded-xl overflow-hidden border-2">
//               <div className="h-64 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
//                 <div className="text-center">
//                   <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
//                   <h4 className="font-bold text-lg mb-2">Manzilimiz</h4>
//                   <p className="text-muted-foreground">Xaritada joylashuvimiz</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }