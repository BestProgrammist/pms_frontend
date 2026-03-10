"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import * as XLSX from 'xlsx'
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
  Truck,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Wrench,
  AlertCircle,
  Gauge,
  Calendar,
  RefreshCw,
  Activity,
  Grid,
  List,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
} from 'lucide-react'
import { useVagonlar, useDeleteVagon, useVagonStatistics, useRepairNeeded, useKmLimits } from '@/lib/hooks/useVagon'
import { useTamirTuriDropdown } from '@/lib/hooks/useTamir'
import { Vagon, VagonHolati } from '@/types/vagon'
import { TamirTuri } from '@/types/tamir'
import { Skeleton } from '@/components/ui/skeleton'
import { format, differenceInMonths, addMonths, differenceInDays } from 'date-fns'
import { uz } from 'date-fns/locale'
import { VagonDialog } from '@/components/vagon/vagon-dialog'
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
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'

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
  [VagonHolati.DECOMMISSIONED]: Activity,
}

const holatLabels = {
  [VagonHolati.ACTIVE]: 'Faol',
  [VagonHolati.REPAIR]: 'Ta\'mirda',
  [VagonHolati.BROKEN]: 'Buzuq',
  [VagonHolati.DECOMMISSIONED]: 'Foydalanilmaydi',
}

// Types for Matrix View
interface VagonTamirHistory {
  vagonId: number;
  tamirTuriId: number;
  oxirgiSana: Date | null;
  keyingiSana: Date | null;
  muddatOy: number;
  maksimalKm: number;
  hozirgiKm: number;
  foiz: number;
}

interface VagonWithDetails extends Vagon {
  tamirTarixi: VagonTamirHistory[];
}

interface MatrixViewProps {
  vagonlar?: {
    items: Vagon[];
    total: number;
  };
  tamirTurlari?: TamirTuri[];
  kmLimits?: any[];
  onEdit: (item: Vagon) => void;
}

