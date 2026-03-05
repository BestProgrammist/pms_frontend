"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Train,
  Truck,
  Wrench,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
  Gauge,
  Activity,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  BarChart3,
  AlertTriangle,
  Users,
  Building2,
  FileText,
} from 'lucide-react'

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts'

import { useVagonStatistics } from '@/lib/hooks/useVagon'
import { useTamirJadvalStatistics } from '@/lib/hooks/useTamirJadval'
import { useVagonTamirMuddatlari } from '@/lib/hooks/useTamir'
import { useVagonTurlari } from '@/lib/hooks/useVagon'
import { useTashkilotlar } from '@/lib/hooks/useTashkilot'
import { Skeleton } from '@/components/ui/skeleton'

// Holat ranglari
const holatColors = {
  active: '#10b981',
  repair: '#f59e0b',
  broken: '#ef4444',
  decommissioned: '#6b7280',
}

const tamirHolatColors = {
  rejalashtirilgan: '#3b82f6',
  jarayonda: '#f59e0b',
  tugallangan: '#10b981',
  bekor_qilingan: '#ef4444',
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()} {entry.name.includes('km') ? 'km' : ''}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const { data: vagonStats, isLoading: vagonStatsLoading } = useVagonStatistics()
  const { data: tamirStats, isLoading: tamirStatsLoading } = useTamirJadvalStatistics()
  const { data: muddatlar } = useVagonTamirMuddatlari({ limit: 100 })
  const { data: vagonTurlari } = useVagonTurlari({ limit: 100 })
  const { data: tashkilotlar } = useTashkilotlar({ limit: 100 })
  console.log(vagonTurlari);
  

  // Vagon holati bo'yicha ma'lumotlar
  const vagonHolatData = vagonStats ? [
    { name: 'Faol', value: vagonStats.active, color: holatColors.active },
    { name: 'Ta\'mirda', value: vagonStats.repair, color: holatColors.repair },
    { name: 'Buzuq', value: vagonStats.broken, color: holatColors.broken },
    { name: 'Foydalanilmaydi', value: vagonStats.decommissioned, color: holatColors.decommissioned },
  ] : []

  // Tamir holati bo'yicha ma'lumotlar
  const tamirHolatData = tamirStats ? [
    { name: 'Rejalashtirilgan', value: tamirStats.rejalashtirilgan, color: tamirHolatColors.rejalashtirilgan },
    { name: 'Jarayonda', value: tamirStats.jarayonda, color: tamirHolatColors.jarayonda },
    { name: 'Tugallangan', value: tamirStats.tugallangan, color: tamirHolatColors.tugallangan },
    { name: 'Bekor qilingan', value: tamirStats.bekorQilingan, color: tamirHolatColors.bekor_qilingan },
  ] : []

  // Kunlik tamir statistikasi (oxirgi 7 kun)
  const dailyRepairData = [
    { date: '03-04', rejalashtirilgan: 5, jarayonda: 3, tugallangan: 2 },
    { date: '03-05', rejalashtirilgan: 7, jarayonda: 4, tugallangan: 3 },
    { date: '03-06', rejalashtirilgan: 4, jarayonda: 5, tugallangan: 4 },
    { date: '03-07', rejalashtirilgan: 6, jarayonda: 3, tugallangan: 5 },
    { date: '03-08', rejalashtirilgan: 8, jarayonda: 4, tugallangan: 6 },
    { date: '03-09', rejalashtirilgan: 5, jarayonda: 6, tugallangan: 4 },
    { date: '03-10', rejalashtirilgan: 6, jarayonda: 4, tugallangan: 7 },
  ]

  // Vagon turlari bo'yicha statistika
  const vagonTuriData = vagonTurlari?.items?.map(tur => ({
    name: tur.nomi,
    kod: tur.kodli,
    soni: tur.vagonlar?.length || 0,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
  })) || []

  // Km limitiga yaqin vagonlar
  const kmLimitData = [
    { name: 'Vagon-001', foiz: 95, km: 95000, limit: 100000 },
    { name: 'Vagon-045', foiz: 92, km: 92000, limit: 100000 },
    { name: 'Vagon-123', foiz: 88, km: 88000, limit: 100000 },
    { name: 'Vagon-067', foiz: 85, km: 85000, limit: 100000 },
    { name: 'Vagon-089', foiz: 82, km: 82000, limit: 100000 },
  ]

  if (vagonStatsLoading || tamirStatsLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Vagon ta'miri boshqaruvi
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Vagonlar, ta'mir turlari va jadvallar bo'yicha real vaqtdagi analitika
        </p>
      </motion.div>

      {/* Asosiy statistik kartalar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {vagonStats?.total || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Jami vagonlar</div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Train className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <span className="text-emerald-600">{vagonStats?.active || 0} faol</span> | 
              <span className="text-amber-600 ml-1">{vagonStats?.repair || 0} ta'mirda</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {tamirStats?.jarayonda || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Jarayondagi ta'mirlar</div>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Wrench className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <span className="text-blue-600">{tamirStats?.rejalashtirilgan || 0} reja</span> |
              <span className="text-emerald-600 ml-1">{tamirStats?.tugallangan || 0} tugallangan</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {tamirStats?.bugungi || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Bugungi ta'mirlar</div>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Rejalashtirilgan ta'mirlar
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {tamirStats?.muddatiOtgan || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Muddati o'tganlar</div>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Ac {tamirStats?.muddatiOtgan || 0} ta'mir muddati o'tgan
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Ikkinchi qator - Analitika */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vagonlar tahlili */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="border-2 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Vagonlar tahlili
              </CardTitle>
              <CardDescription>
                Vagonlarning holati bo'yicha taqsimoti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  {vagonStats?.total || 0}
                </div>
                <div className="text-sm text-gray-500">Jami vagonlar soni</div>
              </div>

              <div className="space-y-4">
                {vagonHolatData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: item.color }}>{item.name}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                    <Progress 
                      value={(item.value / (vagonStats?.total || 1)) * 100} 
                      className="h-2"
                      style={{ '--progress-background': item.color } as any}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Faol vagonlar foizi</span>
                  <span className="font-bold text-emerald-600">
                    {vagonStats?.active?Math.round((vagonStats?.active / (vagonStats?.total || 1)) * 100):0}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600 dark:text-gray-400">Ta'mir talab qiladiganlar</span>
                  <span className="font-bold text-amber-600">
                    {((vagonStats?.broken || 0) + (vagonStats?.repair || 0))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Ta'mir tahlili */}
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-1"
        >
          <Card className="border-2 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                Ta'mir tahlili
              </CardTitle>
              <CardDescription>
                Ta'mirlarning holati bo'yicha taqsimoti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  {tamirStats?.total || 0}
                </div>
                <div className="text-sm text-gray-500">Jami ta'mir jadvallari</div>
              </div>

              <div className="space-y-4">
                {tamirHolatData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: item.color }}>{item.name}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                    <Progress 
                      value={(item.value / (tamirStats?.total || 1)) * 100} 
                      className="h-2"
                      style={{ '--progress-background': item.color } as any}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {tamirStats?.bugungi || 0}
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">Bugungi</div>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                  <div className="text-xl font-bold text-red-600 dark:text-red-400">
                    {tamirStats?.muddatiOtgan || 0}
                  </div>
                  <div className="text-xs text-red-700 dark:text-red-300">Muddati o'tgan</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tashkilotlar va muddatlar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <Card className="border-2 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Tashkilotlar va muddatlar
              </CardTitle>
              <CardDescription>
                Faol tashkilotlar va ta'mir muddatlari
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {tashkilotlar?.total || 0}
                  </div>
                  <div className="text-sm text-gray-500">Tashkilotlar</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {muddatlar?.total || 0}
                  </div>
                  <div className="text-sm text-gray-500">Muddatlar</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span className="text-sm">O'rtacha muddat</span>
                  </div>
                  <span className="font-bold">24 oy</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm">O'rtacha km limit</span>
                  </div>
                  <span className="font-bold">150,000 km</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Faol muddatlar</span>
                  </div>
                  <span className="font-bold">{muddatlar?.total || 0}</span>
                </div>
              </div>

              <div className="mt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/tashkilotlar">
                    <Building2 className="h-4 w-4 mr-2" />
                    Tashkilotlarni ko'rish
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Uchinchi qator - Diagrammalar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vagon holati Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" />
                Vagonlar holati
              </CardTitle>
              <CardDescription>
                Vagonlarning holati bo'yicha foizli taqsimoti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={vagonHolatData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${percent && (percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {vagonHolatData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend va statistika */}
                <div className="space-y-4">
                  {vagonHolatData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{item.value}</span>
                        <span className="text-xs text-gray-500 w-12 text-right">
                          {((item.value / (vagonStats?.total || 1)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 mt-2 border-t">
                    <div className="flex justify-between font-medium">
                      <span>Jami vagonlar</span>
                      <span>{vagonStats?.total || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Kunlik ta'mir statistikasi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Kunlik ta'mir statistikasi
              </CardTitle>
              <CardDescription>
                Oxirgi 7 kun ichidagi ta'mirlar dinamikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyRepairData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="rejalashtirilgan" fill="#3b82f6" name="Rejalashtirilgan" />
                    <Bar dataKey="jarayonda" fill="#f59e0b" name="Jarayonda" />
                    <Bar dataKey="tugallangan" fill="#10b981" name="Tugallangan" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center gap-4 mt-6">
                <Button variant="outline" size="sm" className="min-w-[60px]">03-04</Button>
                <Button variant="default" size="sm" className="min-w-[60px]">03-05</Button>
                <Button variant="outline" size="sm" className="min-w-[60px]">03-06</Button>
                <Button variant="outline" size="sm" className="min-w-[60px]">03-07</Button>
                <Button variant="outline" size="sm" className="min-w-[60px]">03-08</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* To'rtinchi qator - KM limitlari va vagon turlari */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* KM limitiga yaqin vagonlar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                KM limitiga yaqin vagonlar
              </CardTitle>
              <CardDescription>
                Ta'mir talab qiladigan vagonlar (limitning 80% dan oshgan)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {kmLimitData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {item.km.toLocaleString()} / {item.limit.toLocaleString()} km
                        </span>
                      </div>
                      <Badge className={item.foiz > 90 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}>
                        {item.foiz}%
                      </Badge>
                    </div>
                    <Progress 
                      value={item.foiz} 
                      className={`h-2 ${item.foiz > 90 ? '[&>div]:bg-red-600' : '[&>div]:bg-amber-600'}`} 
                    />
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-6" asChild>
                <Link href="/dashboard/vagonlar?km-limit=critical">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Barcha kritik vagonlarni ko'rish
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vagon turlari bo'yicha statistika */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Train className="h-5 w-5 text-primary" />
                Vagon turlari bo'yicha statistika
              </CardTitle>
              <CardDescription>
                Har bir vagon turidagi vagonlar soni
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vagonTuriData.slice(0, 5)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="soni" fill="#3b82f6" name="Vagonlar soni" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 mt-4">
                {vagonTuriData.slice(0, 5).map((tur, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div>
                      <span className="font-medium">{tur.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({tur.kod})</span>
                    </div>
                    <Badge variant="outline">{tur.soni} ta</Badge>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/dashboard/vagon-turlari">
                  <Train className="h-4 w-4 mr-2" />
                  Barcha vagon turlarini ko'rish
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Oxirgi qator - Tezkor harakatlar va xabarlar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-6"
      >
        <Card className="border-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Tezkor harakatlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                <Link href="/dashboard/tamir-jadvallari/create">
                  <Wrench className="h-6 w-6" />
                  <span>Yangi ta'mir</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                <Link href="/dashboard/vagonlar/create">
                  <Truck className="h-6 w-6" />
                  <span>Yangi vagon</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                <Link href="/dashboard/vagon-turlari/create">
                  <Train className="h-6 w-6" />
                  <span>Yangi vagon turi</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                <Link href="/dashboard/tashkilotlar/create">
                  <Building2 className="h-6 w-6" />
                  <span>Yangi tashkilot</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Ogohlantirishlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700 dark:text-red-300">
                  {tamirStats?.muddatiOtgan || 0} ta muddati o'tgan ta'mir
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-amber-700 dark:text-amber-300">
                  {kmLimitData.length} ta vagon km limitiga yaqin
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  {tamirStats?.bugungi || 0} ta bugungi ta'mir
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// "use client"

// import { motion } from 'framer-motion'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card'
// import { Progress } from '@/components/ui/progress'
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import {
//   Users,
//   UserCheck,
//   UserX,
//   UserCog,
//   Wifi,
//   WifiOff,
//   Clock,
//   Calendar,
//   TrendingUp,
//   TrendingDown,
//   Activity,
//   PieChart as PieChartIcon,
//   BarChart3,
// } from 'lucide-react'

// import {
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   AreaChart,
//   Area,
// } from 'recharts'
// import { Button } from '@/components/ui/button'

// // Statistik ma'lumotlar
// const statsData = {
//   totalEmployees: 747,
//   cameToWork: 198,
//   notCameToWork: 60,
//   atWork: 170,
//   notAtWork: 28,
//   planned: 302,
//   earlyLeavers: 45,
//   lateComers: 32,
// }

// // Qurilmalar ma'lumotlari
// const deviceData = {
//   totalDevices: 2,
//   onlineDevices: 2,
//   offlineDevices: 0,
//   onlinePercentage: 100,
// }

// // Imtiyozli xodimlar ma'lumotlari
// const benefitData = [
//   { name: 'Imtiyozli', value: 1, percentage: 0.1, color: '#3b82f6' },
//   { name: 'O\'tmaydiganlar', value: 361, percentage: 48.3, color: '#ef4444' },
//   { name: 'Ta\'tildagilar', value: 75, percentage: 10.0, color: '#f59e0b' },
//   { name: 'Dam oluvchilar', value: 90, percentage: 12.0, color: '#10b981' },
//   { name: 'Boshqalar', value: 220, percentage: 29.6, color: '#8b5cf6' },
// ]

// // Kunlik ishga kelish statistikasi
// const dailyAttendanceData = [
//   { date: '03-04', kelganlar: 185, kelmaganlar: 55, reja: 240 },
//   { date: '03-05', kelganlar: 198, kelmaganlar: 60, reja: 258 },
//   { date: '03-06', kelganlar: 192, kelmaganlar: 58, reja: 250 },
//   { date: '03-07', kelganlar: 205, kelmaganlar: 45, reja: 250 },
//   { date: '03-08', kelganlar: 210, kelmaganlar: 40, reja: 250 },
//   { date: '03-09', kelganlar: 195, kelmaganlar: 55, reja: 250 },
//   { date: '03-10', kelganlar: 188, kelmaganlar: 62, reja: 250 },
// ]

// // Ish vaqti tahlili
// const workTimeData = [
//   { time: '08:00', kelganlar: 45 },
//   { time: '08:30', kelganlar: 120 },
//   { time: '09:00', kelganlar: 198 },
//   { time: '09:30', kelganlar: 210 },
//   { time: '10:00', kelganlar: 205 },
//   { time: '10:30', kelganlar: 195 },
//   { time: '11:00', kelganlar: 180 },
// ]

// // Bo'limlar bo'yicha statistika
// const departmentData = [
//   { name: 'Ishlab chiqarish', kelganlar: 85, kelmaganlar: 15, jami: 100 },
//   { name: 'Muhandislik', kelganlar: 42, kelmaganlar: 8, jami: 50 },
//   { name: 'Administratsiya', kelganlar: 28, kelmaganlar: 7, jami: 35 },
//   { name: 'Logistika', kelganlar: 35, kelmaganlar: 10, jami: 45 },
//   { name: 'Ta\'mirlash', kelganlar: 8, kelmaganlar: 2, jami: 10 },
// ]

// const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#6366f1']

// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
//         <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
//         {payload.map((entry: any, index: number) => (
//           <p key={index} className="text-sm" style={{ color: entry.color }}>
//             {entry.name}: {entry.value}
//           </p>
//         ))}
//       </div>
//     )
//   }
//   return null
// }

// export default function DashboardPage() {
//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex flex-col gap-2"
//       >
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//           Dashboard
//         </h1>
//         <p className="text-gray-600 dark:text-gray-300">
//           Xodimlarning grafik jadvallari va turniket orqali olingan ma'lumotlar asosida real vaqtdagi analitika
//         </p>
//       </motion.div>

//       {/* Main Stats Cards */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.1 }}
//         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
//       >
//         <Card className="border-2 hover:shadow-lg transition-all">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
//                   {statsData.cameToWork}
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">Ishga kelgan xodimlar</div>
//               </div>
//               <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
//                 <UserCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
//               </div>
//             </div>
//             <div className="mt-2 text-xs text-gray-500">
//               Reja: {statsData.planned} | {Math.round((statsData.cameToWork / statsData.planned) * 100)}%
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-2 hover:shadow-lg transition-all">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-3xl font-bold text-red-600 dark:text-red-400">
//                   {statsData.notCameToWork}
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">Ishga kelmagan xodimlar</div>
//               </div>
//               <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
//                 <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
//               </div>
//             </div>
//             <div className="mt-2 text-xs text-gray-500">
//               {Math.round((statsData.notCameToWork / statsData.totalEmployees) * 100)}% umumiy sondan
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-2 hover:shadow-lg transition-all">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
//                   {statsData.atWork}
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">Ishxonadagi xodimlar</div>
//               </div>
//               <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//                 <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//               </div>
//             </div>
//             <div className="mt-2 text-xs text-gray-500">
//               Hozir ishxonada {statsData.atWork} kishi
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-2 hover:shadow-lg transition-all">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
//                   {statsData.notAtWork}
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">Ishxonada yo'q xodimlar</div>
//               </div>
//               <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
//                 <UserCog className="h-6 w-6 text-amber-600 dark:text-amber-400" />
//               </div>
//             </div>
//             <div className="mt-2 text-xs text-gray-500">
//               Turli sabablarga ko'ra
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Second Row - Analytics */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Xodimlar tahlili */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.2 }}
//           className="lg:col-span-1"
//         >
//           <Card className="border-2 h-full">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <BarChart3 className="h-5 w-5 text-primary" />
//                 Xodimlar tahlili
//               </CardTitle>
//               <CardDescription>
//                 Ishga kelish va kelmaslik bo'yicha qisqa tahlil
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="text-center mb-6">
//                 <div className="text-4xl font-bold text-gray-900 dark:text-white">
//                   {statsData.totalEmployees}
//                 </div>
//                 <div className="text-sm text-gray-500">Korxonaning umumiy xodimlar soni</div>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="text-gray-600 dark:text-gray-400">Rejalashtirilgan</span>
//                     <span className="font-medium">{statsData.planned}</span>
//                   </div>
//                   <Progress value={(statsData.planned / statsData.totalEmployees) * 100} className="h-2" />
//                 </div>

//                 <div>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="text-emerald-600 dark:text-emerald-400">Kelganlar</span>
//                     <span className="font-medium text-emerald-600 dark:text-emerald-400">
//                       {statsData.cameToWork}
//                     </span>
//                   </div>
//                   <Progress 
//                     value={(statsData.cameToWork / statsData.totalEmployees) * 100} 
//                     className="h-2 [&>div]:bg-emerald-600" 
//                   />
//                 </div>

//                 <div>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="text-red-600 dark:text-red-400">Kelmaganlar</span>
//                     <span className="font-medium text-red-600 dark:text-red-400">
//                       {statsData.notCameToWork}
//                     </span>
//                   </div>
//                   <Progress 
//                     value={(statsData.notCameToWork / statsData.totalEmployees) * 100} 
//                     className="h-2 [&>div]:bg-red-600" 
//                   />
//                 </div>
//               </div>

//               <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-gray-600 dark:text-gray-400">Kelish foizi</span>
//                   <span className="font-bold text-emerald-600">
//                     {Math.round((statsData.cameToWork / statsData.planned) * 100)}%
//                   </span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Qurilmalar tahlili */}
//         <motion.div
//           initial={{ opacity: 0, y: 0 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.25 }}
//           className="lg:col-span-1"
//         >
//           <Card className="border-2 h-full">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Activity className="h-5 w-5 text-primary" />
//                 Qurilmalar tahlili
//               </CardTitle>
//               <CardDescription>
//                 Qurilmalar holati bo'yicha qisqa tahlil
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="text-center mb-6">
//                 <div className="text-4xl font-bold text-gray-900 dark:text-white">
//                   {deviceData.totalDevices}
//                 </div>
//                 <div className="text-sm text-gray-500">Barcha qurilmalar soni</div>
//               </div>

//               <div className="space-y-6">
//                 <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <Wifi className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
//                     <div>
//                       <div className="text-sm text-gray-600 dark:text-gray-400">Onlayn qurilmalar</div>
//                       <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
//                         {deviceData.onlineDevices}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
//                     {deviceData.onlinePercentage}%
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <WifiOff className="h-5 w-5 text-gray-400" />
//                     <div>
//                       <div className="text-sm text-gray-600 dark:text-gray-400">Offlayn qurilmalar</div>
//                       <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
//                         {deviceData.offlineDevices}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
//                     0%
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-6">
//                 <div className="flex justify-center">
//                   <div className="w-24 h-24 rounded-full border-8 border-emerald-500 flex items-center justify-center">
//                     <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
//                       100%
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Ish vaqti tahlili */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.3 }}
//           className="lg:col-span-1"
//         >
//           <Card className="border-2 h-full">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Clock className="h-5 w-5 text-primary" />
//                 Ish vaqti tahlili
//               </CardTitle>
//               <CardDescription>
//                 Xodimlarning ishga kelish va ketish vaqtlari
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="text-center mb-6">
//                 <div className="text-4xl font-bold text-gray-900 dark:text-white">
//                   {statsData.totalEmployees}
//                 </div>
//                 <div className="text-sm text-gray-500">Barcha xodimlar</div>
//               </div>

//               <div className="space-y-4">
//                 <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
//                   <div className="flex items-center gap-2">
//                     <TrendingDown className="h-4 w-4 text-amber-600" />
//                     <span className="text-sm text-amber-700 dark:text-amber-300">Erta ketgan xodimlar</span>
//                   </div>
//                   <span className="font-bold text-amber-600 dark:text-amber-400">
//                     {statsData.earlyLeavers}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
//                   <div className="flex items-center gap-2">
//                     <TrendingUp className="h-4 w-4 text-red-600" />
//                     <span className="text-sm text-red-700 dark:text-red-300">Kech kelgan xodimlar</span>
//                   </div>
//                   <span className="font-bold text-red-600 dark:text-red-400">
//                     {statsData.lateComers}
//                   </span>
//                 </div>
//               </div>

//               {/* Small chart for work time */}
//               <div className="mt-6 h-32">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <AreaChart data={workTimeData}>
//                     <Area 
//                       type="monotone" 
//                       dataKey="kelganlar" 
//                       stroke="#3b82f6" 
//                       fill="#3b82f6" 
//                       fillOpacity={0.2} 
//                     />
//                     <Tooltip content={<CustomTooltip />} />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Third Row - Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Imtiyozli xodimlar - Pie Chart */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.35 }}
//         >
//           <Card className="border-2">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <PieChartIcon className="h-5 w-5 text-primary" />
//                 Imtiyozli xodimlar
//               </CardTitle>
//               <CardDescription>
//                 Ishga kelmaydigan va imtiyozli xodimlarning turlari bo'yicha
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Pie Chart */}
//                 <div className="h-[200px] flex items-center justify-center">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={benefitData}
//                         cx="50%"
//                         cy="50%"
//                         innerRadius={60}
//                         outerRadius={80}
//                         paddingAngle={2}
//                         dataKey="value"
//                       >
//                         {benefitData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <Tooltip content={<CustomTooltip />} />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>

//                 {/* Legend and Stats */}
//                 <div className="space-y-3">
//                   {benefitData.map((item, index) => (
//                     <div key={index} className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <div 
//                           className="w-3 h-3 rounded-full" 
//                           style={{ backgroundColor: item.color }}
//                         />
//                         <span className="text-sm text-gray-600 dark:text-gray-400">
//                           {item.name}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-3">
//                         <span className="font-medium">{item.value}</span>
//                         <span className="text-xs text-gray-500 w-12 text-right">
//                           {item.percentage}%
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Summary Cards */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
//                 {benefitData.slice(0, 4).map((item, index) => (
//                   <div key={index} className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
//                     <div className="text-xl font-bold" style={{ color: item.color }}>
//                       {item.value}
//                     </div>
//                     <div className="text-xs text-gray-500">{item.name}</div>
//                     <div className="text-xs text-gray-400">{item.percentage}%</div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Kunlik attendance chart */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//         >
//           <Card className="border-2">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Calendar className="h-5 w-5 text-primary" />
//                 Kunlik ishga kelish statistikasi
//               </CardTitle>
//               <CardDescription>
//                 03-04 dan 03-10 gacha bo'lgan davr
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[300px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={dailyAttendanceData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="date" />
//                     <YAxis />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Legend />
//                     <Bar dataKey="kelganlar" fill="#10b981" name="Kelganlar" />
//                     <Bar dataKey="kelmaganlar" fill="#ef4444" name="Kelmaganlar" />
//                     <Bar dataKey="reja" fill="#3b82f6" name="Reja" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Date selectors */}
//               <div className="flex justify-center gap-4 mt-6">
//                 {['03-04', '03-05', '03-06'].map((date, index) => (
//                   <Button
//                     key={index}
//                     variant={index === 1 ? "default" : "outline"}
//                     size="sm"
//                     className="min-w-[60px]"
//                   >
//                     {date}
//                   </Button>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Fourth Row - Department Statistics */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.45 }}
//       >
//         <Card className="border-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Users className="h-5 w-5 text-primary" />
//               Bo'limlar bo'yicha statistika
//             </CardTitle>
//             <CardDescription>
//               Har bir bo'limda ishga kelgan va kelmagan xodimlar
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {departmentData.map((dept, index) => (
//                 <div key={index} className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <span className="font-medium">{dept.name}</span>
//                       <span className="text-sm text-gray-500 ml-2">
//                         (Jami: {dept.jami})
//                       </span>
//                     </div>
//                     <div className="flex gap-4 text-sm">
//                       <span className="text-emerald-600 dark:text-emerald-400">
//                         Kelgan: {dept.kelganlar}
//                       </span>
//                       <span className="text-red-600 dark:text-red-400">
//                         Kelmagan: {dept.kelmaganlar}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="flex gap-1 h-2">
//                     <div 
//                       className="bg-emerald-500 rounded-l-full" 
//                       style={{ width: `${(dept.kelganlar / dept.jami) * 100}%` }}
//                     />
//                     <div 
//                       className="bg-red-500 rounded-r-full" 
//                       style={{ width: `${(dept.kelmaganlar / dept.jami) * 100}%` }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-emerald-500 rounded-full" />
//                     <span className="text-sm">Kelganlar: {departmentData.reduce((acc, d) => acc + d.kelganlar, 0)}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-red-500 rounded-full" />
//                     <span className="text-sm">Kelmaganlar: {departmentData.reduce((acc, d) => acc + d.kelmaganlar, 0)}</span>
//                   </div>
//                 </div>
//                 <div className="text-sm text-gray-500">
//                   O'rtacha kelish: {Math.round(departmentData.reduce((acc, d) => acc + (d.kelganlar / d.jami) * 100, 0) / departmentData.length)}%
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   )
// }