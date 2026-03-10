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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft,
  Truck,
  Edit,
  Trash2,
  Calendar,
  Gauge,
  Wrench,
  AlertCircle,
  Clock,
  History,
  Activity,
  Info,
  Settings,
  TrendingUp,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { useVagon, useDeleteVagon, useUpdateVagonHolati, useUpdateVagonKm } from '@/lib/hooks/useVagon'
import { useVagonTurlari } from '@/lib/hooks/useVagon'
import { Vagon, VagonHolati } from '@/types/vagon'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { VagonDialog } from '@/components/vagon/vagon-dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

const holatColors = {
  [VagonHolati.ACTIVE]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  [VagonHolati.REPAIR]: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  [VagonHolati.BROKEN]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  [VagonHolati.DECOMMISSIONED]: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
}

const holatIcons = {
  [VagonHolati.ACTIVE]: Activity,
  [VagonHolati.REPAIR]: Wrench,
  [VagonHolati.BROKEN]: AlertCircle,
  [VagonHolati.DECOMMISSIONED]: XCircle,
}

const holatLabels = {
  [VagonHolati.ACTIVE]: 'Faol',
  [VagonHolati.REPAIR]: 'Ta\'mirda',
  [VagonHolati.BROKEN]: 'Buzuq',
  [VagonHolati.DECOMMISSIONED]: 'Foydalanilmaydi',
}

const kmSchema = z.object({
  km: z.number().min(0, 'KM manfiy bo\'lishi mumkin emas'),
})

