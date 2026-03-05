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
  Building2,
  Edit,
  Trash2,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Wrench,
  Clock,
  Info,
  Mail,
  CheckCircle2,
  AlertCircle,
  History,
  Eye,
} from 'lucide-react'
import { useTashkilot, useDeleteTashkilot } from '@/lib/hooks/useTashkilot'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import { Skeleton } from '@/components/ui/skeleton'
import { TashkilotDialog } from '@/components/tashkilotlar/tashkilot-dialog'
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

export default function TashkilotDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = parseInt(params.id as string)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data: tashkilot, isLoading } = useTashkilot(id)
  const deleteMutation = useDeleteTashkilot()

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id)
      router.push('/dashboard/tashkilotlar')
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

  if (!tashkilot) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tashkilot topilmadi
        </h2>
        <Button className="mt-4" onClick={() => router.back()}>
          Orqaga qaytish
        </Button>
      </div>
    )
  }

  const completedRepairs = tashkilot.tamirJadvallari?.filter(j => j.holati === 'bajarilgan') || []
  const pendingRepairs = tashkilot.tamirJadvallari?.filter(j => j.holati !== 'bajarilgan') || []

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
              {tashkilot.nomi}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Tashkilot haqida batafsil ma'lumot
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
            disabled={tashkilot.tamirJadvallari && tashkilot.tamirJadvallari.length > 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            O'chirish
          </Button>
        </div>
      </motion.div>

      {/* Warning if has related records */}
      {tashkilot.tamirJadvallari && tashkilot.tamirJadvallari.length > 0 && (
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
                    Bu tashkilotga bog'langan ta'mir jadvallari mavjud
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
                  <Building2 className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mt-4">{tashkilot.nomi}</h2>
                <Badge variant="outline" className="mt-2 font-mono text-lg px-3 py-1">
                  {tashkilot.kod}
                </Badge>
              </div>

              {tashkilot.description && (
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Tavsifi</h3>
                  <p className="text-gray-900 dark:text-white">
                    {tashkilot.description}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {tashkilot.telefon && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Telefon</div>
                      <div className="font-medium">{tashkilot.telefon}</div>
                    </div>
                  </div>
                )}

                {tashkilot.manzil && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Manzil</div>
                      <div className="font-medium">{tashkilot.manzil}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Qo'shilgan sana</div>
                    <div className="font-medium">
                      {format(new Date(tashkilot.yaratilganVaqt), 'dd MMMM yyyy', { locale: uz })}
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
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {completedRepairs.length}
                  </div>
                  <div className="text-sm text-emerald-700 dark:text-emerald-300">
                    Bajarilgan ta'mirlar
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-center">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {pendingRepairs.length}
                  </div>
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    Kutilayotgan ta'mirlar
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="text-sm text-blue-700 dark:text-blue-300 mb-1">
                  Jami ta'mir jadvallari
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {tashkilot.tamirJadvallari?.length || 0}
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
          <Tabs defaultValue="repairs" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="repairs" className="gap-2">
                <Wrench className="h-4 w-4" />
                Ta'mir jadvallari
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="h-4 w-4" />
                Tarix
              </TabsTrigger>
            </TabsList>

            <TabsContent value="repairs">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-primary" />
                    Ta'mir jadvallari
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tashkilot.tamirJadvallari && tashkilot.tamirJadvallari.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vagon</TableHead>
                          <TableHead>Ta'mir turi</TableHead>
                          <TableHead>Rejalashtirilgan</TableHead>
                          <TableHead>Bajarilgan</TableHead>
                          <TableHead>Holati</TableHead>
                          <TableHead className="text-right">Amallar</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tashkilot.tamirJadvallari.map((jadval) => (
                          <TableRow key={jadval.id}>
                            <TableCell className="font-medium">
                              {jadval.vagon?.raqami || 'Noma\'lum'}
                            </TableCell>
                            <TableCell>{jadval.tamirTuri?.nomi || 'Noma\'lum'}</TableCell>
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
                      <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Ta'mir jadvallari mavjud emas
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    Tarix
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Tashkilot qo'shilgan</div>
                          <div className="font-medium">
                            {format(new Date(tashkilot.yaratilganVaqt), 'dd MMMM yyyy HH:mm', { locale: uz })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {tashkilot.tamirJadvallari && tashkilot.tamirJadvallari
                      .filter(j => j.bajarilganSana)
                      .sort((a, b) => new Date(b.bajarilganSana!).getTime() - new Date(a.bajarilganSana!).getTime())
                      .slice(0, 5)
                      .map((jadval) => (
                        <div key={jadval.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            <div>
                              <div className="font-medium">
                                {jadval.vagon?.raqami} - {jadval.tamirTuri?.nomi}
                              </div>
                              <div className="text-sm text-gray-500">
                                Bajarilgan: {format(new Date(jadval.bajarilganSana!), 'dd MMMM yyyy', { locale: uz })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                    {(!tashkilot.tamirJadvallari || tashkilot.tamirJadvallari.filter(j => j.bajarilganSana).length === 0) && (
                      <div className="text-center py-4">
                        <p className="text-gray-500 dark:text-gray-400">
                          Tarix ma'lumotlari mavjud emas
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Edit Dialog */}
      <TashkilotDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        tashkilot={tashkilot}
        onSuccess={() => {
          setEditDialogOpen(false)
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tashkilotni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-bold">"{tashkilot.nomi}"</span> tashkilotini o'chirishni tasdiqlaysizmi?
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