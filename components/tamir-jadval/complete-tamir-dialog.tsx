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
import { useCompleteTamir } from '@/lib/hooks/useTamirJadval'
import { CheckCircle2, DollarSign } from 'lucide-react'

const formSchema = z.object({
  tamirQiymati: z.number()
    .min(0, 'Qiymat manfiy bo\'lishi mumkin emas')
    .max(999999999.99, 'Qiymat juda katta'),
  izoh: z.string()
    .max(500, 'Izoh 500 ta belgidan oshmasligi kerak')
    .optional()
    .nullable(),
})

type FormValues = z.infer<typeof formSchema>

interface CompleteTamirDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tamirJadval?: any
  onSuccess?: () => void
}

export function CompleteTamirDialog({ open, onOpenChange, tamirJadval, onSuccess }: CompleteTamirDialogProps) {
  const completeMutation = useCompleteTamir()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tamirQiymati: undefined,
      izoh: '',
    },
  })

  useEffect(() => {
    if (tamirJadval) {
      form.reset({
        tamirQiymati: tamirJadval.tamirQiymati || undefined,
        izoh: tamirJadval.izoh || '',
      })
    } else {
      form.reset({
        tamirQiymati: undefined,
        izoh: '',
      })
    }
  }, [tamirJadval, form])

  const onSubmit = async (values: FormValues) => {
    try {
      await completeMutation.mutateAsync({
        id: tamirJadval.id,
        tamirQiymati: values.tamirQiymati,
        izoh: values.izoh || undefined,
      })
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
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            Tamirni tugallash
          </DialogTitle>
          <DialogDescription>
            {tamirJadval && (
              <span>
                <span className="font-bold">{tamirJadval.vagon?.raqami}</span> - {tamirJadval.tamirTuri?.nomi}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tamirQiymati"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tamir qiymati *</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="1500000.00"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                        value={field.value || ''}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="izoh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Izoh</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tamir haqida qo'shimcha ma'lumot"
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
                disabled={completeMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {completeMutation.isPending ? 'Tugallanmoqda...' : 'Tamirni tugallash'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}