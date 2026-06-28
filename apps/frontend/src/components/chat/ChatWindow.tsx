'use client';

import { useEffect, useRef, useState } from 'react';
import { useSocketStore } from '@/store/useSocketStore';
import { Send, User } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '@/store/useAuthStore'; // Assumant qu'il y a un store d'auth, on va utiliser l'ID du token ou simuler.

interface ChatWindowProps {
  contactId: string;
  contactName: string;
}

export function ChatWindow({ contactId, contactName }: ChatWindowProps) {
  const { activeConversationMessages, setActiveConversationMessages, sendMessage, isConnected } = useSocketStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulation: L'ID de l'utilisateur connecté (normalement issu de AuthStore ou du Token JWT)
  // Dans un cas réel, récupéré via JWT ou contexte
  const [myUserId, setMyUserId] = useState<string>('');

  useEffect(() => {
    // Si on change de contact, on devrait fetcher l'historique via API (GET /messaging/conversations/:contactId)
    // Pour l'instant on réinitialise l'affichage.
    setActiveConversationMessages([]);
    
    // On pourrait décoder le JWT dans le cookie ici pour avoir notre ID,
    // mais on suppose que le JWT nous a été fourni. Pour le front, c'est mieux d'avoir useAuthStore.
    // Hack pour l'instant : on devine notre ID en excluant le contactId si on a un historique.
  }, [contactId, setActiveConversationMessages]);

  useEffect(() => {
    // Scroll automatically to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversationMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !isConnected) return;

    try {
      await sendMessage({
        receiverId: contactId,
        content: inputText.trim(),
        messageType: 'TEXT',
      });
      setInputText('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      alert('Impossible d\'envoyer le message.');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* En-tête du Chat */}
      <div className="h-16 border-b border-slate-200 bg-white flex items-center px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
            <User className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">{contactName}</h2>
            <p className="text-xs text-emerald-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              En ligne
            </p>
          </div>
        </div>
      </div>

      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {activeConversationMessages.length === 0 && (
          <div className="text-center text-slate-400 text-sm mt-10">
            Aucun message. Commencez la discussion !
          </div>
        )}
        
        {activeConversationMessages.map((msg, index) => {
          const isMine = msg.senderId !== contactId; // Si je ne suis pas le contact, alors c'est moi
          
          return (
            <div key={msg.id || index} className={clsx("flex flex-col max-w-[70%]", isMine ? "ml-auto items-end" : "mr-auto items-start")}>
              <div 
                className={clsx(
                  "px-4 py-2 rounded-2xl text-sm",
                  isMine 
                    ? "bg-primary-600 text-white rounded-br-none" 
                    : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm"
                )}
              >
                {msg.isFiltered && (
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block mb-1">
                    Censuré par l'Anti-contournement
                  </span>
                )}
                {msg.content}
              </div>
              <span className="text-[10px] text-slate-400 mt-1">
                {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Barre de saisie */}
      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 bg-slate-100 border-none focus:ring-2 focus:ring-primary-500 rounded-xl px-4 py-3 text-sm text-slate-800"
            disabled={!isConnected}
          />
          <button 
            type="submit" 
            disabled={!inputText.trim() || !isConnected}
            className="w-12 h-12 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
