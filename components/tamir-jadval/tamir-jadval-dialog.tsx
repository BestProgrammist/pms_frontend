"use client"

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useVagonlar } from '@/lib/hooks/useVagon'
import { useTamirTuriDropdown } from '@/lib/hooks/useTamir'
import { useTashkilotDropdown } from '@/lib/hooks/useTashkilot'
import { useVagonTamirMuddatlari } from '@/lib/hooks/useTamir'
import { useCreateTamirJadval, useUpdateTamirJadval } from '@/lib/hooks/useTamirJadval'
import { TamirHolati } from '@/types/tamir-jadval'
import { Calendar, Wrench } from 'lucide-react'
import { useAuth } from '../providers/AuthProvider'

const formSchema = z.object({
  vagonId: z.number({
    error: 'Vagonni tanlang',
  }),
  tamirTuriId: z.number({
    error: 'Ta\'mir turini tanlang',
  }),
  vagonTamirMuddatiId: z.number({
    error: 'Muddatni tanlang',
  }),
  tashkilotId: z.number({
    error: 'Tashkilotni tanlang',
  }),
  rejalashtirilganSana: z.string({
    error: 'Rejalashtirilgan sanani kiriting',
  }),
  holati: z.nativeEnum(TamirHolati, {
    error: 'Holatni tanlang',
  }),
  tamirQiymati: z.number()
    .optional(),
  izoh: z.string()
    .max(500, 'Izoh 500 ta belgidan oshmasligi kerak')
    .optional(),
})

type FormValues = z.infer<typeof formSchema>

interface TamirJadvalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tamirJadval?: any
  onSuccess?: () => void
}

export function TamirJadvalDialog({ open, onOpenChange, tamirJadval, onSuccess }: TamirJadvalDialogProps) {
  const { user } = useAuth()
  const { data: vagonlar } = useVagonlar({ limit: 100 })
  const { data: tamirTurlari } = useTamirTuriDropdown()
  const { data: tashkilotlar } = useTashkilotDropdown()
  const [selectedVagonTuriId, setSelectedVagonTuriId] = useState<number | undefined>()
  const { data: muddatlar } = useVagonTamirMuddatlari(
    selectedVagonTuriId ? { vagonTuriId: selectedVagonTuriId } : undefined
  )

  const createMutation = useCreateTamirJadval()
  const updateMutation = useUpdateTamirJadval()
  const isEditing = !!tamirJadval

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vagonId: undefined,
      tamirTuriId: undefined,
      vagonTamirMuddatiId: undefined,
      tashkilotId: undefined,
      rejalashtirilganSana: '',
      holati: TamirHolati.REJALASHTIRILGAN,
      tamirQiymati: undefined,
      izoh: '',
    },
  })

  useEffect(() => {
    if (tamirJadval) {
      form.reset({
        vagonId: tamirJadval.vagonId,
        tamirTuriId: tamirJadval.tamirTuriId,
        vagonTamirMuddatiId: tamirJadval.vagonTamirMuddatiId,
        tashkilotId: tamirJadval.tashkilotId,
        rejalashtirilganSana: tamirJadval.rejalashtirilganSana.split('T')[0],
        holati: tamirJadval.holati,
        tamirQiymati: tamirJadval.tamirQiymati,
        izoh: tamirJadval.izoh || '',
      })
    } else {
      form.reset({
        vagonId: undefined,
        tamirTuriId: undefined,
        vagonTamirMuddatiId: undefined,
        tashkilotId: undefined,
        rejalashtirilganSana: '',
        holati: TamirHolati.REJALASHTIRILGAN,
        tamirQiymati: undefined,
        izoh: '',
      })
    }
  }, [tamirJadval, form])

  // When vagon changes, get its turi and update muddatlar
  const handleVagonChange = (vagonId: number) => {
    const selectedVagon = vagonlar?.items.find(v => v.id === vagonId)
    if (selectedVagon) {
      setSelectedVagonTuriId(selectedVagon.vagonTuriId)
    }
  }

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: tamirJadval.id,
          data: values,
        })
      } else {
        await createMutation.mutateAsync(values)
      }
      onSuccess?.()
    } catch (error) {
      console.error('Form submit error:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            {isEditing ? 'Tamir jadvalini tahrirlash' : 'Yangi tamir jadvali qo\'shish'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Tamir jadvali ma\'lumotlarini yangilang'
              : 'Yangi tamir jadvali ma\'lumotlarini kiriting'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="vagonId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vagon *</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(parseInt(value))
                      handleVagonChange(parseInt(value))
                    }}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Vagonni tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vagonlar?.items?.map((vagon) => (
                        <SelectItem key={vagon.id} value={vagon.id.toString()}>
                          {vagon.raqami} ({vagon.vagonTuri?.nomi})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tamirTuriId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ta'mir turi *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Ta'mir turini tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tamirTurlari?.map((tur) => (
                        <SelectItem key={tur.id} value={tur.id.toString()}>
                          {tur.nomi} ({tur.kodi})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vagonTamirMuddatiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Muddat *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                    disabled={!selectedVagonTuriId && !isEditing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Muddatni tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {muddatlar?.items.map((muddat) => (
                        <SelectItem key={muddat.id} value={muddat.id.toString()}>
                          {muddat.tamirTuri?.nomi} - {muddat.muddatOy} oy / {muddat.maksimalKm.toLocaleString()} km
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tashkilotId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tashkilot *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Tashkilotni tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tashkilotlar?.map((tashkilot) => (
                        <SelectItem key={tashkilot.id} value={tashkilot.id.toString()}>
                          {tashkilot.nomi} ({tashkilot.kod})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rejalashtirilganSana"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rejalashtirilgan sana *</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <Input type="date" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="holati"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Holat *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Holatni tanlang" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={TamirHolati.REJALASHTIRILGAN}>Rejalashtirilgan</SelectItem>
                        <SelectItem value={TamirHolati.JARAYONDA}>Jarayonda</SelectItem>
                        <SelectItem value={TamirHolati.TUGALLANGAN}>Tugallangan</SelectItem>
                        <SelectItem value={TamirHolati.BEKOR_QILINGAN}>Bekor qilingan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="izoh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Izoh</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Qo'shimcha ma'lumot"
                      className="resize-none"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Bekor qilish
              </Button>
              <Button 
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Saqlanmoqda...'
                  : isEditing ? 'Saqlash' : 'Qo\'shish'
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}