'use client';

import { useState, useEffect } from 'react';
import { Search, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from /api/admin/tickets
    setTimeout(() => {
      setTickets([
        { id: '1', title: 'Commande #8921 non reçue', reporter: { email: 'client@test.com', profile: { firstName: 'Alice' } }, status: 'OPEN', type: 'LITIGATION', priority: 'HIGH', createdAt: new Date().toISOString() },
        { id: '2', title: 'Mon profil entreprise est bloqué', reporter: { email: 'pro@test.com', profile: { firstName: 'Marc' } }, status: 'IN_PROGRESS', type: 'QUESTION', priority: 'NORMAL', createdAt: new Date(Date.now() - 86400000).toISOString() },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN': return <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs font-medium border border-red-500/20">Ouvert</span>;
      case 'IN_PROGRESS': return <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs font-medium border border-blue-500/20">En cours</span>;
      case 'RESOLVED': return <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs font-medium border border-emerald-500/20">Résolu</span>;
      default: return <span className="bg-slate-800 text-slate-400 px-2 py-1 rounded text-xs font-medium border border-slate-700">Clos</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'HIGH' || priority === 'URGENT') return <span className="text-red-400 text-xs font-bold uppercase">{priority}</span>;
    return <span className="text-slate-400 text-xs font-bold uppercase">{priority}</span>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Support & Litiges</h1>
        <p className="text-slate-400 mt-1">Gérez la file d'attente des tickets clients et les litiges d'Escrow.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Rechercher un ticket..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Sujet</th>
                <th className="px-6 py-4">Auteur</th>
                <th className="px-6 py-4">Priorité</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Création</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Chargement des tickets...
                  </td>
                </tr>
              ) : (
                tickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#{ticket.id}</td>
                    <td className="px-6 py-4 font-medium text-white">{ticket.title}</td>
                    <td className="px-6 py-4 text-slate-400">{ticket.reporter.email}</td>
                    <td className="px-6 py-4">{getPriorityBadge(ticket.priority)}</td>
                    <td className="px-6 py-4">{getStatusBadge(ticket.status)}</td>
                    <td className="px-6 py-4 text-slate-400">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      {/* Ici, idéalement un lien vers /admin/tickets/:id (vue modérateur) */}
                      <button className="text-primary-500 hover:text-primary-400 text-xs font-medium bg-primary-500/10 px-3 py-1.5 rounded-lg">
                        Traiter
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
