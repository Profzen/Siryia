"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Car, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const mockVehicles = [
  {
    id: 1,
    make: "Toyota",
    model: "Corolla",
    year: 2021,
    type: "Berline",
    dailyRate: "25 000 FCFA",
    location: "Lomé, Togo",
    status: "Disponible",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    make: "Hyundai",
    model: "Tucson",
    year: 2022,
    type: "SUV",
    dailyRate: "45 000 FCFA",
    location: "Lomé, Togo",
    status: "Disponible",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    make: "Mercedes-Benz",
    model: "Sprinter",
    year: 2019,
    type: "Utilitaire",
    dailyRate: "60 000 FCFA",
    location: "Lomé, Togo",
    status: "Loué",
    image: "https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?auto=format&fit=crop&w=800&q=80"
  }
];

export default function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVehicles = mockVehicles.filter(v => 
    `${v.make} ${v.model}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-primary-600 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Retour à l'accueil
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Location de véhicules</h1>
            <p className="text-slate-500 max-w-xl">
              Trouvez le véhicule adapté à vos besoins parmi notre flotte partenaire. Réservez en ligne facilement et en toute sécurité.
            </p>
          </div>
          <div className="w-full md:w-80">
            <Input 
              placeholder="Rechercher (ex: SUV, Toyota...)" 
              icon={<Search className="w-4 h-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group">
              <div className="relative h-48 overflow-hidden bg-slate-200">
                <img 
                  src={vehicle.image} 
                  alt={`${vehicle.make} ${vehicle.model}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-slate-900 shadow-sm">
                  {vehicle.type}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{vehicle.make} {vehicle.model}</h2>
                    <p className="text-slate-500 text-sm mt-1">{vehicle.year}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-600">{vehicle.dailyRate}</div>
                    <div className="text-xs text-slate-500">/ jour</div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                    {vehicle.location}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    Statut: <span className={`ml-1 font-medium ${vehicle.status === 'Disponible' ? 'text-green-600' : 'text-amber-600'}`}>
                      {vehicle.status}
                    </span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  disabled={vehicle.status !== 'Disponible'}
                  onClick={() => alert("Tunnel de réservation en construction (Sprint 2.3)")}
                >
                  <Car className="w-4 h-4 mr-2" />
                  {vehicle.status === 'Disponible' ? 'Réserver ce véhicule' : 'Indisponible'}
                </Button>
              </div>
            </div>
          ))}

          {filteredVehicles.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-100">
              <p className="text-slate-500">Aucun véhicule ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
