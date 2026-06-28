'use client';

import { useState, useEffect } from 'react';
import { useSocketStore } from '@/store/useSocketStore';
import Link from 'next/link';
import { PlusCircle, Search, HelpCircle, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';

// On utilise axios pour appeler l'API locale. Le token sera lu depuis les cookies.
// En environnement de dev local avec Next.js rewrites, on peut utiliser directement '/api' (si configuré)
// Sinon on utilise directement le port 3001 du backend.

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Exemple: faux fetch pour commencer
  useEffect(() => {
    // TODO: Connecter avec axios + cookie siryia_token vers http://localhost:3001/api/support/tickets
    // Simulation:
    setTimeout(() => {
      setTickets([
        { id: '1', title: 'Commande non reçue', status: 'OPEN', type: 'LITIGATION', updatedAt: new Date().toISOString() },
        { id: '2', title: 'Question sur la facturation', status: 'RESOLVED', type: 'QUESTION', updatedAt: new Date().toISOString() }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'IN_PROGRESS': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'RESOLVED': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <HelpCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN': return <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">Ouvert</span>;
      case 'IN_PROGRESS': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">En cours</span>;
      case 'RESOLVED': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">Résolu</span>;
      default: return <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">Clos</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Support Client</h1>
          <p className="text-slate-500 mt-1">Gérez vos tickets et litiges</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl transition-colors font-medium">
          <PlusCircle className="w-5 h-5" />
          Nouveau Ticket
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher un ticket..." 
              className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <Link href="/faq" className="text-sm font-medium text-primary-600 hover:underline">
            Consulter la Base de Connaissances
          </Link>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800">Aucun ticket</h3>
            <p className="text-slate-500 mt-1">Vous n'avez aucun ticket de support ouvert.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {tickets.map(ticket => (
              <li key={ticket.id}>
                <Link href={`/dashboard/support/${ticket.id}`} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(ticket.status)}
                    <div>
                      <h4 className="font-medium text-slate-900">{ticket.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">Dernière maj: {new Date(ticket.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(ticket.status)}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
