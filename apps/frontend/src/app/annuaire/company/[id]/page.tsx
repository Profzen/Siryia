'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Mail, Phone, MapPin, ArrowLeft, Star, Users, MessageSquare, FileText } from 'lucide-react';
import { getPublicCompanyProfile } from '@/app/actions/annuaire';

export default function CompanyProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!params.id) return;
      const res = await getPublicCompanyProfile(params.id as string);
      if (res.success) {
        setProfile(res.data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-24 px-4 bg-slate-50 text-slate-900 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Structure introuvable</h2>
        <Button onClick={() => router.push('/annuaire')} className="bg-primary-600 hover:bg-primary-500 text-white">
          Retourner à l'annuaire
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-slate-900 relative z-10">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push('/annuaire')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 font-semibold transition-colors"
        >
          <ArrowLeft size={16} /> Retour à l'annuaire
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Card details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 bg-white border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left mb-6">
                <img
                  src={profile.logoUrl || 'https://placehold.co/200x200/17519B/FFFFFF/png?text=' + encodeURIComponent(profile.name)}
                  alt={profile.name}
                  className="w-24 h-24 rounded-2xl object-cover border border-slate-100 shadow-sm"
                />
                
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                    <h1 className="text-2xl font-extrabold text-slate-950">{profile.name}</h1>
                    {profile.isVerified && (
                      <span className="flex items-center gap-0.5 text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-semibold">
                        <ShieldCheck size={12} /> Vérifié
                      </span>
                    )}
                  </div>

                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 ${
                    profile.isInformal 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {profile.isInformal ? 'COLLECTIF INFORMEL' : 'ENTREPRISE ENREGISTRÉE'}
                  </span>

                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    <Star size={15} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-semibold text-slate-800">4.8</span>
                    <span className="text-slate-400 text-[10px]">(Avis client)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">Description / Présentation</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {profile.bio || 'Aucune description disponible pour cette structure.'}
                  </p>
                </div>

                {!profile.isInformal && (
                  <div className="grid grid-cols-2 gap-4 py-2 border-t border-slate-100">
                    <div>
                      <span className="text-xs text-slate-400 block mb-0.5">RCCM</span>
                      <p className="text-slate-900 font-mono text-xs">{profile.rccm}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block mb-0.5">NIF</span>
                      <p className="text-slate-900 font-mono text-xs">{profile.taxId}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail size={15} />
                    <span className="text-xs">{profile.email || 'Non spécifié'}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone size={15} />
                      <span className="text-xs">{profile.phone}</span>
                    </div>
                  )}
                  {profile.address && (
                    <div className="flex items-center gap-2 text-slate-600 col-span-2">
                      <MapPin size={15} />
                      <span className="text-xs">{profile.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-6 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-950 mb-1 flex items-center gap-2">
                    <MessageSquare size={18} className="text-primary-600" /> Contacter l'équipe
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Échangez directement avec un représentant ou le gérant de la structure.
                  </p>
                </div>
                <Button onClick={() => alert('Prise de contact directe avec la structure !')} className="w-full bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold">
                  Contacter la structure
                </Button>
              </Card>

              <Card className="p-6 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-950 mb-1 flex items-center gap-2">
                    <FileText size={18} className="text-primary-600" /> Demande de Devis d'équipe
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Demandez une proposition commerciale formalisée pour un projet ou service complexe.
                  </p>
                </div>
                <Button onClick={() => alert('Demande de devis d\'équipe simulée !')} className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold">
                  Demander un devis
                </Button>
              </Card>
            </div>
          </div>

          {/* Members Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-950 mb-4 flex items-center gap-2">
                <Users className="text-primary-600" /> Membres de l'équipe ({profile.members?.length || 0})
              </h3>
              
              <ul className="divide-y divide-slate-100">
                {profile.members?.map((m: any) => (
                  <li key={m.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-900 text-xs">{m.name}</p>
                      <p className="text-[10px] text-slate-400">{m.email}</p>
                    </div>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                      {m.role}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
