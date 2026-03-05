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
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useVagonTurlari } from '@/lib/hooks/useVagon'
import { useTamirTuriDropdown } from '@/lib/hooks/useTamir'
import { useCreateVagonTamirMuddati, useUpdateVagonTamirMuddati } from '@/lib/hooks/useTamir'
import { Clock } from 'lucide-react'

const formSchema = z.object({
  vagonTuriId: z.number({
    error: 'Vagon turini tanlang',
  }),
  tamirTuriId: z.number({
    error: 'Ta\'mir turini tanlang',
  }),
  muddatOy: z.number()
    .min(1, 'Muddat kamida 1 oy bo\'lishi kerak')
    .max(120, 'Muddat 120 oydan oshmasligi kerak'),
  maksimalKm: z.number()
    .min(0, 'Maksimal km manfiy bo\'lishi mumkin emas')
    .max(1000000, 'Maksimal km 1,000,000 dan oshmasligi kerak'),
  izoh: z.string()
    .max(500, 'Izoh 500 ta belgidan oshmasligi kerak')
    .optional(),
})

type FormValues = z.infer<typeof formSchema>

interface VagonTamirMuddatiDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  muddat?: any
  onSuccess?: () => void
}

export function VagonTamirMuddatiDialog({ open, onOpenChange, muddat, onSuccess }: VagonTamirMuddatiDialogProps) {
  const { data: vagonTurlari } = useVagonTurlari({ limit: 100 })
  const { data: tamirTurlari } = useTamirTuriDropdown()
  const createMutation = useCreateVagonTamirMuddati()
  const updateMutation = useUpdateVagonTamirMuddati()
  const isEditing = !!muddat

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vagonTuriId: undefined,
      tamirTuriId: undefined,
      muddatOy: undefined,
      maksimalKm: undefined,
      izoh: '',
    },
  })

  useEffect(() => {
    if (muddat) {
      form.reset({
        vagonTuriId: muddat.vagonTuriId,
        tamirTuriId: muddat.tamirTuriId,
        muddatOy: muddat.muddatOy,
        maksimalKm: muddat.maksimalKm,
        izoh: muddat.izoh || '',
      })
    } else {
      form.reset({
        vagonTuriId: undefined,
        tamirTuriId: undefined,
        muddatOy: undefined,
        maksimalKm: undefined,
        izoh: '',
      })
    }
  }, [muddat, form])

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: muddat.id,
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
            <Clock className="h-5 w-5 text-primary" />
            {isEditing ? 'Muddatni tahrirlash' : 'Yangi muddat qo\'shish'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Vagon ta\'mir muddati ma\'lumotlarini yangilang'
              : 'Yangi vagon ta\'mir muddati ma\'lumotlarini kiriting'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="muddatOy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Muddat (oy) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="12"
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maksimalKm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maksimal km *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="50000"
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