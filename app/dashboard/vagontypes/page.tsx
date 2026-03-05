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
  Train,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  RefreshCw,
  AlertCircle,
  Truck,
  FileText,
} from 'lucide-react'
import { useVagonTurlari, useDeleteVagonTuri } from '@/lib/hooks/useVagon'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import { VagonTuriDialog } from '@/components/vagon/vagon-turi-dialog'
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

export default function VagonTurlariPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: number; nomi: string } | null>(null)
  const limit = 10

  const { data, isLoading, refetch } = useVagonTurlari({
    search: search || undefined,
    page,
    limit,
  })

  const deleteMutation = useDeleteVagonTuri()

  const handleEdit = (item: any) => {
    setSelectedItem(item)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setSelectedItem(null)
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
            Vagon turlari
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Barcha vagon turlarini boshqaring
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Yangi vagon turi
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
                <div className="text-sm text-gray-500 dark:text-gray-400">Jami turlar</div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Train className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {data?.items?.filter(t => t.vagonlar?.length && t.vagonlar?.length > 0).length || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Faol turlar</div>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Truck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {data?.items?.reduce((acc, curr) => acc + (curr.vagonlar?.length || 0), 0) || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Jami vagonlar</div>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />
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

      {/* Search */}
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
                  placeholder="Vagon turi nomi bo'yicha qidirish..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" onClick={() => refetch()} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Yangilash
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Train className="h-5 w-5 text-primary" />
              Vagon turlari ro'yxati
            </CardTitle>
            <CardDescription>
              Jami {data?.total || 0} ta vagon turi
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nomi</TableHead>
                    <TableHead>Kodi</TableHead>
                    <TableHead>Tavsifi</TableHead>
                    <TableHead>Vagonlar soni</TableHead>
                    <TableHead>Qo'shilgan</TableHead>
                    <TableHead className="text-right">Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.items?.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell className="font-medium">{item.nomi}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {item.kodli}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {item.tavsifi || '—'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          {item.vagonlar?.length || 0}
                        </Badge>
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
                              <Link href={`/dashboard/vagontypes/${item.id}`}>
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
                                setItemToDelete({ id: item.id, nomi: item.nomi })
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
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="h-8 w-8 text-gray-400" />
                          <p className="text-gray-500 dark:text-gray-400">
                            Hech qanday vagon turi topilmadi
                          </p>
                          <Button variant="outline" onClick={handleAdd}>
                            <Plus className="h-4 w-4 mr-2" />
                            Yangi qo'shish
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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

      {/* Vagon Turi Dialog */}
      <VagonTuriDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vagonTuri={selectedItem}
        onSuccess={() => {
          setDialogOpen(false)
          setSelectedItem(null)
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vagon turini o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete && (
                <span>
                  <span className="font-bold">"{itemToDelete.nomi}"</span> vagon turini o'chirishni tasdiqlaysizmi?
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

// "use client"

// import { useState } from 'react'
// import { motion } from 'framer-motion'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'
// import { Badge } from '@/components/ui/badge'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import {
//   Train,
//   Plus,
//   Search,
//   MoreVertical,
//   Edit,
//   Trash2,
//   Eye,
//   FileText,
//   Calendar,
//   Truck,
//   AlertCircle,
//   RefreshCw,
// } from 'lucide-react'
// import { useVagonTurlari, useDeleteVagonTuri } from '@/lib/hooks/useVagon'
// import { Skeleton } from '@/components/ui/skeleton'
// import { format } from 'date-fns'
// import { uz } from 'date-fns/locale'

// export default function VagonTurlariPage() {
//   const router = useRouter()
//   const [search, setSearch] = useState('')
//   const [page, setPage] = useState(1)
//   const limit = 10

//   const { data, isLoading, refetch } = useVagonTurlari({
//     search: search || undefined,
//     page,
//     limit,
//   })

//   const deleteMutation = useDeleteVagonTuri()

//   const handleDelete = async (id: number, nomi: string) => {
//     if (window.confirm(`"${nomi}" vagon turini o'chirishni tasdiqlaysizmi?`)) {
//       try {
//         await deleteMutation.mutateAsync(id)
//       } catch (error) {
//         console.error('O\'chirishda xatolik:', error)
//       }
//     }
//   }

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
//       >
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//             Vagon turlari
//           </h1>
//           <p className="text-gray-600 dark:text-gray-300 mt-1">
//             Barcha vagon turlarini boshqaring
//           </p>
//         </div>
//         <Button 
//           onClick={() => router.push('/dashboard/vagon-turlari/create')}
//           className="gap-2"
//         >
//           <Plus className="h-4 w-4" />
//           Yangi vagon turi
//         </Button>
//       </motion.div>

//       {/* Stats Cards */}
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
//                 <div className="text-3xl font-bold text-gray-900 dark:text-white">
//                   {data?.total || 0}
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">Jami turlar</div>
//               </div>
//               <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//                 <Train className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-2 hover:shadow-lg transition-all">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
//                   {data?.items?.filter(t => t.vagonlar?.length?t.vagonlar?.length:0 > 0).length || 0}
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">Faol turlar</div>
//               </div>
//               <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
//                 <Truck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-2 hover:shadow-lg transition-all">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
//                   {data?.items?.reduce((acc, curr) => acc + (curr.vagonlar?.length || 0), 0) || 0}
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">Jami vagonlar</div>
//               </div>
//               <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
//                 <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-2 hover:shadow-lg transition-all">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
//                   {data?.items?.length || 0}
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">So'nggi qo'shilganlar</div>
//               </div>
//               <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
//                 <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Search */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2 }}
//       >
//         <Card className="border-2">
//           <CardContent className="p-6">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Vagon turi qidirish..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="pl-9"
//                 />
//               </div>
//               <Button variant="outline" onClick={() => refetch()} className="gap-2">
//                 <RefreshCw className="h-4 w-4" />
//                 Yangilash
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Table */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.3 }}
//       >
//         <Card className="border-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Train className="h-5 w-5 text-primary" />
//               Vagon turlari ro'yxati
//             </CardTitle>
//             <CardDescription>
//               Jami {data?.total || 0} ta vagon turi
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <div className="space-y-4">
//                 {[...Array(5)].map((_, i) => (
//                   <Skeleton key={i} className="h-16 w-full" />
//                 ))}
//               </div>
//             ) : (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Nomi</TableHead>
//                     <TableHead>Kodi</TableHead>
//                     <TableHead>Tavsifi</TableHead>
//                     <TableHead>Vagonlar soni</TableHead>
//                     <TableHead>Qo'shilgan sana</TableHead>
//                     <TableHead className="text-right">Amallar</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {data?.items?.map((tur) => (
//                     <TableRow key={tur.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
//                       <TableCell className="font-medium">{tur.nomi}</TableCell>
//                       <TableCell>
//                         <Badge variant="outline" className="font-mono">
//                           {tur.kodli}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
//                           {tur.tavsifi || '—'}
//                         </p>
//                       </TableCell>
//                       <TableCell>
//                         <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
//                           {tur.vagonlar?.length || 0}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2 text-sm">
//                           <Calendar className="h-4 w-4 text-gray-400" />
//                           {format(new Date(tur.yaratilganVaqt), 'dd MMM yyyy', { locale: uz })}
//                         </div>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="icon">
//                               <MoreVertical className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuLabel>Amallar</DropdownMenuLabel>
//                             <DropdownMenuItem asChild>
//                               <Link href={`/dashboard/vagon-turlari/${tur.id}`}>
//                                 <Eye className="h-4 w-4 mr-2" />
//                                 Ko'rish
//                               </Link>
//                             </DropdownMenuItem>
//                             <DropdownMenuItem asChild>
//                               <Link href={`/dashboard/vagon-turlari/${tur.id}/edit`}>
//                                 <Edit className="h-4 w-4 mr-2" />
//                                 Tahrirlash
//                               </Link>
//                             </DropdownMenuItem>
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem
//                               className="text-red-600 dark:text-red-400"
//                               onClick={() => handleDelete(tur.id, tur.nomi)}
//                             >
//                               <Trash2 className="h-4 w-4 mr-2" />
//                               O'chirish
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   ))}

//                   {data?.items?.length === 0 && (
//                     <TableRow>
//                       <TableCell colSpan={6} className="text-center py-8">
//                         <div className="flex flex-col items-center gap-2">
//                           <AlertCircle className="h-8 w-8 text-gray-400" />
//                           <p className="text-gray-500 dark:text-gray-400">
//                             Hech qanday vagon turi topilmadi
//                           </p>
//                           <Button 
//                             variant="outline" 
//                             onClick={() => router.push('/dashboard/vagon-turlari/create')}
//                           >
//                             <Plus className="h-4 w-4 mr-2" />
//                             Yangi qo'shish
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             )}

//             {/* Pagination */}
//             {data && data.total > limit && (
//               <div className="flex items-center justify-between mt-6">
//                 <div className="text-sm text-gray-500">
//                   {((page - 1) * limit) + 1} - {Math.min(page * limit, data.total)} / {data.total}
//                 </div>
//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setPage(p => Math.max(1, p - 1))}
//                     disabled={page === 1}
//                   >
//                     Oldingi
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setPage(p => p + 1)}
//                     disabled={page * limit >= data.total}
//                   >
//                     Keyingi
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   )
// }