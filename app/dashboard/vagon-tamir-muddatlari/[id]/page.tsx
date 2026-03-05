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
  Clock,
  Edit,
  Trash2,
  Calendar,
  Gauge,
  Info,
  AlertCircle,
  FileText,
  Train,
  Wrench,
  CheckCircle2,
  Eye,
} from 'lucide-react'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import { Skeleton } from '@/components/ui/skeleton'
import { VagonTamirMuddatiDialog } from '@/components/tamir/vagon-tamir-muddati-dialog'
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
import { useDeleteVagonTamirMuddati, useVagonTamirMuddati } from '@/lib/hooks/useTamir'

export default function VagonTamirMuddatiDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = parseInt(params.id as string)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data: muddat, isLoading } = useVagonTamirMuddati(id)
  const deleteMutation = useDeleteVagonTamirMuddati()

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id)
      router.push('/dashboard/vagon-tamir-muddatlari')
    } catch (error) {
      console.error('O\'chirishda xatolik:', error)
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

  if (!muddat) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Muddat topilmadi
        </h2>
        <Button className="mt-4" onClick={() => router.back()}>
          Orqaga qaytish
        </Button>
      </div>
    )
  }

  const hasRelatedRecords = (muddat.tamirJadvallari?.length || 0) > 0

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
              Ta'mir muddati
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {muddat.vagonTuri?.nomi} - {muddat.tamirTuri?.nomi}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Tahrirlash
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setDeleteDialogOpen(true)}
            disabled={hasRelatedRecords}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            O'chirish
          </Button>
        </div>
      </motion.div>

      {/* Warning if has related records */}
      {hasRelatedRecords && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    Bu muddatga bog'langan ta'mir jadvallari mavjud
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-300">
                    Avval ta'mir jadvallarini o'chirishingiz kerak
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
                  <Clock className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mt-4">Ta'mir muddati</h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Train className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Vagon turi</div>
                      <div className="font-medium">{muddat.vagonTuri?.nomi}</div>
                      <div className="text-xs text-gray-400">{muddat.vagonTuri?.kodli}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Wrench className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Ta'mir turi</div>
                      <div className="font-medium">{muddat.tamirTuri?.nomi}</div>
                      <div className="text-xs text-gray-400">{muddat.tamirTuri?.kodi}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="text-sm text-gray-500">Muddat</div>
                    <div className="font-medium flex items-center gap-1 mt-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {muddat.muddatOy} oy
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="text-sm text-gray-500">Maksimal km</div>
                    <div className="font-medium flex items-center gap-1 mt-1">
                      <Gauge className="h-4 w-4 text-gray-400" />
                      {muddat.maksimalKm.toLocaleString()} km
                    </div>
                  </div>
                </div>

                {muddat.izoh && (
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="text-sm text-gray-500 mb-2">Izoh</div>
                    <p className="text-gray-900 dark:text-white">
                      {muddat.izoh}
                    </p>
                  </div>
                )}

                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Qo'shilgan sana</div>
                      <div className="font-medium">
                        {format(new Date(muddat.yaratilganVaqt), 'dd MMMM yyyy', { locale: uz })}
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
                Ta'mir jadvallari
              </CardTitle>
            </CardHeader>
            <CardContent>
              {muddat.tamirJadvallari && muddat.tamirJadvallari.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vagon</TableHead>
                      <TableHead>Tashkilot</TableHead>
                      <TableHead>Rejalashtirilgan</TableHead>
                      <TableHead>Bajarilgan</TableHead>
                      <TableHead>Holati</TableHead>
                      <TableHead className="text-right">Amallar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {muddat.tamirJadvallari.map((jadval) => (
                      <TableRow key={jadval.id}>
                        <TableCell className="font-medium">
                          {jadval.vagon?.raqami || 'Noma\'lum'}
                        </TableCell>
                        <TableCell>{jadval.tashkilot?.nomi || '—'}</TableCell>
                        <TableCell>
                          {format(new Date(jadval.rejalashtirilganSana), 'dd.MM.yyyy')}
                        </TableCell>
                        <TableCell>
                          {jadval.bajarilganSana 
                            ? format(new Date(jadval.bajarilganSana), 'dd.MM.yyyy')
                            : '—'}
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            jadval.holati === 'bajarilgan' 
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }>
                            {jadval.holati === 'bajarilgan' ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {jadval.holati === 'bajarilgan' ? 'Bajarilgan' : 'Kutilmoqda'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/tamir-jadvallari/${jadval.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Ta'mir jadvallari mavjud emas
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Edit Dialog */}
      <VagonTamirMuddatiDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        muddat={muddat}
        onSuccess={() => {
          setEditDialogOpen(false)
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Muddatni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-bold">"{muddat.vagonTuri?.nomi} - {muddat.tamirTuri?.nomi}"</span> muddatini o'chirishni tasdiqlaysizmi?
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