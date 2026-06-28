"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-primary-600 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Retour à l'accueil
        </Link>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Recrutement & Services</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Publiez vos besoins et recevez des propositions de nos artisans et professionnels qualifiés, ou parcourez les missions disponibles.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6">
              <Search size={32} />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Je cherche un prestataire</h2>
            <p className="text-slate-500 mb-8">
              Publiez une demande de service, décrivez votre besoin et comparez les devis.
            </p>
            <Link href="/services/demander" className="mt-auto w-full max-w-xs">
              <Button className="w-full">
                Publier un besoin
              </Button>
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-6">
              <Briefcase size={32} />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Je suis un professionnel</h2>
            <p className="text-slate-500 mb-8">
              Parcourez les offres de missions disponibles, proposez vos services et gagnez de nouveaux clients.
            </p>
            <Link href="/services/missions" className="mt-auto w-full max-w-xs">
              <Button variant="outline" className="w-full">
                Voir les missions
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