export default function VagonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = parseInt(params.id as string)
  const [kmDialogOpen, setKmDialogOpen] = useState(false)

  const { data: vagon, isLoading } = useVagon(id)
  const { data: vagonTurlari } = useVagonTurlari({ limit: 100 })
  const deleteMutation = useDeleteVagon()
  const updateHolatiMutation = useUpdateVagonHolati()

  console.log(vagon);
  
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: number; nomi: string } | null>(null)
  
  const updateKmMutation = useUpdateVagonKm()

  const kmForm = useForm<z.infer<typeof kmSchema>>({
    resolver: zodResolver(kmSchema),
    defaultValues: {
      km: vagon?.bosibOtganKm || 0,
    },
  })

  const handleEdit = (item: Vagon) => {
    setSelectedItem(item)
    setDialogOpen(true)
  }

  const handleDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteMutation.mutateAsync(itemToDelete.id)
        setDeleteDialogOpen(false)
        setItemToDelete(null)
      } catch (error) {
        console.error('O\'chirishda xatolik:', error)
      }
    }
  }
  // const handleDelete = async () => {
  //   if (window.confirm(`"${vagon?.raqami}" vagonini o'chirishni tasdiqlaysizmi?`)) {
  //     try {
  //       await deleteMutation.mutateAsync(id)
  //       router.push('/dashboard/vagonlar')
  //     } catch (error) {
  //       console.error('O\'chirishda xatolik:', error)
  //     }
  //   }
  // }

  const handleHolatChange = async (holati: VagonHolati) => {
    try {
      await updateHolatiMutation.mutateAsync({ id, holati })
    } catch (error) {
      console.error('Holatni o\'zgartirishda xatolik:', error)
    }
  }

  const onKmSubmit = async (values: z.infer<typeof kmSchema>) => {
    try {
      await updateKmMutation.mutateAsync({ id, km: values.km })
      setKmDialogOpen(false)
    } catch (error) {
      console.error('KM yangilashda xatolik:', error)
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

  if (!vagon) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Vagon topilmadi
        </h2>
        <Button className="mt-4" onClick={() => router.back()}>
          Orqaga qaytish
        </Button>
      </div>
    )
  }

  const HolatIcon = holatIcons[vagon.holati]
  const vagonTuri = vagonTurlari?.items.find(t => t.id === vagon.vagonTuriId)

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
              Vagon {vagon.raqami}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Vagon haqida batafsil ma'lumot
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild onClick={()=>handleEdit(vagon)}>
            <span>
              <Edit className="h-4 w-4 mr-2" />
              Tahrirlash
            </span>
          </Button>
          <Button variant="destructive" onClick={()=>{
            setItemToDelete({ id: vagon.id, nomi: vagon.raqami })
            setDeleteDialogOpen(true)
          }}>
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
                  <Truck className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mt-4">{vagon.raqami}</h2>
                <Badge className={holatColors[vagon.holati]} variant="outline">
                  <HolatIcon className="h-3 w-3 mr-1" />
                  {holatLabels[vagon.holati]}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="text-sm text-gray-500">Vagon turi</div>
                    <div className="font-medium mt-1">{vagonTuri?.nomi || 'Noma\'lum'}</div>
                    <div className="text-xs text-gray-400">{vagonTuri?.kodli}</div>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="text-sm text-gray-500">Ishlab chiqarilgan</div>
                    <div className="font-medium mt-1 flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {format(new Date(vagon.ishlabChigarilganSana), 'dd.MM.yyyy')}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-500">Bosib o'tgan masofa</div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setKmDialogOpen(true)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-gray-400" />
                    <span className="text-2xl font-bold">{vagon.bosibOtganKm.toLocaleString()}</span>
                    <span className="text-gray-500">km</span>
                  </div>
                  <Progress value={(vagon.bosibOtganKm / 100000) * 100} className="mt-2" />
                </div>

                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="text-sm text-gray-500 mb-2">Qo'shilgan sana</div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {format(new Date(vagon.yaratilganVaqt), 'dd MMMM yyyy', { locale: uz })}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleHolatChange(VagonHolati.ACTIVE)}
                  disabled={vagon.holati === VagonHolati.ACTIVE}
                >
                  <Activity className="h-4 w-4 mr-2 text-emerald-600" />
                  Faol holatiga o'tkazish
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleHolatChange(VagonHolati.REPAIR)}
                  disabled={vagon.holati === VagonHolati.REPAIR}
                >
                  <Wrench className="h-4 w-4 mr-2 text-amber-600" />
                  Ta'mirga yuborish
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleHolatChange(VagonHolati.BROKEN)}
                  disabled={vagon.holati === VagonHolati.BROKEN}
                >
                  <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
                  Buzuq deb belgilash
                </Button>
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
          <Tabs defaultValue="history" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history" className="gap-2">
                <History className="h-4 w-4" />
                Ta'mir tarixi
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="gap-2">
                <Wrench className="h-4 w-4" />
                Rejalashtirilgan ta'mirlar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="history">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    Ta'mir tarixi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {vagon.tamirJadvallari && vagon.tamirJadvallari.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ta'mir turi</TableHead>
                          <TableHead>Rejalashtirilgan sana</TableHead>
                          <TableHead>Bajarilgan sana</TableHead>
                          <TableHead>Holati</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vagon.tamirJadvallari.map((jadval) => (
                          <TableRow key={jadval.id}>
                            <TableCell>{jadval.tamirTuri?.nomi || 'Noma\'lum'}</TableCell>
                            <TableCell>
                              {format(new Date(jadval.rejalashtirilganSana), 'dd.MM.yyyy')}
                            </TableCell>
                            <TableCell>
                              {jadval.amalgaOshirilganSana 
                                ? format(new Date(jadval.amalgaOshirilganSana), 'dd.MM.yyyy')
                                : '—'}
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                jadval.holati === 'tugallangan' 
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }>
                                {jadval.holati === 'tugallangan' ? (
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                ) : (
                                  <Clock className="h-3 w-3 mr-1" />
                                )}
                                {jadval.holati === 'tugallangan' ? 'Bajarilgan' : jadval.holati === 'rejalashtirilgan'?'Kutilmoqda': 'Jarayonda'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <History className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Ta'mir tarixi mavjud emas
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-primary" />
                    Rejalashtirilgan ta'mirlar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {vagon.tamirJadvallari && vagon.tamirJadvallari?.filter(j => j.holati !== 'tugallangan').length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ta'mir turi</TableHead>
                          <TableHead>Rejalashtirilgan sana</TableHead>
                          <TableHead>Qolgan vaqt</TableHead>
                          <TableHead>Amallar</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vagon.tamirJadvallari
                          .filter(j => j.holati !== 'tugallangan')
                          .map((jadval) => {
                            const today = new Date()
                            const planDate = new Date(jadval.rejalashtirilganSana)
                            const daysLeft = Math.ceil((planDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                            
                            return (
                              <TableRow key={jadval.id}>
                                <TableCell>{jadval.tamirTuri?.nomi || 'Noma\'lum'}</TableCell>
                                <TableCell>
                                  {format(planDate, 'dd.MM.yyyy')}
                                </TableCell>
                                <TableCell>
                                  <Badge className={daysLeft < 7 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                                    {daysLeft > 0 ? `${daysLeft} kun` : 'Muddati o\'tgan'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">
                                    Bajarildi
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Rejalashtirilgan ta'mirlar mavjud emas
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Vagon Dialog */}
            <VagonDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              vagon={selectedItem}
              onSuccess={() => {
                setDialogOpen(false)
                setSelectedItem(null)
              }}
            />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vagonni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete && (
                <span>
                  <span className="font-bold">"{itemToDelete.nomi}"</span> vagonini o'chirishni tasdiqlaysizmi?
                  <br />
                  Bu amalni ortga qaytarib bo'lmaydi.
                </span>
              )}
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
      {/* KM Update Dialog */}
      <Dialog open={kmDialogOpen} onOpenChange={setKmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>KM yangilash</DialogTitle>
            <DialogDescription>
              Vagonning bosib o'tgan masofasini yangilang
            </DialogDescription>
          </DialogHeader>
          <Form {...kmForm}>
            <form onSubmit={kmForm.handleSubmit(onKmSubmit)} className="space-y-4">
              <FormField
                control={kmForm.control}
                name="km"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bosib o'tgan masofa (km)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setKmDialogOpen(false)}>
                  Bekor qilish
                </Button>
                <Button type="submit">
                  Saqlash
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}