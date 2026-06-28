'use client';

import { useState } from 'react';
import { ConversationList } from '@/components/chat/ConversationList';
import { ChatWindow } from '@/components/chat/ChatWindow';

export default function MessagesPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  // Dans un cas réel, ceci viendrait d'un appel API pour récupérer la liste des contacts / conversations récentes.
  const [contacts] = useState([
    { id: 'f91eb54e-49c0-4776-9b36-5129674a6606', name: 'Bob Test', avatar: null, lastMessage: 'Salut Alice !' },
    { id: '684a7a50-9645-4e6d-ad1f-14654837866a', name: 'Alice Test', avatar: null, lastMessage: 'Hello Bob !' },
  ]);

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-slate-200 flex overflow-hidden">
      {/* Sidebar: Liste des conversations */}
      <div className="w-1/3 border-r border-slate-200 bg-slate-50 flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h2 className="text-lg font-bold text-slate-800">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConversationList 
            contacts={contacts} 
            selectedUserId={selectedUserId} 
            onSelect={setSelectedUserId} 
          />
        </div>
      </div>

      {/* Main: Fenêtre de chat */}
      <div className="flex-1 bg-white flex flex-col">
        {selectedUserId ? (
          <ChatWindow 
            contactId={selectedUserId} 
            contactName={contacts.find(c => c.id === selectedUserId)?.name || 'Inconnu'} 
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <span className="text-4xl mb-4">💬</span>
            <p>Sélectionnez une conversation pour démarrer.</p>
          </div>
        )}
      </div>
    </div>
  );
}
