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
  Clock,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  RefreshCw,
  AlertCircle,
  Train,
  Wrench,
  Gauge,
  Grid,
  List,
} from 'lucide-react'
import { useVagonTamirMuddatlari, useDeleteVagonTamirMuddati } from '@/lib/hooks/useTamir'
import { useVagonTurlari } from '@/lib/hooks/useVagon'
import { useTamirTuriDropdown } from '@/lib/hooks/useTamir'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
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
import { MatrixRow, MatrixViewProps } from '@/types/tamir'

// Matrix ko'rinishi uchun komponent
function MatrixView({ data, vagonTurlari, tamirTurlari, onEdit, onDelete }: MatrixViewProps) {
  console.log(data);
  
  // Ma'lumotlarni matrix formatiga o'tkazish
  const matrixData = vagonTurlari?.items?.map(vagonTur => {
    const row: MatrixRow = {
      vagonTur,
      muddatlar: {}
    };
    
    tamirTurlari?.forEach(tamirTur => {
      const muddat = data?.items?.find(
        item => item.vagonTuriId === vagonTur.id && item.tamirTuriId === tamirTur.id
      );
      row.muddatlar[tamirTur.id] = muddat;
    });
    console.log(row);
    
    return row;
  }) || [];

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px] bg-gray-50 dark:bg-gray-800/50 sticky left-0">
              <div className="font-bold">Vagon turlari</div>
            </TableHead>
            {tamirTurlari?.map((tur) => (
              <TableHead key={tur.id} className="min-w-[180px] text-center">
                <div className="flex flex-col items-center gap-1">
                  <Wrench className="h-4 w-4 text-primary" />
                  <span>{tur.nomi}</span>
                  <span className="text-xs text-gray-500">{tur.kodi}</span>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {matrixData.map((row) => (
            <TableRow key={row.vagonTur.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <TableCell className="font-medium bg-gray-50 dark:bg-gray-800/50 sticky left-0">
                <div className="flex items-center gap-2">
                  <Train className="h-4 w-4 text-primary" />
                  <div>
                    <div>{row.vagonTur.nomi}</div>
                    <div className="text-xs text-gray-500">{row.vagonTur.kodli}</div>
                  </div>
                </div>
              </TableCell>
              {tamirTurlari?.map((tur) => {
                const muddat = row.muddatlar[tur.id];
                return (
                  <TableCell key={tur.id} className="text-center p-4">
                    {muddat ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          {(muddat.tamirType === "vaqt" || muddat.tamirType === "ikkalasi") && (
                            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20">
                              {muddat.muddatOy} oy
                            </Badge>
                          )}
                          {(muddat.tamirType === "masofa" || muddat.tamirType === "ikkalasi") && (
                            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                              <Gauge className="h-3 w-3 mr-1" />
                              {muddat.maksimalKm.toLocaleString()} km
                            </Badge>
                          )}
                        </div>
                        {muddat.izoh && (
                          <p className="text-xs text-gray-500 line-clamp-2 max-w-[200px] mx-auto">
                            {muddat.izoh}
                          </p>
                        )}
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(muddat)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(muddat)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit({
                            vagonTuriId: row.vagonTur.id,
                            tamirTuriId: tur.id,
                            vagonTuri: row.vagonTur,
                            tamirTuri: tur
                          })}
                          className="text-gray-400 hover:text-primary"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Qo'shish
                        </Button>
                      </div>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function VagonTamirMuddatlariPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [vagonTuriFilter, setVagonTuriFilter] = useState<string>('all')
  const [tamirTuriFilter, setTamirTuriFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: number; nomi: string } | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'matrix'>('list')
  const limit = 10

  const { data: vagonTurlari } = useVagonTurlari({ limit: 100 })
  const { data: tamirTurlari } = useTamirTuriDropdown()

  const { data, isLoading, refetch } = useVagonTamirMuddatlari({
    vagonTuriId: vagonTuriFilter !== 'all' ? parseInt(vagonTuriFilter) : undefined,
    tamirTuriId: tamirTuriFilter !== 'all' ? parseInt(tamirTuriFilter) : undefined,
    page,
    limit,
  })

  const deleteMutation = useDeleteVagonTamirMuddati()

  const handleEdit = (item: any) => {
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

  const handleMatrixDelete = (muddat: any) => {
    setItemToDelete({ 
      id: muddat.id, 
      nomi: `${muddat.vagonTuri?.nomi} - ${muddat.tamirTuri?.nomi}` 
    })
    setDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Vagon ta'mir muddatlari
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Vagon turlari bo'yicha ta'mir muddatlarini boshqaring
          </p>
        </div>
        <Button onClick={() => {
          setSelectedItem(null)
          setDialogOpen(true)
        }} className="gap-2">
          <Plus className="h-4 w-4" />
          Yangi muddat
        </Button>
      </motion.div>

      {/* Stats Cards */}
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
                  {data?.total || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Jami muddatlar</div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {vagonTurlari?.items?.length || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Vagon turlari</div>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Train className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {tamirTurlari?.length || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Ta'mir turlari</div>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Wrench className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {data?.items?.length || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">So'nggi qo'shilganlar</div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters and View Toggle */}
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
              <div className="flex gap-3">
                <Select
                  value={vagonTuriFilter}
                  onValueChange={setVagonTuriFilter}
                >
                  <SelectTrigger className="w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Vagon turi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha turlar</SelectItem>
                    {vagonTurlari?.items?.map((tur) => (
                      <SelectItem key={tur.id} value={tur.id.toString()}>
                        {tur.nomi} ({tur.kodli})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={tamirTuriFilter}
                  onValueChange={setTamirTuriFilter}
                >
                  <SelectTrigger className="w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Ta'mir turi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha turlar</SelectItem>
                    {tamirTurlari?.map((tur) => (
                      <SelectItem key={tur.id} value={tur.id.toString()}>
                        {tur.nomi} ({tur.kodi})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-2 border-l pl-3">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="h-10 w-10"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'matrix' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('matrix')}
                    className="h-10 w-10"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>

                <Button variant="outline" onClick={() => refetch()} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Yangilash
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Table/Matrix View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Vagon ta'mir muddatlari ro'yxati
              {viewMode === 'matrix' && (
                <Badge variant="secondary" className="ml-2">
                  Matrix ko'rinishi
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Jami {data?.total || 0} ta muddat
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : viewMode === 'list' ? (
              // List ko'rinishi
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vagon turi</TableHead>
                      <TableHead>Ta'mir turi</TableHead>
                      <TableHead>Ta'mir kirish turi</TableHead>
                      <TableHead>Muddat (oy)</TableHead>
                      <TableHead>Maksimal km</TableHead>
                      <TableHead>Izoh</TableHead>
                      <TableHead>Qo'shilgan</TableHead>
                      <TableHead className="text-right">Amallar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.items?.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Train className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="font-medium">{item.vagonTuri?.nomi}</div>
                              <div className="text-xs text-gray-500">{item.vagonTuri?.kodli}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Wrench className="h-4 w-4 text-gray-400" />
                            <div>
                              <div>{item.tamirTuri?.nomi}</div>
                              <div className="text-xs text-gray-500">{item.tamirTuri?.kodi}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {item.tamirType?.toUpperCase() || "VAQT"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {item.muddatOy} oy
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Gauge className="h-4 w-4 text-gray-400" />
                            {item.maksimalKm === 0 || item.maksimalKm === undefined ? "-" : item.maksimalKm.toLocaleString()} km
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.izoh || '—'}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {format(new Date(item.yaratilganVaqt), 'dd MMM yyyy', { locale: uz })}
                          </div>
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
                                <Link href={`/dashboard/vagon-tamir-muddatlari/${item.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ko'rish
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(item)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Tahrirlash
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 dark:text-red-400"
                                onClick={() => {
                                  setItemToDelete({ 
                                    id: item.id, 
                                    nomi: `${item.vagonTuri?.nomi} - ${item.tamirTuri?.nomi}` 
                                  })
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                O'chirish
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}

                    {data?.items?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <AlertCircle className="h-8 w-8 text-gray-400" />
                            <p className="text-gray-500 dark:text-gray-400">
                              Hech qanday muddat topilmadi
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

                {/* Pagination - faqat list ko'rinishida */}
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
              </>
            ) : (
              // Matrix ko'rinishi
              <MatrixView 
                data={data}
                vagonTurlari={vagonTurlari}
                tamirTurlari={tamirTurlari}
                onEdit={handleEdit}
                onDelete={handleMatrixDelete}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Vagon Tamir Muddati Dialog */}
      <VagonTamirMuddatiDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        muddat={selectedItem}
        onSuccess={() => {
          setDialogOpen(false)
          setSelectedItem(null)
          refetch()
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Muddatni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete && (
                <span>
                  <span className="font-bold">"{itemToDelete.nomi}"</span> muddatini o'chirishni tasdiqlaysizmi?
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