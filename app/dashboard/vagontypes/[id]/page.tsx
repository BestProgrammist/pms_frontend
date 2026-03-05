"use client"

import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowLeft,
  Train,
  Edit,
  Trash2,
  Calendar,
  FileText,
  Truck,
  Wrench,
  Clock,
  AlertCircle,
  Gauge,
  MapPin,
  Info,
  Layers,
  Plus,
  Eye,
} from 'lucide-react'
import { useVagonTuri, useDeleteVagonTuri } from '@/lib/hooks/useVagon'
import { useVagonlar } from '@/lib/hooks/useVagon'
import { VagonHolati } from '@/types/vagon'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import { Skeleton } from '@/components/ui/skeleton'

const holatColors = {
  [VagonHolati.ACTIVE]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  [VagonHolati.REPAIR]: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  [VagonHolati.BROKEN]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  [VagonHolati.DECOMMISSIONED]: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
}

const holatIcons = {
  [VagonHolati.ACTIVE]: Truck,
  [VagonHolati.REPAIR]: Wrench,
  [VagonHolati.BROKEN]: AlertCircle,
  [VagonHolati.DECOMMISSIONED]: FileText,
}

export default function VagonTuriDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = parseInt(params.id as string)

  const { data: tur, isLoading } = useVagonTuri(id)
  const { data: vagonlarData } = useVagonlar({ vagonTuriId: id })
  const deleteMutation = useDeleteVagonTuri()

  const handleDelete = async () => {
    if (window.confirm(`"${tur?.nomi}" vagon turini o'chirishni tasdiqlaysizmi?`)) {
      try {
        await deleteMutation.mutateAsync(id)
        router.push('/dashboard/vagon-turlari')
      } catch (error) {
        console.error('O\'chirishda xatolik:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-10 w-64" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!tur) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Vagon turi topilmadi
        </h2>
        <Button className="mt-4" onClick={() => router.back()}>
          Orqaga qaytish
        </Button>
      </div>
    )
  }

  const vagonlar = vagonlarData?.items || []
  const activeVagons = vagonlar.filter(v => v.holati === VagonHolati.ACTIVE)
  const repairVagons = vagonlar.filter(v => v.holati === VagonHolati.REPAIR)
  const brokenVagons = vagonlar.filter(v => v.holati === VagonHolati.BROKEN)

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {tur.nomi}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Vagon turi haqida batafsil ma'lumot
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/vagon-turlari/${id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Tahrirlash
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            O'chirish
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Basic Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Asosiy ma'lumotlar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Train className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mt-4">{tur.nomi}</h2>
                <Badge variant="outline" className="mt-2 font-mono text-lg px-3 py-1">
                  {tur.kodli}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Tavsifi</h3>
                  <p className="text-gray-900 dark:text-white">
                    {tur.tavsifi || 'Tavsif mavjud emas'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="text-sm text-gray-500">Qo'shilgan sana</div>
                    <div className="font-medium flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {format(new Date(tur.yaratilganVaqt), 'dd.MM.yyyy', { locale: uz })}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="text-sm text-gray-500">Vagonlar soni</div>
                    <div className="font-medium flex items-center gap-1 mt-1">
                      <Truck className="h-4 w-4 text-gray-400" />
                      {vagonlar.length} ta
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card className="border-2 mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Statistika
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                  <span className="text-emerald-700 dark:text-emerald-300">Faol vagonlar</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeVagons.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <span className="text-amber-700 dark:text-amber-300">Ta'mirdagi vagonlar</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{repairVagons.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <span className="text-red-700 dark:text-red-300">Buzuq vagonlar</span>
                  <span className="font-bold text-red-600 dark:text-red-400">{brokenVagons.length}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Jami masofa</span>
                  <span className="font-bold">
                    {vagonlar.reduce((sum, v) => sum + v.bosibOtganKm, 0).toLocaleString()} km
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column - Tabs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Tabs defaultValue="vagons" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="vagons" className="gap-2">
                <Truck className="h-4 w-4" />
                Vagonlar ({vagonlar.length})
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="gap-2">
                <Wrench className="h-4 w-4" />
                Ta'mir muddatlari
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vagons">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Vagonlar ro'yxati
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {vagonlar.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Raqami</TableHead>
                          <TableHead>Holati</TableHead>
                          <TableHead>Ishlab chiqarilgan</TableHead>
                          <TableHead>Bosib o'tgan km</TableHead>
                          <TableHead className="text-right">Amallar</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vagonlar.map((vagon) => {
                          const HolatIcon = holatIcons[vagon.holati]
                          return (
                            <TableRow key={vagon.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                              <TableCell className="font-medium">{vagon.raqami}</TableCell>
                              <TableCell>
                                <Badge className={holatColors[vagon.holati]}>
                                  <HolatIcon className="h-3 w-3 mr-1" />
                                  {vagon.holati === VagonHolati.ACTIVE && 'Faol'}
                                  {vagon.holati === VagonHolati.REPAIR && 'Ta\'mirda'}
                                  {vagon.holati === VagonHolati.BROKEN && 'Buzuq'}
                                  {vagon.holati === VagonHolati.DECOMMISSIONED && 'Foydalanilmaydi'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {format(new Date(vagon.ishlabChigarilganSana), 'dd.MM.yyyy')}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Gauge className="h-4 w-4 text-gray-400" />
                                  {vagon.bosibOtganKm.toLocaleString()} km
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/dashboard/vagonlar/${vagon.id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ko'rish
                                  </Link>
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <Truck className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Bu turga tegishli vagonlar mavjud emas
                      </p>
                      <Button variant="outline" className="mt-4" asChild>
                        <Link href="/dashboard/vagonlar/create">
                          <Plus className="h-4 w-4 mr-2" />
                          Yangi vagon qo'shish
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Ta'mir muddatlari
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tur.tamirMuddatlari && tur.tamirMuddatlari.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ta'mir turi</TableHead>
                          <TableHead>Muddat (oy)</TableHead>
                          <TableHead>Maksimal km</TableHead>
                          <TableHead>Holati</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tur.tamirMuddatlari.map((muddat) => (
                          <TableRow key={muddat.id}>
                            <TableCell>{muddat.tamirTuri?.nomi || 'Noma\'lum'}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{muddat.muddatOy} oy</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{muddat.maksimalKm.toLocaleString()} km</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-emerald-100 text-emerald-800">
                                Faol
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Ta'mir muddatlari belgilanmagan
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}