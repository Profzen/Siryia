'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';
import { getVideoSession, updateBookingStatus } from '@/app/actions/appointments';

export default function VideoCallPage() {
  const params = useParams();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      if (!params.bookingId) return;
      const res = await getVideoSession(params.bookingId as string);
      if (res.success) {
        setSession(res.data);
      }
      setLoading(false);
    };
    fetchSession();
  }, [params.bookingId]);

  const handleHangUp = async () => {
    if (params.bookingId) {
      await updateBookingStatus(params.bookingId as string, 'COMPLETED');
    }
    router.push('/dashboard/appointments');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-900 text-white">
        <p>Connexion à la salle de visioconférence...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6">
      {/* Top bar */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold">Téléconsultation en ligne</h1>
          <p className="text-xs text-slate-400">Salon sécurisé : {session?.roomName || 'Siryia Room'}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs text-slate-300">En direct (sécurisé)</span>
        </div>
      </div>

      {/* Main Video Grid */}
      <div className="flex-1 my-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Remote participant */}
        <div className="relative aspect-video bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
          {joined ? (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <span className="text-lg text-slate-400">Participant distant connecté</span>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-slate-400 text-sm">En attente de l'autre participant...</p>
            </div>
          )}
          <span className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-lg text-xs font-semibold">
            Prestataire / Patient
          </span>
        </div>

        {/* Local participant */}
        <div className="relative aspect-video bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
          {videoActive ? (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <Video className="text-primary-500 animate-pulse" size={48} />
              <span className="absolute text-xs text-slate-400 top-4">Caméra active</span>
            </div>
          ) : (
            <div className="text-center">
              <VideoOff className="text-red-500 mx-auto mb-2" size={32} />
              <p className="text-slate-400 text-sm">Votre caméra est coupée</p>
            </div>
          )}
          <span className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-lg text-xs font-semibold">
            Vous
          </span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl max-w-xl mx-auto w-full flex justify-around items-center">
        <Button
          onClick={() => setMicActive(!micActive)}
          className={`rounded-full p-4 ${micActive ? 'bg-slate-800 hover:bg-slate-700' : 'bg-red-600 hover:bg-red-500'}`}
        >
          {micActive ? <Mic size={20} /> : <MicOff size={20} />}
        </Button>

        {!joined ? (
          <Button
            onClick={() => setJoined(true)}
            className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6"
          >
            Rejoindre la réunion
          </Button>
        ) : (
          <Button
            onClick={() => setJoined(false)}
            className="bg-slate-800 hover:bg-slate-700 text-white px-6"
          >
            Quitter le salon
          </Button>
        )}

        <Button
          onClick={() => setVideoActive(!videoActive)}
          className={`rounded-full p-4 ${videoActive ? 'bg-slate-800 hover:bg-slate-700' : 'bg-red-600 hover:bg-red-500'}`}
        >
          {videoActive ? <Video size={20} /> : <VideoOff size={20} />}
        </Button>

        <Button
          onClick={handleHangUp}
          className="rounded-full p-4 bg-red-600 hover:bg-red-500 text-white"
        >
          <PhoneOff size={20} />
        </Button>
      </div>
    </div>
  );
}
