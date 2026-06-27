'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, FileText, Save, CheckCircle, AlertCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import { updateProfile } from '@/app/actions/profile';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProfilePage() {
  const { user, fetchProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        phone: user.phone || '',
        bio: user.profile?.bio || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const result = await updateProfile(formData);

    if (result.success) {
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès.' });
      await fetchProfile(); // Refresh global state
    } else {
      setMessage({ type: 'error', text: result.error || 'Erreur inconnue.' });
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
        <p className="text-slate-400 mb-8">Gérez vos informations personnelles et vos préférences.</p>

        <GlassCard className="p-8 border border-white/5">
          {message && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${
                message.type === 'success' 
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}
            >
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <p>{message.text}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Prénom"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                icon={<User size={18} className="text-slate-400" />}
                placeholder="Votre prénom"
              />
              <Input
                label="Nom"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                icon={<User size={18} className="text-slate-400" />}
                placeholder="Votre nom"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email"
                name="email"
                value={user?.email || ''}
                readOnly
                disabled
                icon={<Mail size={18} className="text-slate-400" />}
                placeholder="votre@email.com"
              />
              <Input
                label="Téléphone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                icon={<Phone size={18} className="text-slate-400" />}
                placeholder="+228 90 00 00 00"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 block">Biographie</label>
              <div className="relative">
                <div className="absolute top-3 left-4 pointer-events-none">
                  <FileText size={18} className="text-slate-400" />
                </div>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
                  placeholder="Parlez-nous de vous, vos compétences..."
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                type="submit" 
                isLoading={isLoading} 
                icon={<Save size={18} />}
              >
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
