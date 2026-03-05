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
import { useCreateTashkilot, useUpdateTashkilot } from '@/lib/hooks/useTashkilot'
import { Building2 } from 'lucide-react'

const formSchema = z.object({
  nomi: z.string()
    .min(2, 'Nomi kamida 2 ta belgidan iborat bo\'lishi kerak')
    .max(200, 'Nomi 200 ta belgidan oshmasligi kerak'),
  kod: z.string()
    .min(2, 'Kod kamida 2 ta belgidan iborat bo\'lishi kerak')
    .max(50, 'Kod 50 ta belgidan oshmasligi kerak')
    .regex(/^[A-Za-z0-9-_]+$/, 'Kod faqat harflar, raqamlar, tire va pastki chiziqdan iborat bo\'lishi mumkin'),
  description: z.string()
    .max(500, 'Tavsif 500 ta belgidan oshmasligi kerak')
    .optional(),
  telefon: z.string()
    .regex(/^\+998\d{9}$/, 'Telefon raqam +998901234567 formatida bo\'lishi kerak')
    .optional()
    .or(z.literal('')),
  manzil: z.string()
    .max(500, 'Manzil 500 ta belgidan oshmasligi kerak')
    .optional(),
})

type FormValues = z.infer<typeof formSchema>

interface TashkilotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tashkilot?: any
  onSuccess?: () => void
}

export function TashkilotDialog({ open, onOpenChange, tashkilot, onSuccess }: TashkilotDialogProps) {
  const createMutation = useCreateTashkilot()
  const updateMutation = useUpdateTashkilot()
  const isEditing = !!tashkilot

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomi: '',
      kod: '',
      description: '',
      telefon: '',
      manzil: '',
    },
  })

  useEffect(() => {
    if (tashkilot) {
      form.reset({
        nomi: tashkilot.nomi || '',
        kod: tashkilot.kod || '',
        description: tashkilot.description || '',
        telefon: tashkilot.telefon || '',
        manzil: tashkilot.manzil || '',
      })
    } else {
      form.reset({
        nomi: '',
        kod: '',
        description: '',
        telefon: '',
        manzil: '',
      })
    }
  }, [tashkilot, form])

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: tashkilot.id,
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {isEditing ? 'Tashkilotni tahrirlash' : 'Yangi tashkilot qo\'shish'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Tashkilot ma\'lumotlarini yangilang'
              : 'Yangi tashkilot ma\'lumotlarini kiriting'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nomi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomi *</FormLabel>
                    <FormControl>
                      <Input placeholder="Tashkilot nomi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kod *</FormLabel>
                    <FormControl>
                      <Input placeholder="TRZ-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tavsifi</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tashkilot haqida qisqacha ma'lumot"
                      className="resize-none"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="telefon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+998901234567" 
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manzil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manzil</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Toshkent, Yangi yo'l ko'chasi, 15" 
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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