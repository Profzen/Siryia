import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  activeConversationMessages: any[];
  notifications: any[];
  connect: (token: string) => void;
  disconnect: () => void;
  sendMessage: (payload: any) => Promise<any>;
  setActiveConversationMessages: (messages: any[]) => void;
  addMessage: (message: any) => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  activeConversationMessages: [],
  notifications: [],

  connect: (token: string) => {
    if (get().socket) return; // Déjà connecté

    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    socket.on('connect', () => {
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    socket.on('newMessage', (msg) => {
      // Ajouter au fil actif si on est sur la page
      set((state) => ({
        activeConversationMessages: [...state.activeConversationMessages, msg]
      }));
    });

    socket.on('newNotification', (notif) => {
      set((state) => ({
        notifications: [notif, ...state.notifications]
      }));
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  sendMessage: (payload: any) => {
    return new Promise((resolve, reject) => {
      const { socket } = get();
      if (!socket) return reject('Socket non connecté');

      socket.emit('sendMessage', payload, (response: any) => {
        if (response.error) {
          reject(response.error);
        } else {
          // Ajouter notre propre message envoyé au fil localement
          set((state) => ({
            activeConversationMessages: [...state.activeConversationMessages, response.data]
          }));
          resolve(response.data);
        }
      });
    });
  },

  setActiveConversationMessages: (messages: any[]) => {
    set({ activeConversationMessages: messages });
  },

  addMessage: (message: any) => {
    set((state) => ({
      activeConversationMessages: [...state.activeConversationMessages, message]
    }));
  }
}));
