'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Paperclip } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<any>(null);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: fetch api/support/tickets/:id
    setTimeout(() => {
      setTicket({
        id,
        title: 'Commande non reçue',
        status: 'OPEN',
        priority: 'HIGH',
        messages: [
          { id: '1', content: 'Bonjour, je n\'ai toujours pas reçu ma commande #12345.', sender: { profile: { firstName: 'Alice' } }, createdAt: new Date(Date.now() - 3600000).toISOString() },
          { id: '2', content: 'Bonjour Alice, nous vérifions auprès du vendeur.', sender: { profile: { firstName: 'Support' } }, createdAt: new Date().toISOString() },
        ]
      });
    }, 500);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // TODO: post message to api
    const newMessage = {
      id: Date.now().toString(),
      content: message,
      sender: { profile: { firstName: 'Moi' } },
      createdAt: new Date().toISOString(),
      isMe: true,
    };
    
    setTicket((prev: any) => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
    setMessage('');
  };

  if (!ticket) return <div className="p-12 text-center text-slate-500">Chargement du ticket...</div>;

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/support" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{ticket.title}</h1>
            <p className="text-sm text-slate-500">Ticket #{ticket.id} • {ticket.status}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
          <div className="space-y-6">
            {ticket.messages.map((msg: any) => {
              const isMe = msg.isMe || msg.sender.profile.firstName === 'Moi' || msg.sender.profile.firstName === 'Alice'; // Simulation simplifiée
              
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${isMe ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}`}>
                    {!isMe && <p className="text-xs font-semibold text-slate-400 mb-1">{msg.sender.profile.firstName}</p>}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-[10px] mt-2 ${isMe ? 'text-primary-100' : 'text-slate-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <button type="button" className="p-3 text-slate-400 hover:text-primary-600 hover:bg-slate-100 rounded-xl transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Écrivez votre message..." 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <button type="submit" disabled={!message.trim()} className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white p-3 rounded-xl transition-colors">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
