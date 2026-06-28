'use client';

import { useState, useEffect } from 'react';
import { Search, ShieldAlert, Check, X, Filter } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from /api/admin/users
    setTimeout(() => {
      setUsers([
        { id: '1', email: 'vendeur@test.com', profile: { firstName: 'Jean', lastName: 'Dupont', kycStatus: 'PENDING' }, roles: [{ role: { id: 'SELLER' } }], createdAt: '2026-06-25T10:00:00Z' },
        { id: '2', email: 'acheteur@test.com', profile: { firstName: 'Alice', lastName: 'Martin', kycStatus: 'VERIFIED' }, roles: [{ role: { id: 'BUYER' } }], createdAt: '2026-06-20T14:30:00Z' },
        { id: '3', email: 'pro@test.com', profile: { firstName: 'Marc', lastName: 'Durand', kycStatus: 'REJECTED' }, roles: [{ role: { id: 'PROVIDER' } }], createdAt: '2026-06-28T09:15:00Z' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getKycBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED': return <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs font-medium border border-emerald-500/20">Vérifié</span>;
      case 'PENDING': return <span className="bg-amber-500/10 text-amber-400 px-2 py-1 rounded text-xs font-medium border border-amber-500/20">En attente</span>;
      case 'REJECTED': return <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs font-medium border border-red-500/20">Rejeté</span>;
      default: return <span className="bg-slate-800 text-slate-400 px-2 py-1 rounded text-xs font-medium border border-slate-700">Inconnu</span>;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Utilisateurs & KYC</h1>
        <p className="text-slate-400 mt-1">Gérez les comptes, les rôles et validez les identités.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Rechercher (email, nom)..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl transition-colors text-sm font-medium">
            <Filter className="w-4 h-4" />
            Filtres
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="px-6 py-4">Utilisateur</th>
                <th className="px-6 py-4">Rôles</th>
                <th className="px-6 py-4">Statut KYC</th>
                <th className="px-6 py-4">Inscription</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Chargement des utilisateurs...
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold">
                          {user.profile.firstName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.profile.firstName} {user.profile.lastName}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {user.roles.map((r: any) => (
                          <span key={r.role.id} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                            {r.role.id}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getKycBadge(user.profile.kycStatus)}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.profile.kycStatus === 'PENDING' ? (
                        <div className="flex justify-end gap-2">
                          <button className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors" title="Valider le KYC">
                            <Check className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors" title="Rejeter le KYC">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button className="text-primary-500 hover:text-primary-400 text-xs font-medium">
                          Voir Profil
                        </button>
                      )}
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
