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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useCreateVagonTuri, useUpdateVagonTuri } from '@/lib/hooks/useVagon'
import { Train } from 'lucide-react'
import { IstamirType } from '@/types/tamir'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const formSchema = z.object({
  nomi: z.string()
    .min(2, 'Nomi kamida 2 ta belgidan iborat bo\'lishi kerak')
    .max(100, 'Nomi 100 ta belgidan oshmasligi kerak'),
  kodli: z.string()
    .min(2, 'Kod kamida 2 ta belgidan iborat bo\'lishi kerak')
    .max(50, 'Kod 50 ta belgidan oshmasligi kerak')
    .regex(/^[A-Za-z0-9-_]+$/, 'Kod faqat harflar, raqamlar, tire va pastki chiziqdan iborat bo\'lishi mumkin'),
  tavsifi: z.string()
    .max(500, 'Tavsif 500 ta belgidan oshmasligi kerak')
    .optional(),
})

type FormValues = z.infer<typeof formSchema>

interface VagonTuriDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vagonTuri?: any
  onSuccess?: () => void
}

export function VagonTuriDialog({ open, onOpenChange, vagonTuri, onSuccess }: VagonTuriDialogProps) {
  const createMutation = useCreateVagonTuri()
  const updateMutation = useUpdateVagonTuri()
  const isEditing = !!vagonTuri

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomi: '',
      kodli: '',
      tavsifi: '',
    },
  })

  useEffect(() => {
    if (vagonTuri) {
      form.reset({
        nomi: vagonTuri.nomi || '',
        kodli: vagonTuri.kodli || '',
        tavsifi: vagonTuri.tavsifi || '',
      })
    } else {
      form.reset({
        nomi: '',
        kodli: '',
        tavsifi: '',
      })
    }
  }, [vagonTuri, form])

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: vagonTuri.id,
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
            <Train className="h-5 w-5 text-primary" />
            {isEditing ? 'Vagon turini tahrirlash' : 'Yangi vagon turi qo\'shish'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Vagon turi ma\'lumotlarini yangilang'
              : 'Yangi vagon turi ma\'lumotlarini kiriting'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nomi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomi *</FormLabel>
                  <FormControl>
                    <Input placeholder="Yuk vagoni" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kodli"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kodi *</FormLabel>
                  <FormControl>
                    <Input placeholder="YUK-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tavsifi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tavsifi</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Vagon turi haqida qisqacha ma'lumot"
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