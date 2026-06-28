'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, Video, Clock, Check, X, RefreshCw } from 'lucide-react';
import { getClientBookings, getProviderBookings, updateBookingStatus, setAvailability, createVideoSession } from '@/app/actions/appointments';

export default function AppointmentsPage() {
  const [clientBookings, setClientBookings] = useState<any[]>([]);
  const [providerBookings, setProviderBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form for availability settings
  const [availabilities, setAvailabilities] = useState<any[]>([
    { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' },
    { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
    { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' },
    { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' },
    { dayOfWeek: 5, startTime: '09:00', endTime: '18:00' },
  ]);

  const fetchData = async () => {
    setLoading(true);
    const clientRes = await getClientBookings();
    const providerRes = await getProviderBookings();
    
    if (clientRes.success) setClientBookings(clientRes.data);
    if (providerRes.success) setProviderBookings(providerRes.data);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id: string, status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') => {
    const res = await updateBookingStatus(id, status);
    if (res.success) {
      alert(`Statut mis à jour : ${status}`);
      fetchData();
    } else {
      alert('Erreur lors de la mise à jour.');
    }
  };

  const handleSetAvailability = async () => {
    const res = await setAvailability(availabilities);
    if (res.success) {
      alert('Disponibilités enregistrées !');
    } else {
      alert("Erreur lors de l'enregistrement.");
    }
  };

  const handleStartVideo = async (bookingId: string) => {
    const res = await createVideoSession(bookingId);
    if (res.success) {
      alert(`Lien vidéo généré : /dashboard/video/${bookingId}`);
      window.open(`/dashboard/video/${bookingId}`, '_blank');
    } else {
      alert("Impossible de démarrer la session vidéo.");
    }
  };

  return (
    <div className="space-y-8 text-slate-900">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">Mon Agenda & RDV</h1>
          <p className="text-slate-500 mt-1">Gérez vos rendez-vous et vos consultations vidéo.</p>
        </div>
        <Button onClick={fetchData} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700">
          <RefreshCw size={16} /> Rafraîchir
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle Column: Bookings list */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client bookings */}
          <Card className="p-6 bg-white border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950 mb-4 flex items-center gap-2">
              <Calendar className="text-primary-600" /> Mes consultations réservées (Client)
            </h2>
            {loading ? (
              <p className="text-slate-500">Chargement...</p>
            ) : clientBookings.length === 0 ? (
              <p className="text-slate-500">Aucun rendez-vous pris.</p>
            ) : (
              <div className="space-y-4">
                {clientBookings.map((b) => (
                  <div key={b.id} className="p-4 border border-slate-100 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-950">
                        Avec {b.provider?.profile?.firstName} {b.provider?.profile?.lastName}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Clock size={12} /> {new Date(b.dateTime).toLocaleString()}
                      </p>
                      <p className="text-xs mt-1">
                        Statut: <span className="font-medium text-primary-600">{b.status}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {b.status === 'CONFIRMED' && (
                        <Button onClick={() => handleStartVideo(b.id)} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1 flex items-center gap-1">
                          <Video size={14} /> Rejoindre l'appel
                        </Button>
                      )}
                      {b.status === 'PENDING' && (
                        <Button onClick={() => handleStatusUpdate(b.id, 'CANCELLED')} className="bg-red-50 text-red-600 hover:bg-red-100 text-xs px-3 py-1">
                          Annuler
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Provider bookings */}
          <Card className="p-6 bg-white border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950 mb-4 flex items-center gap-2">
              <Calendar className="text-primary-600" /> Consultations reçues (Prestataire)
            </h2>
            {loading ? (
              <p className="text-slate-500">Chargement...</p>
            ) : providerBookings.length === 0 ? (
              <p className="text-slate-500">Aucune demande de rendez-vous reçue.</p>
            ) : (
              <div className="space-y-4">
                {providerBookings.map((b) => (
                  <div key={b.id} className="p-4 border border-slate-100 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-950">
                        Client: {b.client?.profile?.firstName} {b.client?.profile?.lastName}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Clock size={12} /> {new Date(b.dateTime).toLocaleString()}
                      </p>
                      <p className="text-xs mt-1">
                        Statut: <span className="font-medium text-primary-600">{b.status}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {b.status === 'PENDING' && (
                        <>
                          <Button onClick={() => handleStatusUpdate(b.id, 'CONFIRMED')} className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1 flex items-center gap-1">
                            <Check size={14} /> Confirmer
                          </Button>
                          <Button onClick={() => handleStatusUpdate(b.id, 'CANCELLED')} className="bg-red-50 text-red-600 hover:bg-red-100 text-xs px-3 py-1">
                            Refuser
                          </Button>
                        </>
                      )}
                      {b.status === 'CONFIRMED' && (
                        <>
                          <Button onClick={() => handleStartVideo(b.id)} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1 flex items-center gap-1">
                            <Video size={14} /> Démarrer l'appel
                          </Button>
                          <Button onClick={() => handleStatusUpdate(b.id, 'COMPLETED')} className="bg-green-100 text-green-800 hover:bg-green-200 text-xs px-3 py-1">
                            Terminer la séance
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Availability Template setup */}
        <div className="space-y-6">
          <Card className="p-6 bg-white border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950 mb-2">Disponibilités récurrentes</h2>
            <p className="text-xs text-slate-500 mb-4">Définissez vos horaires d'ouverture pour la réservation en ligne.</p>

            <div className="space-y-3">
              {[
                { day: 1, label: 'Lundi' },
                { day: 2, label: 'Mardi' },
                { day: 3, label: 'Mercredi' },
                { day: 4, label: 'Jeudi' },
                { day: 5, label: 'Vendredi' },
              ].map((d) => {
                const av = availabilities.find(a => a.dayOfWeek === d.day) || { startTime: '09:00', endTime: '18:00' };
                return (
                  <div key={d.day} className="flex items-center justify-between gap-2 border-b border-slate-50 pb-2">
                    <span className="text-sm font-medium text-slate-700 w-20">{d.label}</span>
                    <input 
                      type="text" 
                      placeholder="09:00" 
                      defaultValue={av.startTime}
                      onChange={(e) => {
                        const updated = availabilities.map(a => a.dayOfWeek === d.day ? { ...a, startTime: e.target.value } : a);
                        setAvailabilities(updated);
                      }}
                      className="border border-slate-200 rounded p-1 text-xs w-16 text-center"
                    />
                    <span className="text-xs text-slate-400">à</span>
                    <input 
                      type="text" 
                      placeholder="18:00" 
                      defaultValue={av.endTime}
                      onChange={(e) => {
                        const updated = availabilities.map(a => a.dayOfWeek === d.day ? { ...a, endTime: e.target.value } : a);
                        setAvailabilities(updated);
                      }}
                      className="border border-slate-200 rounded p-1 text-xs w-16 text-center"
                    />
                  </div>
                );
              })}

              <Button onClick={handleSetAvailability} className="w-full bg-primary-600 hover:bg-primary-500 text-white font-semibold mt-4">
                Enregistrer les horaires
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
