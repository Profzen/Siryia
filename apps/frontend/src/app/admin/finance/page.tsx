'use client';

import { useState, useEffect } from 'react';
import { Wallet, ShieldCheck, ArrowRightLeft, ArrowUpRight } from 'lucide-react';

export default function AdminFinancePage() {
  const [finance, setFinance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from /api/admin/finance
    setTimeout(() => {
      setFinance({
        totalEscrow: 450000,
        recentEscrowPayments: [
          { id: 'pay_1', amount: 15000, provider: 'TMONEY', status: 'SUCCESS', isEscrowed: true, createdAt: new Date().toISOString(), order: { id: 'ord_1', totalAmount: 15000 } },
          { id: 'pay_2', amount: 85000, provider: 'MOOV', status: 'SUCCESS', isEscrowed: true, createdAt: new Date(Date.now() - 86400000).toISOString(), order: { id: 'ord_2', totalAmount: 85000 } },
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Finance & Escrow</h1>
        <p className="text-slate-400 mt-1">Supervisez les fonds séquestrés (Escrow) et les flux financiers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Total Séquestré (Escrow Actif)</p>
          <h3 className="text-3xl font-bold text-white">{loading ? '...' : formatCurrency(finance.totalEscrow)}</h3>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">Fonds actuellement en Escrow</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="px-6 py-4">ID Paiement</th>
                <th className="px-6 py-4">Commande liée</th>
                <th className="px-6 py-4">Montant</th>
                <th className="px-6 py-4">Provider</th>
                <th className="px-6 py-4">Date de dépôt</th>
                <th className="px-6 py-4 text-right">Action (Urgence)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Chargement des transactions...
                  </td>
                </tr>
              ) : (
                finance.recentEscrowPayments.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{p.id}</td>
                    <td className="px-6 py-4">
                      <span className="text-primary-400 hover:underline cursor-pointer">#{p.order.id}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">{formatCurrency(p.amount)}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-800 px-2 py-1 rounded text-xs font-medium text-slate-300">{p.provider}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      {/* Forcer la libération (uniquement pour Super Admin ou en cas de litige résolu) */}
                      <button className="text-red-400 hover:text-red-300 text-xs font-medium bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ml-auto">
                        <ArrowUpRight className="w-3 h-3" />
                        Forcer Libération
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
