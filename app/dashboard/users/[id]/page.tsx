"use client"

import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Shield,
  Clock,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Activity,
  FileText,
  MessageSquare,
  BookOpen,
} from 'lucide-react'
import { UserStatus } from '@/types/user'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { useDeleteUser, useUpdateUserStatus, useUser } from '@/lib/hooks/useUsers'

const statusColors = {
  [UserStatus.ACTIVE]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  [UserStatus.INACTIVE]: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  [UserStatus.BLOCKED]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  [UserStatus.PENDING]: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
}

const roleColors = {
  admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  manager: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  glav_ingeener: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  mechanic: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  user: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  guest: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
}

// Mock data for user activities
const userActivities = [
  {
    id: 1,
    type: 'login',
    description: 'Tizimga kirdi',
    date: '2024-01-15T09:30:00',
    ip: '192.168.1.100',
  },
  {
    id: 2,
    type: 'update',
    description: 'Profil ma\'lumotlarini yangiladi',
    date: '2024-01-14T15:45:00',
  },
  {
    id: 3,
    type: 'password_change',
    description: 'Parolni o\'zgartirdi',
    date: '2024-01-10T11:20:00',
  },
]

// Mock data for user documents
const userDocuments = [
  {
    id: 1,
    name: 'Shaxsiy guvohnoma',
    type: 'pdf',
    size: '2.5 MB',
    uploadedAt: '2024-01-10',
  },
  {
    id: 2,
    name: 'Diplom',
    type: 'pdf',
    size: '1.8 MB',
    uploadedAt: '2024-01-05',
  },
]

// Mock data for user messages
const userMessages = [
  {
    id: 1,
    subject: 'Dars jadvali haqida',
    date: '2024-01-15T10:30:00',
    status: 'read',
  },
  {
    id: 2,
    subject: 'Yangi materiallar',
    date: '2024-01-14T14:20:00',
    status: 'unread',
  },
]

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const { data: user, isLoading } = useUser(userId)
  const updateStatusMutation = useUpdateUserStatus()
  const deleteUserMutation = useDeleteUser()

  const handleStatusChange = async (newStatus: UserStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: userId, status: newStatus })
    } catch (error) {
      console.error('Status o\'zgartirishda xatolik:', error)
    }
  }

  const handleDeleteUser = async () => {
    if (window.confirm(`${user?.fullName} foydalanuvchini o'chirishni tasdiqlaysizmi?`)) {
      try {
        await deleteUserMutation.mutateAsync(userId)
        router.push('/dashboard/users')
      } catch (error) {
        console.error('Foydalanuvchini o\'chirishda xatolik:', error)
      }
    }
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return 'U'
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Foydalanuvchi topilmadi
        </h2>
        <Button className="mt-4" onClick={() => router.back()}>
          Orqaga qaytish
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Foydalanuvchi profili
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Foydalanuvchi haqidagi batafsil ma'lumotlar
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/users/${userId}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Tahrirlash
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDeleteUser}>
            <Trash2 className="h-4 w-4 mr-2" />
            O'chirish
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 border-4 border-primary/20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>

                <h2 className="text-2xl font-bold mt-4">{user.fullName}</h2>
                <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>

                <div className="flex gap-2 mt-4">
                  <Badge className={roleColors[user.role]}>
                    <Shield className="h-3 w-3 mr-1" />
                    {user.role}
                  </Badge>
                  <Badge className={statusColors[user.status]}>
                    {user.status === UserStatus.ACTIVE && <UserCheck className="h-3 w-3 mr-1" />}
                    {user.status === UserStatus.INACTIVE && <UserX className="h-3 w-3 mr-1" />}
                    {user.status === UserStatus.BLOCKED && <UserX className="h-3 w-3 mr-1" />}
                    {user.status === UserStatus.PENDING && <Clock className="h-3 w-3 mr-1" />}
                    {user.status}
                  </Badge>
                </div>

                <div className="w-full mt-6 space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div className="text-left">
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{user.email}</div>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div className="text-left">
                        <div className="text-sm text-gray-500">Telefon</div>
                        <div className="font-medium">{user.phone}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <User className="h-5 w-5 text-gray-400" />
                    <div className="text-left">
                      <div className="text-sm text-gray-500">JSHSHIR</div>
                      <div className="font-medium font-mono">{user.jshshir}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div className="text-left">
                      <div className="text-sm text-gray-500">Qo'shilgan sana</div>
                      <div className="font-medium">
                        {format(new Date(user.createdAt), 'dd MMMM yyyy', { locale: uz })}
                      </div>
                    </div>
                  </div>

                  {user.lastLoginAt && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div className="text-left">
                        <div className="text-sm text-gray-500">Oxirgi kirish</div>
                        <div className="font-medium">
                          {format(new Date(user.lastLoginAt), 'dd MMM yyyy HH:mm', { locale: uz })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full mt-6">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <span className="text-sm text-gray-500">Email tasdiqlangan</span>
                    <Badge variant={user.isEmailVerified ? "default" : "secondary"}>
                      {user.isEmailVerified ? 'Ha' : 'Yo\'q'}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 mt-6 w-full">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleStatusChange(UserStatus.ACTIVE)}
                    disabled={user.status === UserStatus.ACTIVE}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Faollashtirish
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleStatusChange(UserStatus.BLOCKED)}
                    disabled={user.status === UserStatus.BLOCKED}
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Bloklash
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column - Tabs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Faoliyat va ma'lumotlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="activities" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="activities" className="gap-2">
                    <Clock className="h-4 w-4" />
                    Faoliyat
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Hujjatlar
                  </TabsTrigger>
                  <TabsTrigger value="messages" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Xabarlar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="activities" className="space-y-4">
                  {userActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{activity.description}</div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(activity.date), 'dd MMM yyyy HH:mm', { locale: uz })}
                        </div>
                        {activity.ip && (
                          <div className="text-xs text-gray-400 mt-1">IP: {activity.ip}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  {userDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                        <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-gray-500">
                          {doc.type.toUpperCase()} • {doc.size}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Yuklangan: {format(new Date(doc.uploadedAt), 'dd MMM yyyy', { locale: uz })}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <BookOpen className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="messages" className="space-y-4">
                  {userMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className={`p-2 rounded-lg ${
                        msg.status === 'unread' 
                          ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <MessageSquare className={`h-4 w-4 ${
                          msg.status === 'unread'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{msg.subject}</div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(msg.date), 'dd MMM yyyy HH:mm', { locale: uz })}
                        </div>
                      </div>
                      <Badge variant={msg.status === 'unread' ? "default" : "secondary"}>
                        {msg.status === 'unread' ? 'Yangi' : 'O\'qilgan'}
                      </Badge>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}