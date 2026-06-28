'use client';

import { useState, useEffect } from 'react';
import { Users, Ticket, Wallet, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AdminDashboardPage() {
  const [kpis, setKpis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from /api/admin/kpi
    setTimeout(() => {
      setKpis({
        totalUsers: 1450,
        totalOrders: 320,
        gmv: 45000000,
        totalTickets: 25,
        openTickets: 3,
        pendingKyc: 12
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-400">Chargement des données...</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Vue d'Ensemble</h1>
        <p className="text-slate-400 mt-1">Supervision globale de la plateforme Siryia.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {/* KPI 1: Chiffre d'affaires GMV */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">+12% ce mois</span>
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Volume d'Affaires (GMV)</p>
          <h3 className="text-3xl font-bold text-white">{formatCurrency(kpis.gmv)}</h3>
        </div>

        {/* KPI 2: Utilisateurs totaux */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary-500/10 text-primary-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Utilisateurs Inscrits</p>
          <h3 className="text-3xl font-bold text-white">{new Intl.NumberFormat('fr-FR').format(kpis.totalUsers)}</h3>
        </div>

        {/* KPI 3: KYC en attente */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            {kpis.pendingKyc > 0 && (
              <span className="text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full">{kpis.pendingKyc} à traiter</span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">KYC en Attente</p>
          <h3 className="text-3xl font-bold text-white">{kpis.pendingKyc}</h3>
        </div>

        {/* KPI 4: Tickets ouverts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/10 text-red-400 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            {kpis.openTickets > 0 && (
              <span className="text-xs font-medium text-red-400 bg-red-400/10 px-2 py-1 rounded-full">Urgent</span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Tickets / Litiges Ouverts</p>
          <h3 className="text-3xl font-bold text-white">{kpis.openTickets}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique simulé */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Évolution des Inscriptions</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
              <div key={i} className="w-full bg-primary-600/20 hover:bg-primary-600 transition-colors rounded-t-md" style={{ height: `${h}%` }}></div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs font-medium text-slate-500">
            <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
          </div>
        </div>

        {/* Dernières actions simulées */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Activité Récente</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <div>
                <p className="text-sm text-white">Paiement Escrow libéré <span className="font-semibold text-emerald-400">+45,000 XOF</span></p>
                <p className="text-xs text-slate-500">Il y a 5 min</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <div>
                <p className="text-sm text-white">Nouveau ticket de litige ouvert (#1244)</p>
                <p className="text-xs text-slate-500">Il y a 12 min</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-primary-500"></div>
              <div>
                <p className="text-sm text-white">Utilisateur @marcd a complété son KYC</p>
                <p className="text-xs text-slate-500">Il y a 28 min</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant local ShieldAlert
function ShieldAlert(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m12 8-1 5" />
      <path d="M12 16h.01" />
    </svg>
  );
}
