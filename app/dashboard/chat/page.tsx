// app/dashboard/chat/page.tsx
"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Phone, 
  Video, 
  Info,
  Check,
  CheckCheck,
  Star,
  Clock,
  FileText,
  MessageSquare
} from 'lucide-react'
import { ChatWindow } from '@/components/chat/chat-window'

const chats = [
  {
    id: 1,
    name: 'Azizova Malika',
    role: 'Matematika o\'qituvchisi',
    lastMessage: 'Uy vazifasini tushundingizmi?',
    time: '10:30',
    unread: 2,
    online: true,
    avatar: 'AM',
    status: 'online'
  },
  {
    id: 2,
    name: 'Rahimov Alisher',
    role: 'Fizika o\'qituvchisi',
    lastMessage: 'Laboratoriya ishi uchun materiallar',
    time: '09:15',
    unread: 0,
    online: true,
    avatar: 'RA',
    status: 'online'
  },
  {
    id: 3,
    name: 'Karimova Sanobar',
    role: 'Ingliz tili o\'qituvchisi',
    lastMessage: 'Test natijalari chiqdi',
    time: 'Yesterday',
    unread: 1,
    online: false,
    avatar: 'KS',
    status: 'offline'
  },
  {
    id: 4,
    name: 'Yusupov Dilmurod',
    role: 'Informatika o\'qituvchisi',
    lastMessage: 'Loyihani yuborishingiz kerak',
    time: 'Yesterday',
    unread: 0,
    online: true,
    avatar: 'YD',
    status: 'online'
  },
  {
    id: 5,
    name: '9B Matematika Guruhi',
    role: '24 ta o\'quvchi, 1 ta ustoz',
    lastMessage: 'Sardor: Kimda uy vazifasi bor?',
    time: '2d ago',
    unread: 5,
    online: true,
    avatar: '9B',
    status: 'group'
  }
]

