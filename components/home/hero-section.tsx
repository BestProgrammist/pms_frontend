// components/home/hero-section.tsx
"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronRight, Play, Users, Award, BookOpen, Sparkles, Target, TrendingUp, Star, CheckCircle, GraduationCap } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    {
      icon: Sparkles,
      title: "Innovatsion O'qitish",
      description: "Zamonaviy o'qitish metodlari",
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-600"
    },
    {
      icon: Target,
      title: "Individual Yondashuv",
      description: "Har bir o'quvchi uchun alohida dastur",
      color: "from-emerald-500/20 to-green-500/20",
      iconColor: "text-emerald-600"
    },
    {
      icon: TrendingUp,
      title: "100% Natija",
      description: "Kafolatlangan o'qitish",
      color: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-600"
    },
    {
      icon: Star,
      title: "Professional Ustozlar",
      description: "Tajribali o'qituvchilar",
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-600"
    }
  ]

  const stats = [
    { value: "15+", label: "O'quv Kurslari", icon: BookOpen },
    { value: "50+", label: "Ustozlar", icon: Users },
    { value: "2000+", label: "O'quvchilar", icon: GraduationCap },
    { value: "95%", label: "Muvaffaqiyat", icon: TrendingUp }
  ]

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-emerald-50/50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated floating shapes */}
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{ 
            y: [0, 40, 0],
            x: [0, -15, 0],
            rotate: [0, -8, 0]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tr from-emerald-200/30 to-transparent rounded-full blur-3xl"
        />
        
        {/* Grid overlay with animation */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] dark:opacity-[0.03]" />
        
        {/* Floating particles */}
        {mounted && Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-blue-400/30 to-emerald-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 60 - 30],
              x: [0, Math.random() * 40 - 20],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8 lg:space-y-10">
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="p-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">2024-yilning Eng Yaxshi</span>
                <p className="text-sm text-gray-600 dark:text-gray-300">O'quv Markazi</p>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                Kelajagingizni{' '}
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-blue-600 via-emerald-600 to-amber-500 bg-clip-text text-transparent">
                    Biz Bilan Quring
                  </span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-blue-100 via-emerald-100 to-amber-100 dark:from-blue-900/30 dark:via-emerald-900/30 dark:to-amber-900/30 rounded-lg -z-10"
                  />
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl"
            >
              Professional ustozlar, zamonaviy o'quv dasturlari va individual yondashuv bilan 
              bilimlar dunyosiga sayohat qiling. Sizning muvaffaqiyatingiz - bizning g'ururimiz.
            </motion.p>

            {/* Call to Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <Button 
                size="lg" 
                className="gap-3 px-8 py-6 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                asChild
              >
                <Link href="#courses">
                  Kurslarga Yozilish
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="gap-3 px-8 py-6 text-base sm:text-lg rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Play className="h-5 w-5" />
                Video Ko'rish
              </Button>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-10"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/30 dark:to-emerald-900/30 rounded-lg">
                      <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${index === 0 ? 'text-blue-600' : index === 1 ? 'text-emerald-600' : index === 2 ? 'text-amber-600' : 'text-purple-600'}`} />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 0.6 + index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 ${
                  index === 0 ? 'sm:col-span-2' : ''
                }`}
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className={`p-3 sm:p-4 rounded-xl bg-gradient-to-br ${feature.color}`}>
                    <feature.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${feature.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg sm:text-xl mb-1 sm:mb-2 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Testimonial Card */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: 1.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="sm:col-span-2 bg-gradient-to-br from-blue-500/10 via-emerald-500/10 to-transparent backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-lg border border-blue-200/30 dark:border-blue-500/10"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
                    A
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="italic text-gray-700 dark:text-gray-200 mb-4 sm:mb-5 text-base sm:text-lg leading-relaxed">
                    "Bu o'quv markazi mening hayotimni o'zgartirdi. Professional ustozlar, qulay muhit va zamonaviy o'qitish metodlari bilan har bir dars dam olishga aylanadi!"
                  </blockquote>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-lg">Azizov Sardor</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Matematika kursi bitiruvchisi, hozir TATU talabasi</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="mt-12 sm:mt-16 lg:mt-20 pt-8 sm:pt-10 border-t border-gray-200 dark:border-gray-800"
        >
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
            Bizning o'quvchilarimiz ishonadi
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 items-center">
            {[
              { name: "TATU", students: "150+ talaba" },
              { name: "INHA", students: "80+ talaba" },
              { name: "WIUT", students: "120+ talaba" },
              { name: "MSU", students: "90+ talaba" }
            ].map((uni, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                  {uni.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {uni.students}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      {mounted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
        >
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400 dark:text-gray-500 mb-2 animate-pulse">
              Pastga aylantiring
            </span>
            <motion.div
              animate={{ 
                y: [0, 8, 0],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-5 h-9 border-2 border-gray-300 dark:border-gray-600 rounded-full flex justify-center pt-1"
            >
              <div className="w-1 h-3 bg-gradient-to-b from-blue-500 to-emerald-500 rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </section>
  )
}