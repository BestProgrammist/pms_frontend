"use client"

import { useState } from 'react'
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
  Wrench,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Info,
  AlertCircle,
  Truck,
  Building2,
  User,
  DollarSign,
  CheckCircle2,
  XCircle,
  PlayCircle,
  FileText,
} from 'lucide-react'
import { useTamirJadval, useDeleteTamirJadval, useUpdateTamirJadvalStatus, useCompleteTamir } from '@/lib/hooks/useTamirJadval'
import { TamirHolati } from '@/types/tamir-jadval'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import { Skeleton } from '@/components/ui/skeleton'
// import { TamirJadvalDialog } from '@/components/tamir-jadval/tamir-jadval-dialog'
import { CompleteTamirDialog } from '@/components/tamir-jadval/complete-tamir-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { TamirJadvalDialog } from '@/components/tamir-jadval/tamir-jadval-dialog'

const holatColors = {
  [TamirHolati.REJALASHTIRILGAN]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  [TamirHolati.JARAYONDA]: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  [TamirHolati.TUGALLANGAN]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  [TamirHolati.BEKOR_QILINGAN]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const holatIcons = {
  [TamirHolati.REJALASHTIRILGAN]: Calendar,
  [TamirHolati.JARAYONDA]: PlayCircle,
  [TamirHolati.TUGALLANGAN]: CheckCircle2,
  [TamirHolati.BEKOR_QILINGAN]: XCircle,
}

const holatLabels = {
  [TamirHolati.REJALASHTIRILGAN]: 'Rejalashtirilgan',
  [TamirHolati.JARAYONDA]: 'Jarayonda',
  [TamirHolati.TUGALLANGAN]: 'Tugallangan',
  [TamirHolati.BEKOR_QILINGAN]: 'Bekor qilingan',
}

export default function TamirJadvalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = parseInt(params.id as string)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data: tamirJadval, isLoading } = useTamirJadval(id)
  const deleteMutation = useDeleteTamirJadval()
  const updateStatusMutation = useUpdateTamirJadvalStatus()

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id)
      router.push('/dashboard/tamir-jadvallari')
    } catch (error) {
      console.error('O\'chirishda xatolik:', error)
    }
  }

  const handleStatusChange = async (holati: TamirHolati) => {
    try {
      await updateStatusMutation.mutateAsync({ id, holati })
    } catch (error) {
      console.error('Holatni o\'zgartirishda xatolik:', error)
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

  if (!tamirJadval) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tamir jadvali topilmadi
        </h2>
        <Button className="mt-4" onClick={() => router.back()}>
          Orqaga qaytish
        </Button>
      </div>
    )
  }

  const HolatIcon = holatIcons[tamirJadval.holati]
  const today = new Date()
  const planDate = new Date(tamirJadval.rejalashtirilganSana)
  const isOverdue = tamirJadval.holati === TamirHolati.REJALASHTIRILGAN && planDate < today

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
              Tamir jadvali
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {tamirJadval.vagon?.raqami} - {tamirJadval.tamirTuri?.nomi}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {tamirJadval.holati !== TamirHolati.TUGALLANGAN && (
            <>
              <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Tahrirlash
              </Button>
              
              {tamirJadval.holati === TamirHolati.REJALASHTIRILGAN && (
                <Button 
                  variant="outline" 
                  onClick={() => handleStatusChange(TamirHolati.JARAYONDA)}
                  className="border-amber-500 text-amber-600 hover:bg-amber-50"
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Jarayonga o'tkazish
                </Button>
              )}
              
              {(tamirJadval.holati === TamirHolati.REJALASHTIRILGAN || 
                tamirJadval.holati === TamirHolati.JARAYONDA) && (
                <Button 
                  onClick={() => setCompleteDialogOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Tugallash
                </Button>
              )}
            </>
          )}
          
          <Button 
            variant="destructive" 
            onClick={() => setDeleteDialogOpen(true)}
            disabled={tamirJadval.holati === TamirHolati.TUGALLANGAN}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            O'chirish
          </Button>
        </div>
      </motion.div>

      {/* Warning if overdue */}
      {isOverdue && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-200">
                    Muddati o'tgan tamir jadvali
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    Rejalashtirilgan sana: {format(planDate, 'dd MMMM yyyy', { locale: uz })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

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
                  <Wrench className="h-12 w-12 text-primary" />
                </div>
                <Badge className={`mt-4 ${holatColors[tamirJadval.holati]}`}>
                  <HolatIcon className="h-3 w-3 mr-1" />
                  {holatLabels[tamirJadval.holati]}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Vagon</div>
                        <div className="font-medium">{tamirJadval.vagon?.raqami}</div>
                        <div className="text-xs text-gray-400">{tamirJadval.vagon?.vagonTuri?.nomi}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Wrench className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Ta'mir turi</div>
                        <div className="font-medium">{tamirJadval.tamirTuri?.nomi}</div>
                        <div className="text-xs text-gray-400">{tamirJadval.tamirTuri?.kodi}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Tashkilot</div>
                        <div className="font-medium">{tamirJadval.tashkilot?.nomi}</div>
                        <div className="text-xs text-gray-400">{tamirJadval.tashkilot?.kod}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Mas'ul shaxs</div>
                        <div className="font-medium">
                          {tamirJadval.user?.firstName} {tamirJadval.user?.lastName}
                        </div>
                        <div className="text-xs text-gray-400">@{tamirJadval.user?.username}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="text-sm text-gray-500">Rejalashtirilgan</div>
                    <div className="font-medium flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {format(planDate, 'dd.MM.yyyy')}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="text-sm text-gray-500">Amalga oshirilgan</div>
                    <div className="font-medium flex items-center gap-1 mt-1">
                      <CheckCircle2 className="h-4 w-4 text-gray-400" />
                      {tamirJadval.amalgaOshirilganSana 
                        ? format(new Date(tamirJadval.amalgaOshirilganSana), 'dd.MM.yyyy')
                        : '—'
                      }
                    </div>
                  </div>
                </div>

                {tamirJadval.tamirQiymati && (
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="text-sm text-gray-500">Tamir qiymati</div>
                    <div className="font-medium flex items-center gap-1 mt-1 text-lg">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                      {tamirJadval.tamirQiymati.toLocaleString()} so'm
                    </div>
                  </div>
                )}

                {tamirJadval.izoh && (
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="text-sm text-gray-500 mb-2">Izoh</div>
                    <p className="text-gray-900 dark:text-white">
                      {tamirJadval.izoh}
                    </p>
                  </div>
                )}

                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Yaratilgan vaqt</div>
                      <div className="font-medium">
                        {format(new Date(tamirJadval.yaratilganVaqt), 'dd MMMM yyyy HH:mm', { locale: uz })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column - Related Data */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Muddat ma'lumotlari
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tamirJadval.vagonTamirMuddati ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parametr</TableHead>
                      <TableHead>Belgilangan</TableHead>
                      <TableHead>Hozirgi</TableHead>
                      <TableHead>Holati</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Muddat (oy)</TableCell>
                      <TableCell>{tamirJadval.vagonTamirMuddati.muddatOy} oy</TableCell>
                      <TableCell>
                        {Math.floor((today.getTime() - new Date(tamirJadval.vagon?.ishlabChigarilganSana?tamirJadval.vagon?.ishlabChigarilganSana:0).getTime()) / (1000 * 60 * 60 * 24 * 30))} oy
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          (today.getTime() - new Date(tamirJadval.vagon?.ishlabChigarilganSana?tamirJadval.vagon?.ishlabChigarilganSana:0).getTime()) / (1000 * 60 * 60 * 24 * 30) 
                          >= tamirJadval.vagonTamirMuddati.muddatOy
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }>
                          {(today.getTime() - new Date(tamirJadval.vagon?.ishlabChigarilganSana?tamirJadval.vagon?.ishlabChigarilganSana:0).getTime()) / (1000 * 60 * 60 * 24 * 30) 
                          >= tamirJadval.vagonTamirMuddati.muddatOy
                            ? 'Muddati o\'tgan'
                            : 'Muddat ichida'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Maksimal km</TableCell>
                      <TableCell>{tamirJadval.vagonTamirMuddati.maksimalKm.toLocaleString()} km</TableCell>
                      <TableCell>{tamirJadval.vagon?.bosibOtganKm.toLocaleString()} km</TableCell>
                      <TableCell>
                        <Badge className={
                          tamirJadval.vagon?.bosibOtganKm && tamirJadval.vagon?.bosibOtganKm>= tamirJadval.vagonTamirMuddati.maksimalKm
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }>
                          {tamirJadval.vagon?.bosibOtganKm && tamirJadval.vagon?.bosibOtganKm>= tamirJadval.vagonTamirMuddati.maksimalKm
                            ? 'Limit oshgan'
                            : 'Limit ichida'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Muddat ma'lumotlari mavjud emas
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Edit Dialog */}
      <TamirJadvalDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        tamirJadval={tamirJadval}
        onSuccess={() => {
          setEditDialogOpen(false)
        }}
      />

      {/* Complete Tamir Dialog */}
      <CompleteTamirDialog
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        tamirJadval={tamirJadval}
        onSuccess={() => {
          setCompleteDialogOpen(false)
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tamir jadvalini o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-bold">"{tamirJadval.vagon?.raqami} - {tamirJadval.tamirTuri?.nomi}"</span> tamir jadvalini o'chirishni tasdiqlaysizmi?
              <br />
              Bu amalni ortga qaytarib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}