const messages = [
  {
    id: 1,
    sender: 'teacher',
    text: 'Salom! Bugungi darsimizga tayyormisiz?',
    time: '10:25',
    status: 'read'
  },
  {
    id: 2,
    sender: 'me',
    text: 'Ha, ustoz. Darslik va daftarlar tayyor',
    time: '10:26',
    status: 'read'
  },
  {
    id: 3,
    sender: 'teacher',
    text: 'Ajoyib! Bugun geometriyadan murakkab masalalar yechamiz',
    time: '10:27',
    status: 'read'
  },
  {
    id: 4,
    sender: 'me',
    text: 'Qanday mavzular?',
    time: '10:28',
    status: 'read'
  },
  {
    id: 5,
    sender: 'teacher',
    text: 'Pifagor teoremasi va trigonometrik funksiyalar',
    time: '10:30',
    status: 'read'
  },
  {
    id: 6,
    sender: 'teacher',
    text: 'Mana, masalalarni yechib ko\'ring 👇',
    time: '10:31',
    status: 'delivered'
  },
  {
    id: 7,
    sender: 'system',
    text: 'Pifagor teoremasi masalalari.pdf',
    type: 'file',
    size: '2.4 MB',
    time: '10:31'
  }
]

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState<number | null>(1)
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="h-[calc(100vh-4rem)] pb-6">
      <ChatWindow />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full"
      >
        <Card className="h-full border-2 overflow-hidden">
          <CardContent className="p-0 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
              {/* Chats List */}
              <div className="lg:col-span-1 border-r h-full flex flex-col">
                {/* Header */}
                <div className="p-4 border-b">
                  <h2 className="text-xl font-bold mb-4">Xabarlar</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Chat qidirish..."
                      className="pl-9 rounded-xl bg-gray-100 dark:bg-gray-800 border-0"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 p-4 border-b">
                  <Badge variant="default" className="cursor-pointer bg-blue-600">Barchasi</Badge>
                  <Badge variant="outline" className="cursor-pointer">O'qilmagan</Badge>
                  <Badge variant="outline" className="cursor-pointer">Guruhlar</Badge>
                  <Badge variant="outline" className="cursor-pointer">Online</Badge>
                </div>

                {/* Chat List */}
                <ScrollArea className="flex-1">
                  <div className="space-y-1 p-2">
                    {chats.map((chat) => (
                      <div
                        key={chat.id}
                        className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-800 ${
                          activeChat === chat.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                        }`}
                        onClick={() => setActiveChat(chat.id)}
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className={`bg-gradient-to-r ${
                              chat.id === 1 ? 'from-blue-500 to-emerald-500' :
                              chat.id === 2 ? 'from-emerald-500 to-green-500' :
                              chat.id === 3 ? 'from-amber-500 to-orange-500' :
                              chat.id === 4 ? 'from-purple-500 to-pink-500' :
                              'from-blue-600 to-purple-600'
                            } text-white`}>
                              {chat.avatar}
                            </AvatarFallback>
                          </Avatar>
                          {chat.online && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold truncate">{chat.name}</h4>
                            <span className="text-xs text-gray-500">{chat.time}</span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">{chat.role}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm truncate text-gray-600 dark:text-gray-300">
                              {chat.lastMessage}
                            </p>
                            {chat.unread > 0 && (
                              <Badge className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 p-0 flex items-center justify-center">
                                {chat.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Chat Area */}
              <div className="lg:col-span-2 h-full flex flex-col">
                {activeChat ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
                            {chats.find(c => c.id === activeChat)?.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {chats.find(c => c.id === activeChat)?.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${
                              chats.find(c => c.id === activeChat)?.status === 'online' 
                                ? 'bg-emerald-500' 
                                : 'bg-gray-300'
                            }`} />
                            <span className="text-xs text-gray-500">
                              {chats.find(c => c.id === activeChat)?.status === 'online' 
                                ? 'Online' 
                                : chats.find(c => c.id === activeChat)?.status === 'group'
                                ? '24 ta a\'zo'
                                : 'Offline'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Phone className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Video className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Info className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {/* Date Separator */}
                        <div className="flex justify-center">
                          <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">
                            10 Yanvar, 2024
                          </Badge>
                        </div>

                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                          >
                            {msg.type === 'file' ? (
                              <div className="max-w-[70%] bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{msg.text}</p>
                                    <p className="text-xs text-gray-500">{msg.size}</p>
                                  </div>
                                  <Button variant="ghost" size="sm">Yuklash</Button>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">{msg.time}</p>
                              </div>
                            ) : (
                              <div className={`max-w-[70%] rounded-lg p-3 ${
                                msg.sender === 'me'
                                  ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white'
                                  : msg.sender === 'system'
                                  ? 'bg-gray-100 dark:bg-gray-800 text-center w-full'
                                  : 'bg-gray-100 dark:bg-gray-800'
                              }`}>
                                <p className={msg.sender === 'system' ? 'text-sm' : ''}>
                                  {msg.text}
                                </p>
                                <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                                  msg.sender === 'me' 
                                    ? 'text-white/80' 
                                    : 'text-gray-500'
                                }`}>
                                  <span>{msg.time}</span>
                                  {msg.sender === 'me' && (
                                    msg.status === 'read' 
                                      ? <CheckCheck className="h-3 w-3" />
                                      : <Check className="h-3 w-3" />
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="p-4 border-t">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <Paperclip className="h-5 w-5" />
                        </Button>
                        <Input
                          placeholder="Xabar yozing..."
                          className="flex-1 rounded-full bg-gray-100 dark:bg-gray-800 border-0"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                        />
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <Smile className="h-5 w-5" />
                        </Button>
                        <Button className="rounded-full bg-gradient-to-r from-blue-600 to-emerald-600">
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Xabarlar yo'q</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                      Chat tanlang yoki yangi suhbat boshlang
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}