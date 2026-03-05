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
import { useCreateUser, useUpdateUser } from '@/lib/hooks/useUsers'
import { UserRole, UserStatus } from '@/types/user'
import { UserPlus } from 'lucide-react'

const formSchema = z.object({
  email: z.string()
    .email('Noto\'g\'ri email formatı')
    .optional(),
  username: z.string()
    .min(3, 'Username kamida 3 ta belgidan iborat bo\'lishi kerak')
    .max(50, 'Username 50 ta belgidan oshmasligi kerak'),
  jshshir: z.string()
    .min(14, 'JSHSHIR 14 ta belgidan iborat bo\'lishi kerak')
    .max(14, 'JSHSHIR 14 ta belgidan iborat bo\'lishi kerak')
    .regex(/^\d+$/, 'JSHSHIR faqat raqamlardan iborat bo\'lishi kerak'),
  firstName: z.string()
    .min(2, 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak')
    .max(50, 'Ism 50 ta belgidan oshmasligi kerak'),
  lastName: z.string()
    .min(2, 'Familiya kamida 2 ta belgidan iborat bo\'lishi kerak')
    .max(50, 'Familiya 50 ta belgidan oshmasligi kerak'),
  password: z.string()
    .min(6, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak')
    .optional(),
  phone: z.string()
    .regex(/^\+998\d{9}$/, 'Telefon raqam +998901234567 formatida bo\'lishi kerak')
    .optional(),
  role: z.nativeEnum(UserRole, {
    error: 'Rolni tanlang',
  }),
  status: z.nativeEnum(UserStatus)
    .optional()
})

type FormValues = z.infer<typeof formSchema>

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: any
  onSuccess?: () => void
}

export function UserDialog({ open, onOpenChange, user, onSuccess }: UserDialogProps) {
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const isEditing = !!user

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      username: '',
      jshshir: '',
      firstName: '',
      lastName: '',
      password: '',
      phone: '',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email || '',
        username: user.username,
        jshshir: user.jshshir,
        firstName: user.firstName,
        lastName: user.lastName,
        password: '',
        phone: user.phone || '',
        role: user.role,
        status: user.status,
      })
    } else {
      form.reset({
        email: '',
        username: '',
        jshshir: '',
        firstName: '',
        lastName: '',
        password: '',
        phone: '',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
      })
    }
  }, [user, form])

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing) {
        // Remove password if empty
        const updateData = { ...values }
        if (!updateData.password) {
          delete updateData.password
        }
        await updateMutation.mutateAsync({
          id: user.id,
          data: updateData,
        })
      } else {
        await createMutation.mutateAsync(values as any)
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
            <UserPlus className="h-5 w-5 text-primary" />
            {isEditing ? 'Foydalanuvchini tahrirlash' : 'Yangi foydalanuvchi qo\'shish'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Foydalanuvchi ma\'lumotlarini yangilang'
              : 'Yangi foydalanuvchi ma\'lumotlarini kiriting'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ism *</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Familiya *</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username *</FormLabel>
                    <FormControl>
                      <Input placeholder="john_doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jshshir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>JSHSHIR *</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890123456" maxLength={14} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" type="email" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <Input placeholder="+998901234567" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEditing ? 'Yangi parol (agar o\'zgartirmoqchi bo\'lsangiz)' : 'Parol *'}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Rolni tanlang" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(UserRole).map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Statusni tanlang" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(UserStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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