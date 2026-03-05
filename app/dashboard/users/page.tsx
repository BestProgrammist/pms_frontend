"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Clock,
  Shield,
  Mail,
  Phone,
  Calendar,
  RefreshCw,
} from 'lucide-react'
import { useUsers, useUpdateUserStatus, useDeleteUser } from '@/lib/hooks/useUsers'
import { UserRole, UserStatus } from '@/types/user'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import { UserDialog } from '@/components/users/user-dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

const roleColors = {
  [UserRole.ADMIN]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  [UserRole.MANAGER]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  [UserRole.GLAV_INGEENER]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  [UserRole.MECHANIC]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  [UserRole.USER]: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  [UserRole.GUEST]: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
}

const statusColors = {
  [UserStatus.ACTIVE]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  [UserStatus.INACTIVE]: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  [UserStatus.BLOCKED]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  [UserStatus.PENDING]: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
}

const statusIcons = {
  [UserStatus.ACTIVE]: UserCheck,
  [UserStatus.INACTIVE]: UserX,
  [UserStatus.BLOCKED]: UserX,
  [UserStatus.PENDING]: Clock,
}

export default function UsersPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null)
  const limit = 10

  const { data, isLoading, refetch } = useUsers({
    search: search || undefined,
    role: roleFilter !== 'all' ? roleFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    page,
    limit,
  })

  const updateStatusMutation = useUpdateUserStatus()
  const deleteUserMutation = useDeleteUser()

  const handleStatusChange = async (userId: string, newStatus: UserStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: userId, status: newStatus })
    } catch (error) {
      console.error('Status o\'zgartirishda xatolik:', error)
    }
  }

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await deleteUserMutation.mutateAsync(userToDelete.id)
        setDeleteDialogOpen(false)
        setUserToDelete(null)
      } catch (error) {
        console.error('Foydalanuvchini o\'chirishda xatolik:', error)
      }
    }
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setDialogOpen(true)
  }

  const handleAddUser = () => {
    setSelectedUser(null)
    setDialogOpen(true)
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
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
            Foydalanuvchilar
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Tizimdagi barcha foydalanuvchilarni boshqaring
          </p>
        </div>
        <Button onClick={handleAddUser} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Yangi foydalanuvchi
        </Button>
      </motion.div>

      {/* Stats Cards */}
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
                  {data?.total || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Jami foydalanuvchilar</div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {data?.users?.filter(u => u.status === UserStatus.ACTIVE).length || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Faol</div>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <UserCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {data?.users?.filter(u => u.role === UserRole.ADMIN).length || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Adminlar</div>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Shield className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {data?.users?.filter(u => u.status === UserStatus.PENDING).length || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Kutilmoqda</div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

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
                  placeholder="Foydalanuvchi qidirish..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-3">
                <Select
                  value={roleFilter}
                  onValueChange={(value) => setRoleFilter(value as UserRole | 'all')}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Rol bo'yicha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha rollar</SelectItem>
                    {Object.values(UserRole).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as UserStatus | 'all')}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status bo'yicha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha statuslar</SelectItem>
                    {Object.values(UserStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={() => refetch()} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Yangilash
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Foydalanuvchilar ro'yxati
            </CardTitle>
            <CardDescription>
              Jami {data?.total || 0} ta foydalanuvchi
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Foydalanuvchi</TableHead>
                    <TableHead>Kontakt</TableHead>
                    <TableHead>JSHSHIR</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Oxirgi kirish</TableHead>
                    <TableHead className="text-right">Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.users?.map((user) => {
                    const StatusIcon = statusIcons[user.status]
                    return (
                      <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {getInitials(user.firstName, user.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.fullName}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span>{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span>{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {user.jshshir}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge className={roleColors[user.role]}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[user.status]}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.lastLoginAt ? (
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span>
                                {format(new Date(user.lastLoginAt), 'dd MMM yyyy', { locale: uz })}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Kirilmagan</span>
                          )}
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
                                <Link href={`/dashboard/users/${user.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ko'rish
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Tahrirlash
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Status</DropdownMenuLabel>
                              {Object.values(UserStatus).map((status) => (
                                <DropdownMenuItem
                                  key={status}
                                  onClick={() => handleStatusChange(user.id, status)}
                                  disabled={user.status === status}
                                >
                                  {status === UserStatus.ACTIVE && <UserCheck className="h-4 w-4 mr-2" />}
                                  {status === UserStatus.INACTIVE && <UserX className="h-4 w-4 mr-2" />}
                                  {status === UserStatus.BLOCKED && <UserX className="h-4 w-4 mr-2" />}
                                  {status === UserStatus.PENDING && <Clock className="h-4 w-4 mr-2" />}
                                  {status}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 dark:text-red-400"
                                onClick={() => {
                                  setUserToDelete({ id: user.id, name: user.fullName })
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
                </TableBody>
              </Table>
            )}

            {/* Pagination */}
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
          </CardContent>
        </Card>
      </motion.div>

      {/* User Dialog for Create/Edit */}
      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
        onSuccess={() => {
          setDialogOpen(false)
          setSelectedUser(null)
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Foydalanuvchini o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              {userToDelete && (
                <span>
                  <span className="font-bold">"{userToDelete.name}"</span> foydalanuvchini o'chirishni tasdiqlaysizmi?
                  <br />
                  Bu amalni ortga qaytarib bo'lmaydi.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
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
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
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
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import {
//   Users,
//   Search,
//   Filter,
//   MoreVertical,
//   UserPlus,
//   Edit,
//   Trash2,
//   Eye,
//   UserCheck,
//   UserX,
//   Clock,
//   Shield,
//   Mail,
//   Phone,
//   Calendar,
//   RefreshCw,
// } from 'lucide-react'
// import { useUsers, useUpdateUserStatus, useDeleteUser } from '@/lib/hooks/useUsers'
// import { UserRole, UserStatus } from '@/types/user'
// import { Skeleton } from '@/components/ui/skeleton'
// import { format } from 'date-fns'
// import { uz } from 'date-fns/locale'
// import { toast } from 'sonner'

// const roleColors = {
//   [UserRole.ADMIN]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
//   [UserRole.MANAGER]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
//   [UserRole.GLAV_INGEENER]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
//   [UserRole.MECHANIC]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
//   [UserRole.USER]: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
//   [UserRole.GUEST]: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
// }

// const statusColors = {
//   [UserStatus.ACTIVE]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
//   [UserStatus.INACTIVE]: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
//   [UserStatus.BLOCKED]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
//   [UserStatus.PENDING]: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
// }

// const statusIcons = {
//   [UserStatus.ACTIVE]: UserCheck,
//   [UserStatus.INACTIVE]: UserX,
//   [UserStatus.BLOCKED]: UserX,
//   [UserStatus.PENDING]: Clock,
// }

// export default function UsersPage() {
//   const router = useRouter()
//   const [search, setSearch] = useState('')
//   const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
//   const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all')
//   const [page, setPage] = useState(1)
//   const limit = 10

//   const { data, isLoading, refetch } = useUsers({
//     search: search || undefined,
//     role: roleFilter !== 'all' ? roleFilter : undefined,
//     status: statusFilter !== 'all' ? statusFilter : undefined,
//     page,
//     limit,
//   })

//   const updateStatusMutation = useUpdateUserStatus()
//   const deleteUserMutation = useDeleteUser()

//   const handleStatusChange = async (userId: string, newStatus: UserStatus) => {
//     try {
//       await updateStatusMutation.mutateAsync({ id: userId, status: newStatus })
//     } catch (error) {
//       console.error('Status o\'zgartirishda xatolik:', error)
//     }
//   }

//   const handleDeleteUser = async (userId: string, userName: string) => {
//     if (window.confirm(`${userName} foydalanuvchini o'chirishni tasdiqlaysizmi?`)) {
//       try {
//         await deleteUserMutation.mutateAsync(userId)
//       } catch (error) {
//         console.error('Foydalanuvchini o\'chirishda xatolik:', error)
//       }
//     }
//   }

//   const getInitials = (firstName: string, lastName: string) => {
//     return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
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
//             Foydalanuvchilar
//           </h1>
//           <p className="text-gray-600 dark:text-gray-300 mt-1">
//             Tizimdagi barcha foydalanuvchilarni boshqaring
//           </p>
//         </div>
//         <Button 
//           onClick={() => router.push('/dashboard/users/create')}
//           className="gap-2"
//         >
//           <UserPlus className="h-4 w-4" />
//           Yangi foydalanuvchi
//         </Button>
//       </motion.div>

//       {/* Stats Cards */}
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
//                   {data?.total || 0}
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">Jami foydalanuvchilar</div>
//               </div>
//               <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//                 <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-2 hover:shadow-lg transition-all">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
//                   {data?.users?.filter(u => u.status === UserStatus.ACTIVE).length || 0}
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">Faol</div>
//               </div>
//               <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
//                 <UserCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-2 hover:shadow-lg transition-all">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
//                   {data?.users?.filter(u => u.role === UserRole.ADMIN).length || 0}
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">Adminlar</div>
//               </div>
//               <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
//                 <Shield className="h-6 w-6 text-amber-600 dark:text-amber-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-2 hover:shadow-lg transition-all">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
//                   {data?.users?.filter(u => u.status === UserStatus.PENDING).length || 0}
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">Kutilmoqda</div>
//               </div>
//               <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
//                 <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

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
//                   placeholder="Foydalanuvchi qidirish..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="pl-9"
//                 />
//               </div>
//               <div className="flex gap-3">
//                 <Select
//                   value={roleFilter}
//                   onValueChange={(value) => setRoleFilter(value as UserRole | 'all')}
//                 >
//                   <SelectTrigger className="w-[180px]">
//                     <Filter className="h-4 w-4 mr-2" />
//                     <SelectValue placeholder="Rol bo'yicha" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Barcha rollar</SelectItem>
//                     {Object.values(UserRole).map((role) => (
//                       <SelectItem key={role} value={role}>
//                         {role.charAt(0).toUpperCase() + role.slice(1)}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 <Select
//                   value={statusFilter}
//                   onValueChange={(value) => setStatusFilter(value as UserStatus | 'all')}
//                 >
//                   <SelectTrigger className="w-[180px]">
//                     <Filter className="h-4 w-4 mr-2" />
//                     <SelectValue placeholder="Status bo'yicha" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Barcha statuslar</SelectItem>
//                     {Object.values(UserStatus).map((status) => (
//                       <SelectItem key={status} value={status}>
//                         {status.charAt(0).toUpperCase() + status.slice(1)}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 <Button variant="outline" onClick={() => refetch()} className="gap-2">
//                   <RefreshCw className="h-4 w-4" />
//                   Yangilash
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Users Table */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.3 }}
//       >
//         <Card className="border-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Users className="h-5 w-5 text-primary" />
//               Foydalanuvchilar ro'yxati
//             </CardTitle>
//             <CardDescription>
//               Jami {data?.total || 0} ta foydalanuvchi
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <div className="space-y-4">
//                 {[...Array(5)].map((_, i) => (
//                   <div key={i} className="flex items-center space-x-4">
//                     <Skeleton className="h-12 w-12 rounded-full" />
//                     <div className="space-y-2 flex-1">
//                       <Skeleton className="h-4 w-[250px]" />
//                       <Skeleton className="h-4 w-[200px]" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Foydalanuvchi</TableHead>
//                     <TableHead>Kontakt</TableHead>
//                     <TableHead>JSHSHIR</TableHead>
//                     <TableHead>Rol</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Oxirgi kirish</TableHead>
//                     <TableHead className="text-right">Amallar</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {data?.users?.map((user) => {
//                     const StatusIcon = statusIcons[user.status]
//                     return (
//                       <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
//                         <TableCell>
//                           <div className="flex items-center gap-3">
//                             <Avatar className="h-10 w-10 border-2">
//                               <AvatarImage src={user.avatar} />
//                               <AvatarFallback className="bg-primary/10 text-primary">
//                                 {getInitials(user.firstName, user.lastName)}
//                               </AvatarFallback>
//                             </Avatar>
//                             <div>
//                               <div className="font-medium">{user.fullName}</div>
//                               <div className="text-sm text-gray-500 dark:text-gray-400">
//                                 @{user.username}
//                               </div>
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <div className="space-y-1">
//                             <div className="flex items-center gap-1 text-sm">
//                               <Mail className="h-3 w-3 text-gray-400" />
//                               <span>{user.email}</span>
//                             </div>
//                             {user.phone && (
//                               <div className="flex items-center gap-1 text-sm">
//                                 <Phone className="h-3 w-3 text-gray-400" />
//                                 <span>{user.phone}</span>
//                               </div>
//                             )}
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
//                             {user.jshshir}
//                           </code>
//                         </TableCell>
//                         <TableCell>
//                           <Badge className={roleColors[user.role]}>
//                             {user.role}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>
//                           <Badge className={statusColors[user.status]}>
//                             <StatusIcon className="h-3 w-3 mr-1" />
//                             {user.status}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>
//                           {user.lastLoginAt ? (
//                             <div className="flex items-center gap-1 text-sm">
//                               <Calendar className="h-3 w-3 text-gray-400" />
//                               <span>
//                                 {format(new Date(user.lastLoginAt), 'dd MMM yyyy', { locale: uz })}
//                               </span>
//                             </div>
//                           ) : (
//                             <span className="text-sm text-gray-400">Kirilmagan</span>
//                           )}
//                         </TableCell>
//                         <TableCell className="text-right">
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button variant="ghost" size="icon">
//                                 <MoreVertical className="h-4 w-4" />
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end">
//                               <DropdownMenuLabel>Amallar</DropdownMenuLabel>
//                               <DropdownMenuItem asChild>
//                                 <Link href={`/dashboard/users/${user.id}`}>
//                                   <Eye className="h-4 w-4 mr-2" />
//                                   Ko'rish
//                                 </Link>
//                               </DropdownMenuItem>
//                               <DropdownMenuItem asChild>
//                                 <Link href={`/dashboard/users/${user.id}/edit`}>
//                                   <Edit className="h-4 w-4 mr-2" />
//                                   Tahrirlash
//                                 </Link>
//                               </DropdownMenuItem>
//                               <DropdownMenuSeparator />
//                               <DropdownMenuLabel>Status</DropdownMenuLabel>
//                               {Object.values(UserStatus).map((status) => (
//                                 <DropdownMenuItem
//                                   key={status}
//                                   onClick={() => handleStatusChange(user.id, status)}
//                                   disabled={user.status === status}
//                                 >
//                                   {status === UserStatus.ACTIVE && <UserCheck className="h-4 w-4 mr-2" />}
//                                   {status === UserStatus.INACTIVE && <UserX className="h-4 w-4 mr-2" />}
//                                   {status === UserStatus.BLOCKED && <UserX className="h-4 w-4 mr-2" />}
//                                   {status === UserStatus.PENDING && <Clock className="h-4 w-4 mr-2" />}
//                                   {status}
//                                 </DropdownMenuItem>
//                               ))}
//                               <DropdownMenuSeparator />
//                               <DropdownMenuItem
//                                 className="text-red-600 dark:text-red-400"
//                                 onClick={() => handleDeleteUser(user.id, user.fullName)}
//                               >
//                                 <Trash2 className="h-4 w-4 mr-2" />
//                                 O'chirish
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </TableCell>
//                       </TableRow>
//                     )
//                   })}
//                 </TableBody>
//               </Table>
//             )}

//             {/* Pagination */}
//             {data && data.total > limit && (
//               <div className="flex items-center justify-between mt-6">
//                 <div className="text-sm text-gray-500">
//                   {((page - 1) * limit) + 1} - {Math.min(page * limit, data.total)} / {data.total}
//                 </div>
//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setPage(p => Math.max(1, p - 1))}
//                     disabled={page === 1}
//                   >
//                     Oldingi
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setPage(p => p + 1)}
//                     disabled={page * limit >= data.total}
//                   >
//                     Keyingi
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   )
// }