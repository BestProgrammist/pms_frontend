// lib/api/chat.ts
import { io, Socket } from 'socket.io-client';
import apiClient from './client';

class ChatService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000/chat', {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Chat connected');
      this.emit('connected', null);
    });

    this.socket.on('disconnect', () => {
      console.log('Chat disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Chat error:', error);
    });

    // Message handlers
    this.socket.on('message:new', (message) => {
      this.emit('message:new', message);
    });

    this.socket.on('message:updated', (message) => {
      this.emit('message:updated', message);
    });

    this.socket.on('message:deleted', (data) => {
      this.emit('message:deleted', data);
    });

    this.socket.on('messages:read', (data) => {
      this.emit('messages:read', data);
    });

    this.socket.on('typing:started', (data) => {
      this.emit('typing:started', data);
    });

    this.socket.on('typing:stopped', (data) => {
      this.emit('typing:stopped', data);
    });

    this.socket.on('user:presence', (data) => {
      this.emit('user:presence', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Event listeners
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback?: Function) {
    if (callback) {
      const callbacks = this.listeners.get(event) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    } else {
      this.listeners.delete(event);
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(data));
  }

  // WebSocket actions
  sendMessage(conversationId: string, content: string, type: string = 'text', attachments: any[] = []) {
    this.socket?.emit('message:send', {
      conversationId,
      content,
      type,
      attachments
    });
  }

  editMessage(messageId: string, content: string) {
    this.socket?.emit('message:edit', { messageId, content });
  }

  deleteMessage(messageId: string) {
    this.socket?.emit('message:delete', { messageId });
  }

  markAsRead(conversationId: string, messageIds: string[]) {
    this.socket?.emit('message:read', { conversationId, messageIds });
  }

  joinConversation(conversationId: string) {
    this.socket?.emit('conversation:join', { conversationId });
  }

  leaveConversation(conversationId: string) {
    this.socket?.emit('conversation:leave', { conversationId });
  }

  startTyping(conversationId: string) {
    this.socket?.emit('typing:start', { conversationId });
  }

  stopTyping(conversationId: string) {
    this.socket?.emit('typing:stop', { conversationId });
  }

  // REST API calls
  async getConversations() {
    const response = await apiClient.get('/chat/conversations');
    return response.data;
  }

  async getConversation(id: string) {
    const response = await apiClient.get(`/chat/conversations/${id}`);
    return response.data;
  }

  async createConversation(data: any) {
    const response = await apiClient.post('/chat/conversations', data);
    return response.data;
  }

  async getMessages(conversationId: string, page: number = 1, limit: number = 50) {
    const response = await apiClient.get('/chat/messages', {
      params: { conversationId, page, limit }
    });
    return response.data;
  }

  async sendMessageRest(data: any) {
    const response = await apiClient.post('/chat/messages', data);
    return response.data;
  }

  async getUnreadCount(conversationId?: string) {
    const response = await apiClient.get('/chat/messages/unread', {
      params: { conversationId }
    });
    return response.data;
  }

  async searchMessages(query: string, conversationId?: string) {
    const response = await apiClient.get('/chat/search', {
      params: { q: query, conversationId }
    });
    return response.data;
  }

  async getAttachments(conversationId: string, type?: string) {
    const response = await apiClient.get(`/chat/conversations/${conversationId}/attachments`, {
      params: { type }
    });
    return response.data;
  }
}

export const chatService = new ChatService();