// Matrix View Component
function VagonMatrixView({ vagonlar, tamirTurlari, kmLimits, onEdit }: MatrixViewProps) {
  const [sortBy, setSortBy] = useState<'vagon' | 'holat'>('vagon');

  const getRepairStatus = (vagon: Vagon, tamirTuri: TamirTuri) => {
    const vagonYoshi = differenceInMonths(new Date(), new Date(vagon.ishlabChigarilganSana));
    const limit = kmLimits?.find(l => l.vagonRaqami === vagon.raqami);
    
    // Ta'mirga kirish vaqtini hisoblash
    const oxirgiTamir = null; // Bu yerda real ma'lumotlar bo'lishi kerak
    const keyingiTamir = addMonths(new Date(vagon.ishlabChigarilganSana), 60); // Misol uchun 5 yil
    
    const muddatOy = 60; // Bu yerda real muddat bo'lishi kerak
    const foiz = limit ? limit.foiz : Math.min(100, Math.round((vagonYoshi / muddatOy) * 100));
    
    let status: 'normal' | 'warning' | 'critical' = 'normal';
    if (foiz >= 100) status = 'critical';
    else if (foiz >= 80) status = 'warning';

    return {
      oxirgiSana: oxirgiTamir,
      keyingiSana: keyingiTamir,
      foiz,
      status,
      km: vagon.bosibOtganKm,
      kmLimit: limit?.limitKm
    };
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200';
      case 'warning': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'critical': return AlertTriangle;
      case 'warning': return Clock;
      default: return CheckCircle2;
    }
  };

  // Sort vagonlar
  const sortedVagonlar = vagonlar?.items?.sort((a, b) => {
    if (sortBy === 'holat') {
      return a.holati.localeCompare(b.holati);
    }
    return a.raqami.localeCompare(b.raqami);
  });

  if (!vagonlar?.items?.length || !tamirTurlari?.length) {
    return (
      <div className="text-center py-8">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="h-8 w-8 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400">
            Ma'lumotlar topilmadi
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <div className="flex justify-end gap-2">
        <Button
          variant={sortBy === 'vagon' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('vagon')}
          className="gap-2"
        >
          <Truck className="h-4 w-4" />
          Vagon bo'yicha
        </Button>
        <Button
          variant={sortBy === 'holat' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('holat')}
          className="gap-2"
        >
          <Activity className="h-4 w-4" />
          Holat bo'yicha
        </Button>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800/50">
              <TableHead className="min-w-[250px] sticky left-0 bg-gray-50 dark:bg-gray-800/50 z-20">
                <div className="font-bold">Vagonlar</div>
              </TableHead>
              {tamirTurlari?.map((tur) => (
                <TableHead key={tur.id} className="min-w-[200px] text-center">
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
            {sortedVagonlar?.map((vagon) => {
              const HolatIcon = holatIcons[vagon.holati];
              
              return (
                <TableRow key={vagon.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="font-medium sticky left-0 bg-white dark:bg-gray-900 z-10">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${holatColors[vagon.holati]}`}>
                        <HolatIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-bold">{vagon.raqami}</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline" className="text-xs">
                            {vagon.vagonTuri?.nomi}
                          </Badge>
                          <Badge className={holatColors[vagon.holati]}>
                            {holatLabels[vagon.holati]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <Gauge className="h-3 w-3" />
                          {vagon.bosibOtganKm.toLocaleString()} km
                          <Calendar className="h-3 w-3 ml-2" />
                          {format(new Date(vagon.ishlabChigarilganSana), 'dd.MM.yyyy')}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  {tamirTurlari?.map((tur) => {
                    const repairStatus = getRepairStatus(vagon, tur);
                    const StatusIcon = getStatusIcon(repairStatus.status);
                    
                    return (
                      <TableCell key={tur.id} className="p-4 text-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div 
                                className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getStatusColor(repairStatus.status)}`}
                                onClick={() => onEdit(vagon)}
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <StatusIcon className="h-4 w-4" />
                                    <Badge variant="outline" className="text-xs">
                                      {repairStatus.foiz}%
                                    </Badge>
                                  </div>
                                  
                                  {repairStatus.oxirgiSana ? (
                                    <div className="text-xs">
                                      <div>Oxirgi: {format(repairStatus.oxirgiSana, 'dd.MM.yyyy')}</div>
                                      <div className="font-medium mt-1">
                                        Keyingi: {repairStatus.keyingiSana ? format(repairStatus.keyingiSana, 'dd.MM.yyyy') : 'Aniqlanmagan'}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-xs">
                                      <div className="text-gray-500">Hali ta'mirga kirmagan</div>
                                      <div className="font-medium mt-1 text-primary">
                                        Keyingi: {format(addMonths(new Date(vagon.ishlabChigarilganSana), 60), 'dd.MM.yyyy')}
                                      </div>
                                    </div>
                                  )}
                                  
                                  <Progress value={repairStatus.foiz} className="h-1.5" />
                                  
                                  {repairStatus.kmLimit && (
                                    <div className="flex items-center justify-center gap-1 text-xs">
                                      <Gauge className="h-3 w-3" />
                                      <span>{repairStatus.km.toLocaleString()} / {repairStatus.kmLimit.toLocaleString()} km</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="w-64">
                              <div className="space-y-2">
                                <p className="font-medium">{vagon.raqami} - {tur.nomi}</p>
                                <div className="text-sm space-y-1">
                                  <div className="flex justify-between">
                                    <span>Ishlab chiqarilgan:</span>
                                    <span>{format(new Date(vagon.ishlabChigarilganSana), 'dd.MM.yyyy')}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Bosib o'tgan km:</span>
                                    <span>{vagon.bosibOtganKm.toLocaleString()} km</span>
                                  </div>
                                  {repairStatus.kmLimit && (
                                    <div className="flex justify-between">
                                      <span>KM limiti:</span>
                                      <span>{repairStatus.kmLimit.toLocaleString()} km</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between font-medium mt-2">
                                    <span>Keyingi ta'mir:</span>
                                    <span className={repairStatus.status === 'critical' ? 'text-red-600' : ''}>
                                      {repairStatus.keyingiSana 
                                        ? format(repairStatus.keyingiSana, 'dd.MM.yyyy')
                                        : 'Aniqlanmagan'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Excel export funksiyalari
const exportToExcel = {
  // List ko'rinishini export qilish
  listView: (data: any, tamirTurlari?: TamirTuri[]) => {
    const worksheet = XLSX.utils.json_to_sheet(
      data?.items?.map((item: Vagon) => ({
        'Raqami': item.raqami,
        'Vagon turi': item.vagonTuri?.nomi || 'Noma\'lum',
        'Vagon kodi': item.vagonTuri?.kodli || '-',
        'Holati': holatLabels[item.holati],
        'Ishlab chiqarilgan': format(new Date(item.ishlabChigarilganSana), 'dd.MM.yyyy'),
        'Bosib o\'tgan km': item.bosibOtganKm,
        'Qo\'shilgan sana': format(new Date(item.yaratilganVaqt), 'dd.MM.yyyy'),
      })) || []
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vagonlar');
    XLSX.writeFile(workbook, `vagonlar_${format(new Date(), 'dd_MM_yyyy')}.xlsx`);
  },

  // Matrix ko'rinishini export qilish
  matrixView: (vagonlar: any, tamirTurlari?: TamirTuri[], kmLimits?: any[]) => {
    // Matrix ma'lumotlarini tayyorlash
    const matrixData: any[] = [];
    
    // Header qator
    const headerRow: any = { 'Vagon': 'Vagonlar / Ta\'mir turlari' };
    tamirTurlari?.forEach((tur, index) => {
      headerRow[`Tur_${index + 1}`] = `${tur.nomi} (${tur.kodi})`;
    });
    matrixData.push(headerRow);

    // Vagonlar qatorlari
    vagonlar?.items?.forEach((vagon: Vagon) => {
      const row: any = {
        'Vagon': `${vagon.raqami} - ${vagon.vagonTuri?.nomi} (${holatLabels[vagon.holati]})`
      };

      tamirTurlari?.forEach((tur, index) => {
        const vagonYoshi = differenceInMonths(new Date(), new Date(vagon.ishlabChigarilganSana));
        const limit = kmLimits?.find(l => l.vagonRaqami === vagon.raqami);
        const muddatOy = 60; // Bu yerda real muddat bo'lishi kerak
        const keyingiSana = addMonths(new Date(vagon.ishlabChigarilganSana), muddatOy);
        
        row[`Tur_${index + 1}`] = {
          v: `Keyingi: ${format(keyingiSana, 'dd.MM.yyyy')} | Foiz: ${limit?.foiz || 0}% | KM: ${vagon.bosibOtganKm.toLocaleString()}`,
          t: 's'
        };
      });

      matrixData.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(matrixData, { skipHeader: true });
    
    // Ustun kengliklarini sozlash
    const colWidths = [
      { wch: 40 }, // Vagon ustuni
      ...tamirTurlari?.map(() => ({ wch: 50 })) || [] // Ta'mir turlari ustunlari
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vagonlar_Matrix');
    XLSX.writeFile(workbook, `vagonlar_matrix_${format(new Date(), 'dd_MM_yyyy')}.xlsx`);
  },

  // Batafsil hisobot (ta'mir tarixi bilan)
  detailedReport: (vagonlar: any, tamirTurlari?: TamirTuri[], kmLimits?: any[]) => {
    const detailedData: any[] = [];

    vagonlar?.items?.forEach((vagon: Vagon) => {
      tamirTurlari?.forEach((tur) => {
        const vagonYoshi = differenceInMonths(new Date(), new Date(vagon.ishlabChigarilganSana));
        const limit = kmLimits?.find(l => l.vagonRaqami === vagon.raqami);
        const muddatOy = 60; // Bu yerda real muddat bo'lishi kerak
        const keyingiSana = addMonths(new Date(vagon.ishlabChigarilganSana), muddatOy);
        
        detailedData.push({
          'Vagon raqami': vagon.raqami,
          'Vagon turi': vagon.vagonTuri?.nomi || 'Noma\'lum',
          'Holati': holatLabels[vagon.holati],
          'Ta\'mir turi': tur.nomi,
          'Ta\'mir kodi': tur.kodi,
          'Ishlab chiqarilgan sana': format(new Date(vagon.ishlabChigarilganSana), 'dd.MM.yyyy'),
          'Bosib o\'tgan km': vagon.bosibOtganKm,
          'Muddat (oy)': muddatOy,
          'Muddat foizi': `${limit?.foiz || 0}%`,
          'Keyingi ta\'mir sanasi': format(keyingiSana, 'dd.MM.yyyy'),
          'KM limiti': limit?.limitKm || 'Mavjud emas',
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(detailedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Batafsil');
    XLSX.writeFile(workbook, `vagonlar_hisobot_${format(new Date(), 'dd_MM_yyyy')}.xlsx`);
  }
};

export default function VagonlarPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [holatFilter, setHolatFilter] = useState<VagonHolati | 'all'>('all')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: number; nomi: string } | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'matrix'>('list')
  const limit = 10

  const { data: statistics } = useVagonStatistics()
  const { data: tamirTurlari } = useTamirTuriDropdown()
  const { data, isLoading, refetch } = useVagonlar({
    search: search || undefined,
    holati: holatFilter !== 'all' ? holatFilter : undefined,
    page,
    limit,
  })

  const { data: repairNeeded } = useRepairNeeded()
  const { data: kmLimits } = useKmLimits()

  const deleteMutation = useDeleteVagon()

  const handleEdit = (item: Vagon) => {
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
            Vagonlar
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Barcha vagonlarni boshqaring va kuzatib boring
          </p>
        </div>
        <div className="flex gap-2">
          {/* Excel Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Excel export
                <Download className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Export formatini tanlang</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => exportToExcel.listView(data, tamirTurlari)}
                className="gap-2"
              >
                <List className="h-4 w-4" />
                <span>List ko'rinishi</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => exportToExcel.matrixView(data, tamirTurlari, kmLimits)}
                className="gap-2"
                disabled={viewMode !== 'matrix'}
              >
                <Grid className="h-4 w-4" />
                <span>Matrix ko'rinishi</span>
                {viewMode !== 'matrix' && (
                  <span className="text-xs text-gray-400 ml-auto">(Matrixda emas)</span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => exportToExcel.detailedReport(data, tamirTurlari, kmLimits)}
                className="gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Batafsil hisobot</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Yangi vagon
          </Button>
        </div>
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
                <div className="text-sm text-gray-500 dark:text-gray-400">Jami vagonlar</div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {statistics?.active || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Faol vagonlar</div>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {statistics?.repair || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Ta'mirdagi</div>
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
                  {(statistics?.totalKm || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Jami masofa (km)</div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Gauge className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Warning Cards */}
      {repairNeeded && repairNeeded.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    {repairNeeded.length} ta vagon uchun ta'mir talab qilinadi
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-300">
                    Muddat bo'yicha yoki km limitidan oshgan
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
                  placeholder="Vagon raqami bo'yicha qidirish..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-3">
                <Select
                  value={holatFilter}
                  onValueChange={(value) => setHolatFilter(value as VagonHolati | 'all')}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Holati" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha holatlar</SelectItem>
                    {Object.values(VagonHolati).map((holat) => (
                      <SelectItem key={holat} value={holat}>
                        {holatLabels[holat]}
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
                    title="List ko'rinishi"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'matrix' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('matrix')}
                    className="h-10 w-10"
                    title="Matrix ko'rinishi"
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
              <Truck className="h-5 w-5 text-primary" />
              Vagonlar ro'yxati
              {viewMode === 'matrix' && (
                <Badge variant="secondary" className="ml-2">
                  Matrix ko'rinishi
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Jami {data?.total || 0} ta vagon
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
              <>
                {/* List View Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Raqami</TableHead>
                      <TableHead>Vagon turi</TableHead>
                      <TableHead>Holati</TableHead>
                      <TableHead>Ishlab chiqarilgan</TableHead>
                      <TableHead>Bosib o'tgan km</TableHead>
                      <TableHead>Qo'shilgan</TableHead>
                      <TableHead className="text-right">Amallar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.items?.map((item) => {
                      const HolatIcon = holatIcons[item.holati]
                      const kmLimit = kmLimits?.find(limit => limit.vagonRaqami === item.raqami)

                      return (
                        <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <TableCell className="font-medium">{item.raqami}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {item.vagonTuri?.kodli || 'Noma\'lum'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={holatColors[item.holati]}>
                              <HolatIcon className="h-3 w-3 mr-1" />
                              {holatLabels[item.holati]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              {format(new Date(item.ishlabChigarilganSana), 'dd.MM.yyyy')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <Gauge className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">{item.bosibOtganKm.toLocaleString()} km</span>
                              </div>
                              {kmLimit && kmLimit.foiz > 90 && (
                                <Progress value={kmLimit.foiz} className="h-1 w-24" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              {format(new Date(item.yaratilganVaqt), 'dd.MM.yyyy')}
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
                                  <Link href={`/dashboard/vagons/${item.id}`}>
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
                                    setItemToDelete({ id: item.id, nomi: item.raqami })
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
                      )
                    })}

                    {data?.items?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <AlertCircle className="h-8 w-8 text-gray-400" />
                            <p className="text-gray-500 dark:text-gray-400">
                              Hech qanday vagon topilmadi
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

                {/* Pagination - List View */}
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
              // Matrix View
              <VagonMatrixView 
                vagonlar={data}
                tamirTurlari={tamirTurlari}
                kmLimits={kmLimits}
                onEdit={handleEdit}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>

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
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
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
//   Truck,
//   Plus,
//   Search,
//   Filter,
//   MoreVertical,
//   Edit,
//   Trash2,
//   Eye,
//   Wrench,
//   AlertCircle,
//   Gauge,
//   Calendar,
//   RefreshCw,
//   Activity,
//   Grid,
//   List,
//   Clock,
//   AlertTriangle,
//   CheckCircle2,
// } from 'lucide-react'
// import { useVagonlar, useDeleteVagon, useVagonStatistics, useRepairNeeded, useKmLimits } from '@/lib/hooks/useVagon'
// import { useTamirTuriDropdown } from '@/lib/hooks/useTamir'
// import { Vagon, VagonHolati } from '@/types/vagon'
// import { IstamirType, TamirTuri } from '@/types/tamir'
// import { Skeleton } from '@/components/ui/skeleton'
// import { format, differenceInMonths, addMonths, differenceInDays } from 'date-fns'
// import { uz } from 'date-fns/locale'
// import { VagonDialog } from '@/components/vagon/vagon-dialog'
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog'
// import { Progress } from '@/components/ui/progress'
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// const holatColors = {
//   [VagonHolati.ACTIVE]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
//   [VagonHolati.REPAIR]: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
//   [VagonHolati.BROKEN]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
//   [VagonHolati.DECOMMISSIONED]: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
// }

// const holatIcons = {
//   [VagonHolati.ACTIVE]: Truck,
//   [VagonHolati.REPAIR]: Wrench,
//   [VagonHolati.BROKEN]: AlertCircle,
//   [VagonHolati.DECOMMISSIONED]: Activity,
// }

// const holatLabels = {
//   [VagonHolati.ACTIVE]: 'Faol',
//   [VagonHolati.REPAIR]: 'Ta\'mirda',
//   [VagonHolati.BROKEN]: 'Buzuq',
//   [VagonHolati.DECOMMISSIONED]: 'Foydalanilmaydi',
// }

// // Types for Matrix View
// interface VagonTamirHistory {
//   vagonId: number;
//   tamirTuriId: number;
//   oxirgiSana: Date | null;
//   keyingiSana: Date | null;
//   muddatOy: number;
//   maksimalKm: number;
//   hozirgiKm: number;
//   foiz: number;
// }

// interface VagonWithDetails extends Vagon {
//   tamirTarixi: VagonTamirHistory[];
// }

// interface MatrixViewProps {
//   vagonlar?: {
//     items: Vagon[];
//     total: number;
//   };
//   tamirTurlari?: TamirTuri[];
//   kmLimits?: any[];
//   onEdit: (item: Vagon) => void;
// }

// // Matrix View Component
// function VagonMatrixView({ vagonlar, tamirTurlari, kmLimits, onEdit }: MatrixViewProps) {
//   console.log(vagonlar);
  
//   const [sortBy, setSortBy] = useState<'vagon' | 'holat'>('vagon');

//   const getRepairStatus = (vagon: Vagon, tamirTuri: TamirTuri) => {
//     const vagonYoshi = differenceInMonths(new Date(), new Date(vagon.ishlabChigarilganSana));
//     const limit = kmLimits?.find(l => l.vagonRaqami === vagon.raqami);
//     console.log(vagon);
//     console.log(tamirTuri);
    
    
//     // Ta'mirga kirish vaqtini hisoblash
//     const oxirgiTamir = getOxirgiTamirSana(vagon, tamirTuri); // Bu yerda real ma'lumotlar bo'lishi kerak
//     const muddatOy = getTamirMuddati(vagon, tamirTuri); // Bu yerda real muddat bo'lishi kerak
//     console.log(muddatOy);
//     console.log(vagonYoshi);
    
//     const keyingiTamir = addMonths(new Date(vagon.ishlabChigarilganSana), 60); // Misol uchun 5 yil
//     const foiz = limit ? limit.foiz : muddatOy?.muddatOy?Math.min(100, Math.round((vagonYoshi / muddatOy?.muddatOy) * 100)):1;
    
//     let status: 'normal' | 'warning' | 'critical' = 'normal';
//     if (foiz >= 100) status = 'critical';
//     else if (foiz >= 80) status = 'warning';

//     return {
//       oxirgiSana: oxirgiTamir,
//       keyingiSana: keyingiTamir,
//       foiz,
//       status,
//       km: vagon.bosibOtganKm,
//       kmLimit: limit?.limitKm
//     };
//   };
//   const getOxirgiTamirSana = (vagon: Vagon, tamirTuri: TamirTuri): Date | null => {
//   if (!vagon.tamirJadvallari || vagon.tamirJadvallari.length === 0) {
//     return null;
//   }

//   // Berilgan tamirTuri bo'yicha amalga oshirilgan ta'mirlarni filter qilish
//   const tamirJadvallari = vagon.tamirJadvallari?.filter(
//     jadval => 
//       jadval.tamirTuriId === tamirTuri.id && 
//       jadval.amalgaOshirilganSana // faqat amalga oshirilganlarni olish
//   );

//   if (tamirJadvallari.length === 0) {
//     return null;
//   }

//   // Oxirgi amalga oshirilgan ta'mirni topish
//   const oxirgiTamir = tamirJadvallari.reduce((prev, current) => {
//     if (!prev.amalgaOshirilganSana) return current;
//     if (!current.amalgaOshirilganSana) return prev;
    
//     return prev.amalgaOshirilganSana > current.amalgaOshirilganSana 
//       ? prev 
//       : current;
//   });

//   return oxirgiTamir.amalgaOshirilganSana || null;
// };
//   const getTamirMuddati  = (vagon: Vagon, tamirTuri: TamirTuri): {
//   muddatOy: number;
//   maksimalKm: number;
//   tamirType: IstamirType;
// } | null => {
//   if (!vagon.vagonTuri || !vagon.vagonTuri.tamirMuddatlari || vagon.vagonTuri.tamirMuddatlari.length === 0) {
//     return null;
//   }

//   const tamirMuddati = vagon.vagonTuri.tamirMuddatlari.find(
//     muddat => 
//       muddat.vagonTuriId === vagon.vagonTuriId && 
//       muddat.tamirTuriId === tamirTuri.id
//   );

//   if (tamirMuddati) {
//     return {
//       muddatOy: tamirMuddati.muddatOy?tamirMuddati.muddatOy:0,
//       maksimalKm: tamirMuddati.maksimalKm?tamirMuddati.maksimalKm:0,
//       tamirType: tamirMuddati.tamirType
//     };
//   }
//   return null
// };

//   const getStatusColor = (status: string) => {
//     switch(status) {
//       case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200';
//       case 'warning': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200';
//       default: return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch(status) {
//       case 'critical': return AlertTriangle;
//       case 'warning': return Clock;
//       default: return CheckCircle2;
//     }
//   };

//   // Sort vagonlar
//   const sortedVagonlar = vagonlar?.items?.sort((a, b) => {
//     if (sortBy === 'holat') {
//       return a.holati.localeCompare(b.holati);
//     }
//     return a.raqami.localeCompare(b.raqami);
//   });

//   if (!vagonlar?.items?.length || !tamirTurlari?.length) {
//     return (
//       <div className="text-center py-8">
//         <div className="flex flex-col items-center gap-2">
//           <AlertCircle className="h-8 w-8 text-gray-400" />
//           <p className="text-gray-500 dark:text-gray-400">
//             Ma'lumotlar topilmadi
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {/* Sort Controls */}
//       <div className="flex justify-end gap-2">
//         <Button
//           variant={sortBy === 'vagon' ? 'default' : 'outline'}
//           size="sm"
//           onClick={() => setSortBy('vagon')}
//           className="gap-2"
//         >
//           <Truck className="h-4 w-4" />
//           Vagon bo'yicha
//         </Button>
//         <Button
//           variant={sortBy === 'holat' ? 'default' : 'outline'}
//           size="sm"
//           onClick={() => setSortBy('holat')}
//           className="gap-2"
//         >
//           <Activity className="h-4 w-4" />
//           Holat bo'yicha
//         </Button>
//       </div>

//       {/* Matrix Table */}
//       <div className="overflow-x-auto border rounded-lg">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-gray-50 dark:bg-gray-800/50">
//               <TableHead className="min-w-[250px] sticky left-0 bg-gray-50 dark:bg-gray-800/50 z-20">
//                 <div className="font-bold">Vagonlar</div>
//               </TableHead>
//               {tamirTurlari?.map((tur) => (
//                 <TableHead key={tur.id} className="min-w-[200px] text-center">
//                   <div className="flex flex-col items-center gap-1">
//                     <Wrench className="h-4 w-4 text-primary" />
//                     <span>{tur.nomi}</span>
//                     <span className="text-xs text-gray-500">{tur.kodi}</span>
//                   </div>
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {sortedVagonlar?.map((vagon) => {
//               const HolatIcon = holatIcons[vagon.holati];
              
//               return (
//                 <TableRow key={vagon.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
//                   <TableCell className="font-medium sticky left-0 bg-white dark:bg-gray-900 z-10">
//                     <div className="flex items-center gap-3">
//                       <div className={`p-2 rounded-lg ${holatColors[vagon.holati]}`}>
//                         <HolatIcon className="h-4 w-4" />
//                       </div>
//                       <div>
//                         <div className="font-bold">{vagon.raqami}</div>
//                         <div className="flex items-center gap-2 text-sm">
//                           <Badge variant="outline" className="text-xs">
//                             {vagon.vagonTuri?.nomi}
//                           </Badge>
//                           <Badge className={holatColors[vagon.holati]}>
//                             {holatLabels[vagon.holati]}
//                           </Badge>
//                         </div>
//                         <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
//                           <Gauge className="h-3 w-3" />
//                           {vagon.bosibOtganKm.toLocaleString()} km
//                           <Calendar className="h-3 w-3 ml-2" />
//                           {format(new Date(vagon.ishlabChigarilganSana), 'dd.MM.yyyy')}
//                         </div>
//                       </div>
//                     </div>
//                   </TableCell>
                  
//                   {tamirTurlari?.map((tur) => {
//                     console.log(vagon);
                    
//                     const repairStatus = getRepairStatus(vagon, tur);
//                     const StatusIcon = getStatusIcon(repairStatus.status);
                    
//                     return (
//                       <TableCell key={tur.id} className="p-4 text-center">
//                         <TooltipProvider>
//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <div 
//                                 className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getStatusColor(repairStatus.status)}`}
//                                 onClick={() => onEdit(vagon)}
//                               >
//                                 <div className="space-y-2">
//                                   <div className="flex items-center justify-between">
//                                     <StatusIcon className="h-4 w-4" />
//                                     <Badge variant="outline" className="text-xs">
//                                       {repairStatus.foiz}%
//                                     </Badge>
//                                   </div>
                                  
//                                   {repairStatus.oxirgiSana ? (
//                                     <div className="text-xs">
//                                       <div>Oxirgi: {format(repairStatus.oxirgiSana, 'dd.MM.yyyy')}</div>
//                                       <div className="font-medium mt-1">
//                                         Keyingi: {repairStatus.keyingiSana ? format(repairStatus.keyingiSana, 'dd.MM.yyyy') : 'Aniqlanmagan'}
//                                       </div>
//                                     </div>
//                                   ) : (
//                                     <div className="text-xs">
//                                       <div className="text-gray-500">Hali ta'mirga kirmagan</div>
//                                       <div className="font-medium mt-1 text-primary">
//                                         Keyingi: {format(addMonths(new Date(vagon.ishlabChigarilganSana), 60), 'dd.MM.yyyy')}
//                                       </div>
//                                     </div>
//                                   )}
                                  
//                                   <Progress value={repairStatus.foiz} className="h-1.5" />
                                  
//                                   {repairStatus.kmLimit && (
//                                     <div className="flex items-center justify-center gap-1 text-xs">
//                                       <Gauge className="h-3 w-3" />
//                                       <span>{repairStatus.km.toLocaleString()} / {repairStatus.kmLimit.toLocaleString()} km</span>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             </TooltipTrigger>
//                             <TooltipContent side="bottom" className="w-64">
//                               <div className="space-y-2">
//                                 <p className="font-medium">{vagon.raqami} - {tur.nomi}</p>
//                                 <div className="text-sm space-y-1">
//                                   <div className="flex justify-between">
//                                     <span>Ishlab chiqarilgan:</span>
//                                     <span>{format(new Date(vagon.ishlabChigarilganSana), 'dd.MM.yyyy')}</span>
//                                   </div>
//                                   <div className="flex justify-between">
//                                     <span>Bosib o'tgan km:</span>
//                                     <span>{vagon.bosibOtganKm.toLocaleString()} km</span>
//                                   </div>
//                                   {repairStatus.kmLimit && (
//                                     <div className="flex justify-between">
//                                       <span>KM limiti:</span>
//                                       <span>{repairStatus.kmLimit.toLocaleString()} km</span>
//                                     </div>
//                                   )}
//                                   <div className="flex justify-between font-medium mt-2">
//                                     <span>Keyingi ta'mir:</span>
//                                     <span className={repairStatus.status === 'critical' ? 'text-red-600' : ''}>
//                                       {repairStatus.keyingiSana 
//                                         ? format(repairStatus.keyingiSana, 'dd.MM.yyyy')
//                                         : 'Aniqlanmagan'}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </TooltipContent>
//                           </Tooltip>
//                         </TooltipProvider>
//                       </TableCell>
//                     );
//                   })}
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }

// export default function VagonlarPage() {
//   const router = useRouter()
//   const [search, setSearch] = useState('')
//   const [holatFilter, setHolatFilter] = useState<VagonHolati | 'all'>('all')
//   const [page, setPage] = useState(1)
//   const [dialogOpen, setDialogOpen] = useState(false)
//   const [selectedItem, setSelectedItem] = useState<any>(null)
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
//   const [itemToDelete, setItemToDelete] = useState<{ id: number; nomi: string } | null>(null)
//   const [viewMode, setViewMode] = useState<'list' | 'matrix'>('list')
//   const limit = 10

//   const { data: statistics } = useVagonStatistics()
//   const { data: tamirTurlari } = useTamirTuriDropdown()
//   const { data, isLoading, refetch } = useVagonlar({
//     search: search || undefined,
//     holati: holatFilter !== 'all' ? holatFilter : undefined,
//     page,
//     limit,
//   })

//   console.log(statistics);
//   console.log(data);
  

//   const { data: repairNeeded } = useRepairNeeded()
//   const { data: kmLimits } = useKmLimits()

//   const deleteMutation = useDeleteVagon()

//   const handleEdit = (item: Vagon) => {
//     setSelectedItem(item)
//     setDialogOpen(true)
//   }

//   const handleAdd = () => {
//     setSelectedItem(null)
//     setDialogOpen(true)
//   }

//   const handleDelete = async () => {
//     if (itemToDelete) {
//       try {
//         await deleteMutation.mutateAsync(itemToDelete.id)
//         setDeleteDialogOpen(false)
//         setItemToDelete(null)
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
//             Vagonlar
//           </h1>
//           <p className="text-gray-600 dark:text-gray-300 mt-1">
//             Barcha vagonlarni boshqaring va kuzatib boring
//           </p>
//         </div>
//         <Button onClick={handleAdd} className="gap-2">
//           <Plus className="h-4 w-4" />
//           Yangi vagon
//         </Button>
//       </motion.div>

//       {/* Statistics Cards */}
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
//                   {statistics?.total || 0}
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">Jami vagonlar</div>
//               </div>
//               <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//                 <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-2 hover:shadow-lg transition-all">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
//                   {statistics?.active || 0}
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">Faol vagonlar</div>
//               </div>
//               <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
//                 <Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-2 hover:shadow-lg transition-all">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
//                   {statistics?.repair || 0}
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">Ta'mirdagi</div>
//               </div>
//               <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
//                 <Wrench className="h-6 w-6 text-amber-600 dark:text-amber-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-2 hover:shadow-lg transition-all">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
//                   {(statistics?.totalKm || 0).toLocaleString()}
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">Jami masofa (km)</div>
//               </div>
//               <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
//                 <Gauge className="h-6 w-6 text-purple-600 dark:text-purple-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Warning Cards */}
//       {repairNeeded && repairNeeded.length > 0 && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.15 }}
//         >
//           <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
//             <CardContent className="p-4">
//               <div className="flex items-center gap-3">
//                 <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
//                 <div>
//                   <p className="font-medium text-amber-800 dark:text-amber-200">
//                     {repairNeeded.length} ta vagon uchun ta'mir talab qilinadi
//                   </p>
//                   <p className="text-sm text-amber-600 dark:text-amber-300">
//                     Muddat bo'yicha yoki km limitidan oshgan
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       )}

//       {/* Filters */}
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
//                   placeholder="Vagon raqami bo'yicha qidirish..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="pl-9"
//                 />
//               </div>
//               <div className="flex gap-3">
//                 <Select
//                   value={holatFilter}
//                   onValueChange={(value) => setHolatFilter(value as VagonHolati | 'all')}
//                 >
//                   <SelectTrigger className="w-[180px]">
//                     <Filter className="h-4 w-4 mr-2" />
//                     <SelectValue placeholder="Holati" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Barcha holatlar</SelectItem>
//                     {Object.values(VagonHolati).map((holat) => (
//                       <SelectItem key={holat} value={holat}>
//                         {holatLabels[holat]}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 <div className="flex gap-2 border-l pl-3">
//                   <Button
//                     variant={viewMode === 'list' ? 'default' : 'outline'}
//                     size="icon"
//                     onClick={() => setViewMode('list')}
//                     className="h-10 w-10"
//                     title="List ko'rinishi"
//                   >
//                     <List className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant={viewMode === 'matrix' ? 'default' : 'outline'}
//                     size="icon"
//                     onClick={() => setViewMode('matrix')}
//                     className="h-10 w-10"
//                     title="Matrix ko'rinishi"
//                   >
//                     <Grid className="h-4 w-4" />
//                   </Button>
//                 </div>

//                 <Button variant="outline" onClick={() => refetch()} className="gap-2">
//                   <RefreshCw className="h-4 w-4" />
//                   Yangilash
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Table/Matrix View */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.3 }}
//       >
//         <Card className="border-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Truck className="h-5 w-5 text-primary" />
//               Vagonlar ro'yxati
//               {viewMode === 'matrix' && (
//                 <Badge variant="secondary" className="ml-2">
//                   Matrix ko'rinishi
//                 </Badge>
//               )}
//             </CardTitle>
//             <CardDescription>
//               Jami {data?.total || 0} ta vagon
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <div className="space-y-4">
//                 {[...Array(5)].map((_, i) => (
//                   <Skeleton key={i} className="h-16 w-full" />
//                 ))}
//               </div>
//             ) : viewMode === 'list' ? (
//               <>
//                 {/* List View Table */}
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Raqami</TableHead>
//                       <TableHead>Vagon turi</TableHead>
//                       <TableHead>Holati</TableHead>
//                       <TableHead>Ishlab chiqarilgan</TableHead>
//                       <TableHead>Bosib o'tgan km</TableHead>
//                       <TableHead>Qo'shilgan</TableHead>
//                       <TableHead className="text-right">Amallar</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {data?.items?.map((item) => {
//                       const HolatIcon = holatIcons[item.holati]
//                       const kmLimit = kmLimits?.find(limit => limit.vagonRaqami === item.raqami)

//                       return (
//                         <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
//                           <TableCell className="font-medium">{item.raqami}</TableCell>
//                           <TableCell>
//                             <Badge variant="outline" className="font-mono">
//                               {item.vagonTuri?.kodli || 'Noma\'lum'}
//                             </Badge>
//                           </TableCell>
//                           <TableCell>
//                             <Badge className={holatColors[item.holati]}>
//                               <HolatIcon className="h-3 w-3 mr-1" />
//                               {holatLabels[item.holati]}
//                             </Badge>
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex items-center gap-2">
//                               <Calendar className="h-4 w-4 text-gray-400" />
//                               {format(new Date(item.ishlabChigarilganSana), 'dd.MM.yyyy')}
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <div className="space-y-1">
//                               <div className="flex items-center gap-1">
//                                 <Gauge className="h-4 w-4 text-gray-400" />
//                                 <span className="font-medium">{item.bosibOtganKm.toLocaleString()} km</span>
//                               </div>
//                               {kmLimit && kmLimit.foiz > 90 && (
//                                 <Progress value={kmLimit.foiz} className="h-1 w-24" />
//                               )}
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex items-center gap-2 text-sm">
//                               <Calendar className="h-4 w-4 text-gray-400" />
//                               {format(new Date(item.yaratilganVaqt), 'dd.MM.yyyy')}
//                             </div>
//                           </TableCell>
//                           <TableCell className="text-right">
//                             <DropdownMenu>
//                               <DropdownMenuTrigger asChild>
//                                 <Button variant="ghost" size="icon">
//                                   <MoreVertical className="h-4 w-4" />
//                                 </Button>
//                               </DropdownMenuTrigger>
//                               <DropdownMenuContent align="end">
//                                 <DropdownMenuLabel>Amallar</DropdownMenuLabel>
//                                 <DropdownMenuItem asChild>
//                                   <Link href={`/dashboard/vagons/${item.id}`}>
//                                     <Eye className="h-4 w-4 mr-2" />
//                                     Ko'rish
//                                   </Link>
//                                 </DropdownMenuItem>
//                                 <DropdownMenuItem onClick={() => handleEdit(item)}>
//                                   <Edit className="h-4 w-4 mr-2" />
//                                   Tahrirlash
//                                 </DropdownMenuItem>
//                                 <DropdownMenuSeparator />
//                                 <DropdownMenuItem
//                                   className="text-red-600 dark:text-red-400"
//                                   onClick={() => {
//                                     setItemToDelete({ id: item.id, nomi: item.raqami })
//                                     setDeleteDialogOpen(true)
//                                   }}
//                                 >
//                                   <Trash2 className="h-4 w-4 mr-2" />
//                                   O'chirish
//                                 </DropdownMenuItem>
//                               </DropdownMenuContent>
//                             </DropdownMenu>
//                           </TableCell>
//                         </TableRow>
//                       )
//                     })}

//                     {data?.items?.length === 0 && (
//                       <TableRow>
//                         <TableCell colSpan={7} className="text-center py-8">
//                           <div className="flex flex-col items-center gap-2">
//                             <AlertCircle className="h-8 w-8 text-gray-400" />
//                             <p className="text-gray-500 dark:text-gray-400">
//                               Hech qanday vagon topilmadi
//                             </p>
//                             <Button variant="outline" onClick={handleAdd}>
//                               <Plus className="h-4 w-4 mr-2" />
//                               Yangi qo'shish
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>

//                 {/* Pagination - List View */}
//                 {data && data.total > limit && (
//                   <div className="flex items-center justify-between mt-6">
//                     <div className="text-sm text-gray-500">
//                       {((page - 1) * limit) + 1} - {Math.min(page * limit, data.total)} / {data.total}
//                     </div>
//                     <div className="flex gap-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setPage(p => Math.max(1, p - 1))}
//                         disabled={page === 1}
//                       >
//                         Oldingi
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setPage(p => p + 1)}
//                         disabled={page * limit >= data.total}
//                       >
//                         Keyingi
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </>
//             ) : (
//               // Matrix View
//               <VagonMatrixView 
//                 vagonlar={data}
//                 tamirTurlari={tamirTurlari}
//                 kmLimits={kmLimits}
//                 onEdit={handleEdit}
//               />
//             )}
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Vagon Dialog */}
//       <VagonDialog
//         open={dialogOpen}
//         onOpenChange={setDialogOpen}
//         vagon={selectedItem}
//         onSuccess={() => {
//           setDialogOpen(false)
//           setSelectedItem(null)
//         }}
//       />

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Vagonni o'chirish</AlertDialogTitle>
//             <AlertDialogDescription>
//               {itemToDelete && (
//                 <span>
//                   <span className="font-bold">"{itemToDelete.nomi}"</span> vagonini o'chirishni tasdiqlaysizmi?
//                   <br />
//                   Bu amalni ortga qaytarib bo'lmaydi.
//                 </span>
//               )}
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDelete}
//               className="bg-red-600 hover:bg-red-700"
//             >
//               O'chirish
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   )
// }