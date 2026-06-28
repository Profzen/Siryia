"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const mockMissions = [
  {
    id: 1,
    title: "Rénovation complète salle de bain (Plomberie + Carrelage)",
    location: "Lomé, Agoè",
    budget: "500 000 FCFA",
    timeAgo: "Il y a 2h",
    description: "Je recherche un plombier et un carreleur pour refaire entièrement ma salle de bain. Fourniture comprise dans le devis si possible.",
  },
  {
    id: 2,
    title: "Création site web e-commerce pour boutique de vêtements",
    location: "En ligne / À distance",
    budget: "À débattre",
    timeAgo: "Il y a 5h",
    description: "Besoin d'un développeur pour créer une boutique en ligne. J'ai déjà les photos des articles et le nom de domaine.",
  },
  {
    id: 3,
    title: "Réparation climatiseur split",
    location: "Lomé, Tokoin",
    budget: "25 000 FCFA",
    timeAgo: "Hier",
    description: "Mon climatiseur ne refroidit plus. Il a besoin d'être rechargé en gaz et nettoyé.",
  }
];

export default function MissionsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMissions = mockMissions.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/services" className="inline-flex items-center text-slate-500 hover:text-primary-600 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Retour
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Missions disponibles</h1>
            <p className="text-slate-500">
              Trouvez des clients et proposez vos services.
            </p>
          </div>
          <div className="w-full md:w-72">
            <Input 
              placeholder="Rechercher une mission..." 
              icon={<Search className="w-4 h-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredMissions.map((mission) => (
            <div key={mission.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">{mission.title}</h2>
                  <p className="text-slate-600 mb-4 line-clamp-2">{mission.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" /> {mission.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" /> {mission.timeAgo}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-start md:items-end gap-3 min-w-[150px]">
                  <span className="font-semibold text-lg text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">
                    {mission.budget}
                  </span>
                  <Button onClick={() => alert("Formulaire de proposition en cours de préparation")} className="w-full">
                    Faire une offre
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filteredMissions.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <p className="text-slate-500">Aucune mission ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
