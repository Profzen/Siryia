"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function DemanderServicePage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/services" className="inline-flex items-center text-slate-500 hover:text-primary-600 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Retour
        </Link>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Publier un besoin</h1>
          <p className="text-slate-500 mb-8">
            Décrivez ce que vous cherchez et recevez des devis de nos professionnels qualifiés.
          </p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-xl text-center">
              <h3 className="font-semibold text-lg mb-2">Demande envoyée !</h3>
              <p>Les professionnels de votre région ont été notifiés. Vous recevrez bientôt des propositions.</p>
              <Button className="mt-6" onClick={() => setSubmitted(false)}>Publier une autre demande</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Titre du besoin</label>
                <Input placeholder="Ex: Rénovation salle de bain, Développement site e-commerce..." required />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Description détaillée</label>
                <textarea 
                  className="flex w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  rows={5}
                  placeholder="Expliquez votre besoin en détail, incluez les dates souhaitées et toute information pertinente..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Budget estimé (Optionnel)</label>
                  <Input type="number" placeholder="FCFA" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Lieu d'intervention</label>
                  <Input placeholder="Ex: Lomé, en ligne..." required />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-lg">
                <Send className="w-5 h-5 mr-2" /> Publier mon besoin
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
