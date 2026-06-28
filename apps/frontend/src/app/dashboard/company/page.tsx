'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Building2, Users, Save, Plus, Mail, ShieldAlert, CheckCircle, AlertCircle } from 'lucide-react';
import { createCompany, getMyCompanies, updateCompany, inviteMember } from '@/app/actions/company';

export default function CompanyDashboardPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Creation Form State
  const [showCreate, setShowCreate] = useState(false);
  const [isInformal, setIsInformal] = useState(false);
  const [newCompanyData, setNewCompanyData] = useState({
    name: '',
    bio: '',
    phone: '',
    email: '',
    address: '',
    rccm: '',
    taxId: '',
  });

  // Invitation Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('EMPLOYEE');

  // Messages
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchCompanies = async () => {
    setLoading(true);
    const result = await getMyCompanies();
    if (result.success) {
      setCompanies(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage(null);

    const result = await createCompany({
      ...newCompanyData,
      isInformal,
    });

    if (result.success) {
      setMessage({ type: 'success', text: 'Structure créée avec succès !' });
      setShowCreate(false);
      setNewCompanyData({ name: '', bio: '', phone: '', email: '', address: '', rccm: '', taxId: '' });
      await fetchCompanies();
    } else {
      setMessage({ type: 'error', text: result.error });
    }
    setActionLoading(false);
  };

  const handleInviteSubmit = async (e: React.FormEvent, companyId: string) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setActionLoading(true);
    setMessage(null);

    const result = await inviteMember(companyId, inviteEmail, inviteRole);

    if (result.success) {
      setMessage({ type: 'success', text: 'Collaborateur invité avec succès !' });
      setInviteEmail('');
      await fetchCompanies();
    } else {
      setMessage({ type: 'error', text: result.error });
    }
    setActionLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Active Company
  const company = companies[0];

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Mon Entreprise / Collectif</h1>
      <p className="text-slate-500 mb-8">Gérez vos activités professionnelles en équipe ou créez votre structure.</p>

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

      {!company && !showCreate && (
        <Card className="p-10 text-center bg-white border border-slate-200 shadow-sm max-w-xl mx-auto">
          <Building2 size={48} className="mx-auto text-slate-400 mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Vous n'avez pas encore de structure</h2>
          <p className="text-slate-500 mb-6">
            Créez une Entreprise Formelle (avec RCCM) ou un Collectif Informel (artisanat, groupe d'indépendants) pour proposer vos services en équipe.
          </p>
          <Button onClick={() => setShowCreate(true)} className="bg-primary-600 hover:bg-primary-500 text-white">
            <Plus size={18} className="mr-2" /> Créer une structure
          </Button>
        </Card>
      )}

      {showCreate && (
        <Card className="p-8 bg-white border border-slate-200 shadow-sm max-w-2xl mx-auto text-slate-900">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Créer une nouvelle structure</h2>
            <button onClick={() => setShowCreate(false)} className="text-slate-500 hover:text-slate-800">Annuler</button>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setIsInformal(false)}
              className={`flex-1 p-4 rounded-xl border text-center transition-all ${
                !isInformal
                  ? 'border-primary-600 bg-primary-50 text-primary-700 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-500'
              }`}
            >
              Entreprise Formelle (avec RCCM)
            </button>
            <button
              type="button"
              onClick={() => setIsInformal(true)}
              className={`flex-1 p-4 rounded-xl border text-center transition-all ${
                isInformal
                  ? 'border-primary-600 bg-primary-50 text-primary-700 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-500'
              }`}
            >
              Collectif Informel
            </button>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Nom de la structure</label>
              <Input
                required
                value={newCompanyData.name}
                onChange={(e) => setNewCompanyData({ ...newCompanyData, name: e.target.value })}
                placeholder="Ex: Coopérative des Artisans de Lomé"
                className="bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Téléphone de contact</label>
                <Input
                  value={newCompanyData.phone}
                  onChange={(e) => setNewCompanyData({ ...newCompanyData, phone: e.target.value })}
                  placeholder="+228 90 00 00 00"
                  className="bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Email de contact</label>
                <Input
                  type="email"
                  value={newCompanyData.email}
                  onChange={(e) => setNewCompanyData({ ...newCompanyData, email: e.target.value })}
                  placeholder="contact@artisan.tg"
                  className="bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                />
              </div>
            </div>

            {!isInformal && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Registre du Commerce (RCCM)</label>
                  <Input
                    required={!isInformal}
                    value={newCompanyData.rccm}
                    onChange={(e) => setNewCompanyData({ ...newCompanyData, rccm: e.target.value })}
                    placeholder="Ex: TG-LOM-2026-B-1234"
                    className="bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Numéro d'Identification Fiscale (NIF)</label>
                  <Input
                    required={!isInformal}
                    value={newCompanyData.taxId}
                    onChange={(e) => setNewCompanyData({ ...newCompanyData, taxId: e.target.value })}
                    placeholder="Ex: 1000123456"
                    className="bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Adresse physique</label>
              <Input
                value={newCompanyData.address}
                onChange={(e) => setNewCompanyData({ ...newCompanyData, address: e.target.value })}
                placeholder="Lomé, Quartier Dékon, Togo"
                className="bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Présentation / Description</label>
              <textarea
                value={newCompanyData.bio}
                onChange={(e) => setNewCompanyData({ ...newCompanyData, bio: e.target.value })}
                rows={3}
                placeholder="Décrivez votre groupe, votre expertise, vos valeurs..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
              />
            </div>

            <Button type="submit" isLoading={actionLoading} className="w-full bg-primary-600 hover:bg-primary-500 text-white">
              Créer la structure
            </Button>
          </form>
        </Card>
      )}

      {company && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-slate-900">
          {/* Company Details Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 bg-white border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Building2 className="text-primary-600" /> Profil de la structure
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  company.isInformal 
                    ? 'bg-blue-100 text-blue-800'
                    : company.kybStatus === 'VERIFIED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {company.isInformal ? 'Collectif Informel' : `KYB: ${company.kybStatus}`}
                </span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Nom</span>
                    <p className="text-slate-900 font-medium">{company.name}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Type</span>
                    <p className="text-slate-900 font-medium">{company.isInformal ? 'Collectif Libre' : 'Entreprise Enregistrée'}</p>
                  </div>
                </div>

                {!company.isInformal && (
                  <div className="grid grid-cols-2 gap-4 py-2 border-t border-slate-100">
                    <div>
                      <span className="text-xs text-slate-400 block mb-1">RCCM</span>
                      <p className="text-slate-900 font-mono text-sm">{company.rccm || 'Non spécifié'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block mb-1">NIF</span>
                      <p className="text-slate-900 font-mono text-sm">{company.taxId || 'Non spécifié'}</p>
                    </div>
                  </div>
                )}

                <div className="py-2 border-t border-slate-100">
                  <span className="text-xs text-slate-400 block mb-1">Présentation / Bio</span>
                  <p className="text-slate-700 text-sm">{company.bio || 'Aucune description fournie.'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-2 border-t border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Téléphone de contact</span>
                    <p className="text-slate-700 text-sm">{company.phone || 'Non configuré'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Email de contact</span>
                    <p className="text-slate-700 text-sm">{company.email || 'Non configuré'}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Members & Team */}
          <div className="space-y-6">
            {/* Team List Card */}
            <Card className="p-8 bg-white border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Users className="text-primary-600" /> Équipe ({company.members?.length || 0})
              </h3>
              
              <ul className="divide-y divide-slate-100 mb-6">
                {company.members?.map((m: any) => (
                  <li key={m.userId} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">
                        {m.user?.profile?.firstName || m.user?.profile?.lastName
                          ? `${m.user.profile.firstName || ''} ${m.user.profile.lastName || ''}`.trim()
                          : m.user?.email}
                      </p>
                      <p className="text-xs text-slate-400">{m.user?.email}</p>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-medium">
                      {m.role}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Invite Form */}
              <form onSubmit={(e) => handleInviteSubmit(e, company.id)} className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-700">Inviter un nouveau membre</h4>
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      required
                      type="email"
                      placeholder="email@collaborateur.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      icon={<Mail size={16} className="text-slate-400" />}
                      className="bg-slate-50 border-slate-200 text-slate-900 focus:bg-white text-sm"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="flex-1 h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm text-slate-900 focus:outline-none focus:border-primary-500"
                    >
                      <option value="EMPLOYEE">Employé / Membre</option>
                      <option value="ADMIN">Administrateur</option>
                    </select>
                    
                    <Button type="submit" isLoading={actionLoading} className="bg-primary-600 hover:bg-primary-500 text-white px-4">
                      Inviter
                    </Button>
                  </div>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
