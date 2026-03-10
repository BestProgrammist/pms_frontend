"use client"

import { useEffect } from 'react'
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
import { Button } from '@/components/ui/button'
import { useVagonTurlari } from '@/lib/hooks/useVagon'
import { useCreateVagon, useUpdateVagon } from '@/lib/hooks/useVagon'
import { VagonHolati } from '@/types/vagon'
import { Truck } from 'lucide-react'

const formSchema = z.object({
  raqami: z.string()
    .min(3, 'Vagon raqami kamida 3 ta belgidan iborat bo\'lishi kerak')
    .max(50, 'Vagon raqami 50 ta belgidan oshmasligi kerak'),
  vagonTuriId: z.number({
    error: 'Vagon turini tanlang',
  }),
  ishlabChigarilganSana: z.string({
    error: 'Ishlab chiqarilgan sanani kiriting',
  }),
  bosibOtganKm: z.number()
  .optional(),
  holati: z.nativeEnum(VagonHolati, {
    error: 'Holatni tanlang',
  }),
})

type FormValues = z.infer<typeof formSchema>

interface VagonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vagon?: any
  onSuccess?: () => void
}

export function VagonDialog({ open, onOpenChange, vagon, onSuccess }: VagonDialogProps) {
  const { data: vagonTurlari } = useVagonTurlari({ limit: 100 })
  const createMutation = useCreateVagon()
  const updateMutation = useUpdateVagon()
  const isEditing = !!vagon

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      raqami: '',
      vagonTuriId: undefined,
      ishlabChigarilganSana: '',
      bosibOtganKm: undefined,
      holati: VagonHolati.ACTIVE,
    },
  })

  useEffect(() => {
    if (vagon) {
      form.reset({
        raqami: vagon.raqami,
        vagonTuriId: vagon.vagonTuriId,
        ishlabChigarilganSana: vagon.ishlabChigarilganSana.split('T')[0],
        bosibOtganKm: vagon.bosibOtganKm,
        holati: vagon.holati,
      })
    } else {
      form.reset({
        raqami: '',
        vagonTuriId: undefined,
        ishlabChigarilganSana: '',
        bosibOtganKm: 0,
        holati: VagonHolati.ACTIVE,
      })
    }
  }, [vagon, form])

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: vagon.id,
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            {isEditing ? 'Vagonni tahrirlash' : 'Yangi vagon qo\'shish'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Vagon ma\'lumotlarini yangilang'
              : 'Yangi vagon ma\'lumotlarini kiriting'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="raqami"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vagon raqami *</FormLabel>
                  <FormControl>
                    <Input placeholder="VGN-12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vagonTuriId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vagon turi *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Vagon turini tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vagonTurlari?.items?.map((tur) => (
                        <SelectItem key={tur.id} value={tur.id.toString()}>
                          {tur.nomi} ({tur.kodli})
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
                name="ishlabChigarilganSana"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ishlab chiqarilgan sana *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bosibOtganKm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bosib o'tgan km</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="15000"
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="holati"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Holati *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Holatni tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={VagonHolati.ACTIVE}>Faol</SelectItem>
                      <SelectItem value={VagonHolati.REPAIR}>Ta'mirda</SelectItem>
                      <SelectItem value={VagonHolati.BROKEN}>Buzuq</SelectItem>
                      <SelectItem value={VagonHolati.DECOMMISSIONED}>Foydalanilmaydi</SelectItem>
                    </SelectContent>
                  </Select>
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