// components/dashboard/chat-notifications.tsx
"use client"

import { useState } from 'react'
import { MessageSquare, Bell, Users, Send, Paperclip, Smile, MoreVertical } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function ChatNotifications() {
  const [activeTab, setActiveTab] = useState('chats')
  const [activeChat, setActiveChat] = useState<number | null>(1)

  // Fake chat data
  const chats = [
    { id: 1, name: 'Azizova Malika', subject: 'Matematika', lastMessage: 'Uy vazifasini tushundingizmi?', time: '10:30', unread: 2, online: true },
    { id: 2, name: 'Rahimov Alisher', subject: 'Fizika', lastMessage: 'Laboratoriya ishi uchun materiallar', time: '09:15', unread: 0, online: true },
    { id: 3, name: 'Karimova Sanobar', subject: 'Ingliz tili', lastMessage: 'Test natijalari chiqdi', time: 'Yesterday', unread: 1, online: false },
    { id: 4, name: 'Yusupov Dilmurod', subject: 'Informatika', lastMessage: 'Loyihani yuborishingiz kerak', time: 'Yesterday', unread: 0, online: true },
    { id: 5, name: 'Guruh chat', subject: '9B Matematika', lastMessage: 'Sardor: Kimda uy vazifasi bor?', time: '2d ago', unread: 5, online: true },
  ]

  // Fake messages
  const messages = [
    { id: 1, sender: 'teacher', text: 'Salom! Bugungi darsimizga tayyormisiz?', time: '10:25' },
    { id: 2, sender: 'me', text: 'Ha, ustoz. Darslik va daftarlar tayyor', time: '10:26' },
    { id: 3, sender: 'teacher', text: 'Ajoyib! Bugun geometriyadan murakkab masalalar yechamiz', time: '10:27' },
    { id: 4, sender: 'me', text: 'Qanday mavzular?', time: '10:28' },
    { id: 5, sender: 'teacher', text: 'Pifagor teoremasi va trigonometrik funksiyalar', time: '10:30' },
  ]

  // Fake notifications
  const notifications = [
    { id: 1, type: 'assignment', text: 'Yangi uy vazifasi: Algebra 5-mashq', time: '5 min ago', read: false },
    { id: 2, type: 'announcement', text: 'Ertangi dars 1 soat kechroq boshlanadi', time: '1 hour ago', read: false },
    { id: 3, type: 'grade', text: 'Test natijalaringiz chiqdi: 95/100', time: '2 hours ago', read: true },
    { id: 4, type: 'reminder', text: 'Proyekt topshirig\'i muddati yaqinlashmoqda', time: '1 day ago', read: true },
    { id: 5, type: 'event', text: 'Matematika olimpiadasi 15-yanvar', time: '2 days ago', read: true },
  ]

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Chat va Bildirishnomalar
          </CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <Bell className="h-3 w-3" />
            3 yangi
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="chats" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chatlar
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Bildirishnomalar
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Guruhlar
            </TabsTrigger>
          </TabsList>

          {/* Chats Tab */}
          <TabsContent value="chats" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Chat list */}
              <div className="lg:col-span-1">
                <ScrollArea className="h-[400px]">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
                        activeChat === chat.id ? 'bg-primary/10 border border-primary/20' : ''
                      }`}
                      onClick={() => setActiveChat(chat.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {chat.online && (
                            <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold truncate">{chat.name}</h4>
                            <span className="text-xs text-muted-foreground">{chat.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{chat.subject}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm truncate">{chat.lastMessage}</p>
                            {chat.unread > 0 && (
                              <Badge className="bg-primary text-primary-foreground">
                                {chat.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>

              {/* Chat messages */}
              <div className="lg:col-span-2">
                {activeChat ? (
                  <div className="flex flex-col h-[400px] border rounded-lg">
                    {/* Chat header */}
                    <div className="p-3 border-b flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>AM</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{chats.find(c => c.id === activeChat)?.name}</h4>
                          <p className="text-xs text-muted-foreground">Online - Matematika o'qituvchisi</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                msg.sender === 'me'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p>{msg.text}</p>
                              <p className={`text-xs mt-1 ${
                                msg.sender === 'me' ? 'text-primary-foreground/80' : 'text-muted-foreground'
                              }`}>
                                {msg.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* Message input */}
                    <div className="p-3 border-t">
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Input placeholder="Xabar yozing..." className="flex-1" />
                        <Button variant="outline" size="icon">
                          <Smile className="h-4 w-4" />
                        </Button>
                        <Button>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[400px] flex flex-col items-center justify-center border rounded-lg">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Chatni tanlang</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      O'qituvchi yoki guruhni tanlab xabar almashishingiz mumkin
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg border transition-all hover:bg-muted/50 ${
                      !notif.read ? 'bg-primary/5 border-primary/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        notif.type === 'assignment' ? 'bg-blue-100 text-blue-600' :
                        notif.type === 'announcement' ? 'bg-yellow-100 text-yellow-600' :
                        notif.type === 'grade' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        <Bell className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{notif.text}</p>
                          {!notif.read && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                Barchasini o'qilgan qilish
              </Button>
            </div>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: '9B Matematika', members: 24, online: 8, subject: 'Algebra' },
                { name: 'Fizika Olimpiadasi', members: 15, online: 5, subject: 'Fizika' },
                { name: 'Ingliz Tili', members: 30, online: 12, subject: 'Grammar' },
                { name: 'Dasturlash', members: 18, online: 7, subject: 'Python' },
              ].map((group, index) => (
                <div key={index} className="p-4 border rounded-lg hover:border-primary transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{group.name}</h4>
                    <Badge variant="outline">{group.subject}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{group.members} a'zo</span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      {group.online} online
                    </span>
                  </div>
                  <Button className="w-full mt-4" size="sm">
                    Guruhga qo'shilish
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}