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
  Wrench,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Gauge,
  Info,
  AlertCircle,
  FileText,
  Train,
  CheckCircle2,
  History,
  Eye,
} from 'lucide-react'
import { useTamirTuri, useDeleteTamirTuri } from '@/lib/hooks/useTamir'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import { Skeleton } from '@/components/ui/skeleton'
import { TamirTuriDialog } from '@/components/tamir/tamir-turi-dialog'
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

export default function TamirTuriDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = parseInt(params.id as string)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data: tamirTuri, isLoading } = useTamirTuri(id)
  const deleteMutation = useDeleteTamirTuri()

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id)
      router.push('/dashboard/tamir-turlari')
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

  if (!tamirTuri) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Ta'mir turi topilmadi
        </h2>
        <Button className="mt-4" onClick={() => router.back()}>
          Orqaga qaytish
        </Button>
      </div>
    )
  }

  const hasRelatedRecords = (tamirTuri.tamirMuddatlari?.length || 0) > 0 || 
                           (tamirTuri.tamirJadvallari?.length || 0) > 0

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
              {tamirTuri.nomi}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Ta'mir turi haqida batafsil ma'lumot
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
                    Bu ta'mir turiga bog'langan ma'lumotlar mavjud
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-300">
                    Avval bog'liq ma'lumotlarni o'chirishingiz kerak
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
                <h2 className="text-2xl font-bold mt-4">{tamirTuri.nomi}</h2>
                <Badge variant="outline" className="mt-2 font-mono text-lg px-3 py-1">
                  {tamirTuri.kodi}
                </Badge>
              </div>

              {tamirTuri.tavsifi && (
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Tavsifi</h3>
                  <p className="text-gray-900 dark:text-white">
                    {tamirTuri.tavsifi}
                  </p>
                </div>
              )}

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Qo'shilgan sana</div>
                    <div className="font-medium">
                      {format(new Date(tamirTuri.yaratilganVaqt), 'dd MMMM yyyy', { locale: uz })}
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
                <FileText className="h-5 w-5 text-primary" />
                Statistika
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {tamirTuri.tamirMuddatlari?.length || 0}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Muddatlar
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-center">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {tamirTuri.tamirJadvallari?.length || 0}
                  </div>
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    Jadvallar
                  </div>
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
          <Tabs defaultValue="muddatlar" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="muddatlar" className="gap-2">
                <Clock className="h-4 w-4" />
                Ta'mir muddatlari
              </TabsTrigger>
              <TabsTrigger value="jadvallar" className="gap-2">
                <FileText className="h-4 w-4" />
                Ta'mir jadvallari
              </TabsTrigger>
            </TabsList>

            <TabsContent value="muddatlar">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Vagon turlari bo'yicha muddatlar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tamirTuri.tamirMuddatlari && tamirTuri.tamirMuddatlari.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vagon turi</TableHead>
                          <TableHead>Muddat (oy)</TableHead>
                          <TableHead>Maksimal km</TableHead>
                          <TableHead>Izoh</TableHead>
                          <TableHead className="text-right">Amallar</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tamirTuri.tamirMuddatlari.map((muddat) => (
                          <TableRow key={muddat.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Train className="h-4 w-4 text-gray-400" />
                                {muddat.vagonTuri?.nomi || 'Noma\'lum'}
                              </div>
                              <div className="text-xs text-gray-500">{muddat.vagonTuri?.kodli}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono">
                                {muddat.muddatOy} oy
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Gauge className="h-4 w-4 text-gray-400" />
                                {muddat.maksimalKm.toLocaleString()} km
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {muddat.izoh || '—'}
                              </p>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/dashboard/vagon-tamir-muddatlari/${muddat.id}`}>
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
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Ta'mir muddatlari mavjud emas
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jadvallar">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Ta'mir jadvallari
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tamirTuri.tamirJadvallari && tamirTuri.tamirJadvallari.length > 0 ? (
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
                        {tamirTuri.tamirJadvallari.map((jadval) => (
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
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Edit Dialog */}
      <TamirTuriDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        tamirTuri={tamirTuri}
        onSuccess={() => {
          setEditDialogOpen(false)
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ta'mir turini o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-bold">"{tamirTuri.nomi}"</span> ta'mir turini o'chirishni tasdiqlaysizmi?
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