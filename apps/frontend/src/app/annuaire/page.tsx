'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, User, Building2, ShieldCheck, Star, Users } from 'lucide-react';
import { searchAnnuaire } from '@/app/actions/annuaire';

export default function AnnuairePage() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [type, setType] = useState<'ALL' | 'SOLO' | 'COMPANY'>('ALL');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    setLoading(true);
    const queryType = type === 'ALL' ? undefined : type;
    const res = await searchAnnuaire({ q, type: queryType, verifiedOnly });
    if (res.success) {
      setResults(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, [type, verifiedOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults();
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-slate-900 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight mb-4">
            Annuaire des Professionnels & Artisans
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Trouvez des spécialistes indépendants, des entreprises qualifiées et des collectifs d'artisans au Togo.
          </p>
        </div>

        {/* Search & Filters */}
        <Card className="p-6 bg-white border border-slate-200 shadow-sm mb-10 max-w-4xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Rechercher un métier, un nom ou une compétence..."
                  icon={<Search size={18} className="text-slate-400" />}
                  className="bg-slate-50 border-slate-200 text-slate-900 focus:bg-white w-full"
                />
              </div>
              <Button type="submit" className="bg-primary-600 hover:bg-primary-500 text-white font-semibold">
                Rechercher
              </Button>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setType('ALL')}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                    type === 'ALL'
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Tous
                </button>
                <button
                  type="button"
                  onClick={() => setType('SOLO')}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all flex items-center gap-1.5 ${
                    type === 'SOLO'
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <User size={15} /> Indépendants / Solos
                </button>
                <button
                  type="button"
                  onClick={() => setType('COMPANY')}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all flex items-center gap-1.5 ${
                    type === 'COMPANY'
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Building2 size={15} /> Entreprises & Collectifs
                </button>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-slate-600 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                Profils vérifiés uniquement
              </label>
            </div>
          </form>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl max-w-xl mx-auto shadow-sm">
            <p className="text-slate-500 text-lg">Aucun professionnel ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((prof) => (
              <Card key={prof.id} className="bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between p-6">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <img
                      src={prof.logoUrl}
                      alt={prof.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-100"
                    />
                    
                    <div className="flex flex-col gap-1 items-end">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        prof.type === 'COMPANY'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {prof.type === 'COMPANY' 
                          ? (prof.isInformal ? 'COLLECTIF' : 'ENTREPRISE') 
                          : 'INDÉPENDANT'}
                      </span>

                      {prof.isVerified && (
                        <span className="flex items-center gap-0.5 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-semibold">
                          <ShieldCheck size={12} /> Vérifié
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1">{prof.name}</h3>
                  
                  <div className="flex items-center gap-1 mb-3">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-semibold text-slate-800">{prof.rating}</span>
                    <span className="text-slate-400 text-xs">(Avis fictif)</span>
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-3 mb-6">
                    {prof.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs text-slate-400">{prof.address}</span>
                  <button
                    onClick={() => router.push(`/annuaire/${prof.type.toLowerCase()}/${prof.id}`)}
                    className="text-primary-600 hover:text-primary-500 font-bold text-sm transition-colors"
                  >
                    Voir le profil →
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
