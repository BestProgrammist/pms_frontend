// components/chat/chat-window.tsx
"use client"

import { useState, useEffect, useRef } from 'react'
import { chatService } from '@/lib/api/chat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  Info,
  ChevronLeft,
  CheckCheck,
  Check,
  Image as ImageIcon,
  FileText,
  X
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { uz } from 'date-fns/locale'
import { toast } from 'sonner'
import { useAuth } from '../providers/AuthProvider'

interface Message {
  id: string
  content: string
  type: string
  senderId: string
  conversationId: string
  sender: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
  }
  createdAt: string
  isEdited: boolean
  attachments: any[]
  readBy: any[]
}

interface Conversation {
  id: string
  name: string
  type: string
  participants: any[]
  lastMessage?: Message
  unreadCount?: number
}

export function ChatWindow() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      chatService.connect(localStorage.getItem('accessToken') || '')
      
      loadConversations()

      // Socket listeners
      chatService.on('message:new', handleNewMessage)
      chatService.on('message:updated', handleMessageUpdated)
      chatService.on('message:deleted', handleMessageDeleted)
      chatService.on('messages:read', handleMessagesRead)
      chatService.on('typing:started', handleTypingStarted)
      chatService.on('typing:stopped', handleTypingStopped)
      chatService.on('user:presence', handleUserPresence)

      return () => {
        chatService.disconnect()
      }
    }
  }, [user])

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation)
      chatService.joinConversation(activeConversation)
      
      return () => {
        chatService.leaveConversation(activeConversation)
      }
    }
  }, [activeConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = async () => {
    try {
      const data = await chatService.getConversations()
      setConversations(data)
    } catch (error) {
      console.error('Failed to load conversations:', error)
    }
  }

  const loadMessages = async (conversationId: string) => {
    setLoading(true)
    try {
      const { messages } = await chatService.getMessages(conversationId)
      setMessages(messages)
      
      // Mark messages as read
      const unreadIds = messages
        .filter((m: Message) => m.senderId !== user?.id && !m.readBy?.some(r => r.userId === user?.id))
        .map((m: Message) => m.id)
      
      if (unreadIds.length > 0) {
        chatService.markAsRead(conversationId, unreadIds)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewMessage = (message: Message) => {
    if (message.conversationId === activeConversation) {
      setMessages(prev => [...prev, message])
      
      // Mark as read if it's from someone else
      if (message.senderId !== user?.id) {
        chatService.markAsRead(activeConversation!, [message.id])
      }
    }
    
    // Update conversations list
    setConversations(prev => 
      prev.map(conv => 
        conv.id === message.conversationId 
          ? { ...conv, lastMessage: message, unreadCount: conv.unreadCount ? conv.unreadCount + 1 : 1 }
          : conv
      )
    )
  }

  const handleMessageUpdated = (message: Message) => {
    setMessages(prev => 
      prev.map(m => m.id === message.id ? message : m)
    )
  }

  const handleMessageDeleted = (data: { messageId: string }) => {
    setMessages(prev => 
      prev.map(m => 
        m.id === data.messageId 
          ? { ...m, content: '[Xabar o\'chirildi]', isDeleted: true }
          : m
      )
    )
  }

  const handleMessagesRead = (data: { userId: string; messageIds: string[] }) => {
    setMessages(prev => 
      prev.map(m => 
        data.messageIds.includes(m.id)
          ? { ...m, readBy: [...(m.readBy || []), { userId: data.userId }] }
          : m
      )
    )
  }

  const handleTypingStarted = (data: { userId: string; conversationId: string }) => {
    if (data.conversationId === activeConversation && data.userId !== user?.id) {
      setTypingUsers(prev => new Set([...prev, data.userId]))
    }
  }

  const handleTypingStopped = (data: { userId: string; conversationId: string }) => {
    if (data.conversationId === activeConversation) {
      setTypingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(data.userId)
        return newSet
      })
    }
  }

  const handleUserPresence = (data: { userId: string; status: string }) => {
    if (data.status === 'online') {
      setOnlineUsers(prev => new Set([...prev, data.userId]))
    } else {
      setOnlineUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(data.userId)
        return newSet
      })
    }
  }

  const sendMessage = () => {
    if (!messageText.trim() || !activeConversation) return
    
    chatService.sendMessage(activeConversation, messageText)
    setMessageText('')
    chatService.stopTyping(activeConversation)
  }

  const handleTyping = () => {
    if (!activeConversation) return
    
    chatService.startTyping(activeConversation)
    
    // Stop typing after 2 seconds of no typing
    const timeout = setTimeout(() => {
      chatService.stopTyping(activeConversation)
    }, 2000)
    
    return () => clearTimeout(timeout)
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !activeConversation) return

    // Upload file logic here
    // You can implement file upload to server and get URL

    toast.success('Fayl yuklandi')
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  const formatMessageTime = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: uz })
  }

  if (!activeConversation) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Xabarlar</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-2 p-4">
            {conversations.map(conv => (
              <div
                key={conv.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => setActiveConversation(conv.id)}
              >
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
                    {conv.name?.[0] || 'C'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold truncate">
                      {conv.name || conv.participants.map(p => p.user.firstName).join(', ')}
                    </h4>
                    {conv.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {formatMessageTime(conv.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {conv.lastMessage?.content || 'Xabar yo\'q'}
                  </p>
                  {conv.unreadCount! > 0 && (
                    <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    )
  }

  const activeConv = conversations.find(c => c.id === activeConversation)

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setActiveConversation(null)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
              {activeConv?.name?.[0] || 'C'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">
              {activeConv?.name || activeConv?.participants.map(p => p.user.firstName).join(', ')}
            </h3>
            <p className="text-xs text-gray-500">
              {typingUsers.size > 0 ? (
                <span className="text-primary">Yozmoqda...</span>
              ) : (
                `${activeConv?.participants.length} a'zo`
              )}
            </p>
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
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.senderId !== user?.id && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-gray-300">
                        {getInitials(msg.sender.firstName, msg.sender.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.senderId === user?.id
                        ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    {msg.type === 'text' && (
                      <p className="text-sm">{msg.content}</p>
                    )}
                    
                    {msg.attachments?.map(att => (
                      <div key={att.id} className="mt-2">
                        {att.type === 'image' ? (
                          <img
                            src={att.fileUrl}
                            alt={att.fileName}
                            className="max-w-full rounded-lg"
                          />
                        ) : (
                          <a
                            href={att.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 bg-black/10 rounded"
                          >
                            <FileText className="h-5 w-5" />
                            <span className="text-sm">{att.fileName}</span>
                          </a>
                        )}
                      </div>
                    ))}
                    
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xs opacity-70">
                        {formatMessageTime(msg.createdAt)}
                      </span>
                      {msg.senderId === user?.id && (
                        msg.readBy?.length > 0 ? (
                          <CheckCheck className="h-3 w-3" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )
                      )}
                      {msg.isEdited && (
                        <span className="text-xs opacity-70 ml-1">(tahrirlangan)</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelected}
          />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={handleFileUpload}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Smile className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Xabar yozing..."
            className="flex-1 rounded-full bg-gray-100 dark:bg-gray-800 border-0"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            onKeyUp={handleTyping}
          />
          <Button
            className="rounded-full bg-gradient-to-r from-blue-600 to-emerald-600"
            onClick={sendMessage}
            disabled={!messageText.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}