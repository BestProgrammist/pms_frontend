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
import { useCreateTamirTuri, useUpdateTamirTuri } from '@/lib/hooks/useTamir'
import { Wrench } from 'lucide-react'
import { TamirTuri } from '@/types/tamir'

const formSchema = z.object({
  nomi: z.string()
    .min(2, 'Nomi kamida 2 ta belgidan iborat bo\'lishi kerak')
    .max(200, 'Nomi 200 ta belgidan oshmasligi kerak'),
  kodi: z.string()
    .min(2, 'Kod kamida 2 ta belgidan iborat bo\'lishi kerak')
    .max(50, 'Kod 50 ta belgidan oshmasligi kerak')
    .regex(/^[A-Za-z0-9-_]+$/, 'Kod faqat harflar, raqamlar, tire va pastki chiziqdan iborat bo\'lishi mumkin'),
  tavsifi: z.string()
    .max(500, 'Tavsif 500 ta belgidan oshmasligi kerak')
    .optional(),
})

type FormValues = z.infer<typeof formSchema>

interface TamirTuriDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tamirTuri?: TamirTuri
  onSuccess?: () => void
}

export function TamirTuriDialog({ open, onOpenChange, tamirTuri, onSuccess }: TamirTuriDialogProps) {
  const createMutation = useCreateTamirTuri()
  const updateMutation = useUpdateTamirTuri()
  const isEditing = !!tamirTuri

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomi: '',
      kodi: '',
      tavsifi: '',
    },
  })

  useEffect(() => {
    if (tamirTuri) {
      form.reset({
        nomi: tamirTuri.nomi || '',
        kodi: tamirTuri.kodi || '',
        tavsifi: tamirTuri.tavsifi || '',
      })
    } else {
      form.reset({
        nomi: '',
        kodi: '',
        tavsifi: '',
      })
    }
  }, [tamirTuri, form])

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: tamirTuri.id,
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
            <Wrench className="h-5 w-5 text-primary" />
            {isEditing ? 'Ta\'mir turini tahrirlash' : 'Yangi ta\'mir turi qo\'shish'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Ta\'mir turi ma\'lumotlarini yangilang'
              : 'Yangi ta\'mir turi ma\'lumotlarini kiriting'
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
                    <Input placeholder="Kapital ta'mirlash" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kodi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kodi *</FormLabel>
                  <FormControl>
                    <Input placeholder="KAP-001" {...field} />
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
                      placeholder="Ta'mir turi haqida qisqacha ma'lumot"
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