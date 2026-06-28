'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Mail, Phone, Calendar, ArrowLeft, Star, MessageSquare, FileText } from 'lucide-react';
import { getPublicSoloProfile } from '@/app/actions/annuaire';

export default function SoloProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!params.id) return;
      const res = await getPublicSoloProfile(params.id as string);
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
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Prestataire introuvable</h2>
        <Button onClick={() => router.push('/annuaire')} className="bg-primary-600 hover:bg-primary-500 text-white">
          Retourner à l'annuaire
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-slate-900 relative z-10">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/annuaire')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 font-semibold transition-colors"
        >
          <ArrowLeft size={16} /> Retour à l'annuaire
        </button>

        <Card className="p-8 bg-white border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            <img
              src={profile.avatarUrl || 'https://placehold.co/200x200/D49A25/FFFFFF/png?text=' + encodeURIComponent(profile.name)}
              alt={profile.name}
              className="w-32 h-32 rounded-3xl object-cover border border-slate-100 shadow-sm"
            />
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-extrabold text-slate-950">{profile.name}</h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  INDÉPENDANT / SOLO
                </span>
                {profile.isVerified && (
                  <span className="flex items-center gap-0.5 text-xs text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full font-semibold">
                    <ShieldCheck size={14} /> Vérifié
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-slate-800">4.9</span>
                <span className="text-slate-400 text-xs">(Avis client)</span>
              </div>

              <p className="text-slate-600 mb-6 max-w-xl">
                {profile.bio || 'Aucune description disponible pour ce prestataire.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-t border-slate-100 max-w-md">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={16} />
                  <span className="text-sm">{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone size={16} />
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Action Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950 mb-2 flex items-center gap-2">
                <MessageSquare className="text-primary-600" /> Messagerie Directe
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Envoyez un message de prise de contact direct pour échanger sur vos besoins.
              </p>
            </div>
            <Button onClick={() => alert('Prise de contact directe simulée !')} className="w-full bg-primary-600 hover:bg-primary-500 text-white font-semibold">
              Contacter le prestataire
            </Button>
          </Card>

          <Card className="p-6 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950 mb-2 flex items-center gap-2">
                <FileText className="text-primary-600" /> Demande de Devis
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Envoyez une demande de devis structurée pour ce prestataire pour une mission de service.
              </p>
            </div>
            <Button onClick={() => alert('Demande de devis simulée !')} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold">
              Demander un devis
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
