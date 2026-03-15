"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Calendar,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  AlertCircle,
  Wrench,
  Truck,
  Building2,
  CheckCircle2,
  XCircle,
  PlayCircle,
  DollarSign,
  AlertTriangle,
} from 'lucide-react'
import { useTamirJadvallari, useDeleteTamirJadval, useTamirJadvalStatistics } from '@/lib/hooks/useTamirJadval'
import { useUpdateTamirJadvalStatus } from '@/lib/hooks/useTamirJadval'
import { TamirHolati, TamirJadval } from '@/types/tamir-jadval'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import { TamirJadvalDialog } from '@/components/tamir-jadval/tamir-jadval-dialog'
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
import { VagonHolati } from '@/types/vagon'
import { useUpdateVagonHolati } from '@/lib/hooks/useVagon'

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

export default function TamirJadvallariPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [holatFilter, setHolatFilter] = useState<TamirHolati | 'all'>('all')
  const [page, setPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [selectedForComplete, setSelectedForComplete] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: number; nomi: string } | null>(null)
  const limit = 10

  const { data: statistics } = useTamirJadvalStatistics()
  const { data, isLoading, refetch } = useTamirJadvallari({
    holati: holatFilter !== 'all' ? holatFilter : undefined,
    page,
    limit,
  })

  const deleteMutation = useDeleteTamirJadval()
  const updateStatusMutation = useUpdateTamirJadvalStatus()
      const updateHolatiMutation = useUpdateVagonHolati()

  const handleEdit = (item: TamirJadval) => {
    setSelectedItem(item)
    setDialogOpen(true)
  }

  const handleComplete = (item: TamirJadval) => {
    setSelectedForComplete(item)
    setCompleteDialogOpen(true)
  }

  const handleStatusChange = async (tamir: TamirJadval, holati: TamirHolati) => {
    try {
      handleHolatChange(tamir.vagonId, holati==='jarayonda'?VagonHolati.REPAIR:VagonHolati.ACTIVE)
      await updateStatusMutation.mutateAsync({ id: tamir.id, holati })
    } catch (error) {
      console.error('Holatni o\'zgartirishda xatolik:', error)
    }
  }

  const handleHolatChange = async (id: number, holati: VagonHolati) => {
      try {
        await updateHolatiMutation.mutateAsync({ id, holati })
      } catch (error) {
        console.error('Holatni o\'zgartirishda xatolik:', error)
      }
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ta'mir jadvallari
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Barcha ta'mir jadvallarini boshqaring
          </p>
        </div>
        <Button onClick={() => {
          setSelectedItem(null)
          setDialogOpen(true)
        }} className="gap-2">
          <Plus className="h-4 w-4" />
          Yangi tamir jadvali
        </Button>
      </motion.div>

      {/* Statistics Cards */}
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
                  {statistics?.total || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Jami ta'mirlar</div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Wrench className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {statistics?.jarayonda || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Jarayondagi</div>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <PlayCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {statistics?.bugungi || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Bugungi</div>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {statistics?.muddatiOtgan || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Muddati o'tgan</div>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Warning if overdue */}
      {statistics?.muddatiOtgan && statistics.muddatiOtgan > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-200">
                    {statistics.muddatiOtgan} ta muddati o'tgan tamir jadvali mavjud
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    Iltimos, ularni ko'rib chiqing
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Izoh bo'yicha qidirish..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex relative">
                <Select
                  value={holatFilter}
                  onValueChange={(value) => setHolatFilter(value as TamirHolati | 'all')}
                >
                  <SelectTrigger className="w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Holati" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha holatlar</SelectItem>
                    {Object.values(TamirHolati).map((holat) => (
                      <SelectItem key={holat} value={holat}>
                        {holatLabels[holat]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='flex relative'>
                <Button variant="outline" onClick={() => refetch()} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Yangilash
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className=""
      >
        <Card className="border-2 relative flex w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Ta'mir jadvallari ro'yxati
            </CardTitle>
            <CardDescription>
              Jami {data?.total || 0} ta tamir jadvali
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className='relative flex w-full '>
              <div className='relative w-full overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vagon</TableHead>
                    <TableHead>Ta'mir turi</TableHead>
                    <TableHead>Tashkilot</TableHead>
                    <TableHead>Rejalashtirilgan</TableHead>
                    <TableHead>Amalga oshirilgan</TableHead>
                    <TableHead>Holati</TableHead>
                    <TableHead>Qiymat</TableHead>
                    <TableHead className="text-right">Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.items?.map((item) => {
                    const HolatIcon = holatIcons[item.holati]
                    const today = new Date()
                    const planDate = new Date(item.rejalashtirilganSana)
                    const isOverdue = item.holati === TamirHolati.REJALASHTIRILGAN && planDate < today

                    return (
                      <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="font-medium">{item.vagon?.raqami}</div>
                              <div className="text-xs text-gray-500">
                                {item.vagon?.vagonTuri?.nomi}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{item.tamirTuri?.nomi}</div>
                            <div className="text-xs text-gray-500">{item.tamirTuri?.kodi}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <div>
                              <div>{item.tashkilot?.nomi}</div>
                              <div className="text-xs text-gray-500">{item.tashkilot?.kod}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <div>{format(planDate, 'dd.MM.yyyy')}</div>
                              {isOverdue && (
                                <Badge variant="outline" className="text-red-600 border-red-200 mt-1">
                                  Muddati o'tgan
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.amalgaOshirilganSana ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              {format(new Date(item.amalgaOshirilganSana), 'dd.MM.yyyy')}
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={holatColors[item.holati]}>
                            <HolatIcon className="h-3 w-3 mr-1" />
                            {holatLabels[item.holati]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.tamirQiymati ? (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-gray-400" />
                              {item.tamirQiymati.toLocaleString()}
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Amallar</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/tamir-jadvallari/${item.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ko'rish
                                </Link>
                              </DropdownMenuItem>
                              
                              {item.holati === TamirHolati.REJALASHTIRILGAN && (
                                <>
                                  <DropdownMenuItem onClick={() => handleEdit(item)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Tahrirlash
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(item, TamirHolati.JARAYONDA)}>
                                    <PlayCircle className="h-4 w-4 mr-2 text-amber-600" />
                                    Jarayonga o'tkazish
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleComplete(item)}>
                                    <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" />
                                    Tugallash
                                  </DropdownMenuItem>
                                </>
                              )}

                              {item.holati === TamirHolati.JARAYONDA && (
                                <DropdownMenuItem onClick={() => handleComplete(item)}>
                                  <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" />
                                  Tugallash
                                </DropdownMenuItem>
                              )}

                              {item.holati !== TamirHolati.TUGALLANGAN && (
                                <DropdownMenuItem 
                                  onClick={() => handleStatusChange(item, TamirHolati.BEKOR_QILINGAN)}
                                  className="text-red-600"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Bekor qilish
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator />
                              
                              {item.holati !== TamirHolati.TUGALLANGAN && (
                                <DropdownMenuItem
                                  className="text-red-600 dark:text-red-400"
                                  onClick={() => {
                                    setItemToDelete({ 
                                      id: item.id, 
                                      nomi: `${item.vagon?.raqami} - ${item.tamirTuri?.nomi}` 
                                    })
                                    setDeleteDialogOpen(true)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  O'chirish
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}

                  {data?.items?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="h-8 w-8 text-gray-400" />
                          <p className="text-gray-500 dark:text-gray-400">
                            Hech qanday tamir jadvali topilmadi
                          </p>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setSelectedItem(null)
                              setDialogOpen(true)
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Yangi qo'shish
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              </div>
              </div>
            )}

            {/* Pagination */}
            {data && data.total > limit && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  {((page - 1) * limit) + 1} - {Math.min(page * limit, data.total)} / {data.total}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Oldingi
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page * limit >= data.total}
                  >
                    Keyingi
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Tamir Jadval Dialog */}
      <TamirJadvalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        tamirJadval={selectedItem}
        onSuccess={() => {
          setDialogOpen(false)
          setSelectedItem(null)
        }}
      />

      {/* Complete Tamir Dialog */}
      <CompleteTamirDialog
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        tamirJadval={selectedForComplete}
        onSuccess={() => {
          setCompleteDialogOpen(false)
          setSelectedForComplete(null)
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tamir jadvalini o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete && (
                <span>
                  <span className="font-bold">"{itemToDelete.nomi}"</span> tamir jadvalini o'chirishni tasdiqlaysizmi?
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
    </div>
  )
}