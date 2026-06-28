'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Car, Key, Shield, DollarSign, Calendar, Search } from 'lucide-react';
import { getVehicles, rentVehicle, buyVehicle, createVehicle } from '@/app/actions/vehicles';

export default function VehiclesMarketplacePage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterType, setFilterType] = useState('ALL');
  const [isForRent, setIsForRent] = useState<boolean | undefined>(undefined);
  const [isForSale, setIsForSale] = useState<boolean | undefined>(undefined);

  // New vehicle form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    type: 'CAR',
    make: '',
    model: '',
    year: '2022',
    dailyRate: '25000',
    isForRent: true,
    isForSale: false,
    salePrice: '5000000',
  });

  const fetchVehicles = async () => {
    setLoading(true);
    const res = await getVehicles({
      type: filterType === 'ALL' ? undefined : filterType,
      isForRent,
      isForSale,
    });
    if (res.success) {
      setVehicles(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, [filterType, isForRent, isForSale]);

  const handleRent = async (vehicleId: string, dailyRate: number) => {
    const days = 3;
    const res = await rentVehicle({
      vehicleId,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
      totalAmount: dailyRate * days,
    });
    if (res.success) {
      alert('Location initiée avec succès ! Le contrat a été généré.');
      fetchVehicles();
    } else {
      alert('Erreur lors de la location.');
    }
  };

  const handleBuy = async (vehicleId: string) => {
    const res = await buyVehicle(vehicleId);
    if (res.success) {
      alert(res.data.message || 'Véhicule acheté !');
      fetchVehicles();
    } else {
      alert("Erreur lors de l'achat.");
    }
  };

  const handleCreate = async () => {
    const res = await createVehicle({
      ...newVehicle,
      dailyRate: parseFloat(newVehicle.dailyRate),
      salePrice: newVehicle.isForSale ? parseFloat(newVehicle.salePrice) : null,
    });
    if (res.success) {
      alert('Véhicule publié avec succès !');
      setShowAddForm(false);
      fetchVehicles();
    } else {
      alert("Erreur lors de la publication.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight">Véhicules Siryia</h1>
            <p className="text-slate-500 mt-1">Louez ou achetez des voitures, motos et utilitaires au Togo.</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-primary-600 hover:bg-primary-500 text-white font-semibold">
            {showAddForm ? 'Fermer le formulaire' : 'Publier un véhicule'}
          </Button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <Card className="p-6 bg-white border border-slate-200 shadow-sm max-w-lg">
            <h3 className="text-lg font-bold text-slate-950 mb-4">Enregistrer mon véhicule</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold">Marque</label>
                  <input type="text" className="w-full border border-slate-200 rounded p-2 text-sm bg-white" placeholder="Toyota" onChange={e => setNewVehicle({...newVehicle, make: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-semibold">Modèle</label>
                  <input type="text" className="w-full border border-slate-200 rounded p-2 text-sm bg-white" placeholder="Corolla" onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold">Année</label>
                  <input type="number" className="w-full border border-slate-200 rounded p-2 text-sm bg-white" defaultValue="2022" onChange={e => setNewVehicle({...newVehicle, year: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-semibold">Type de véhicule</label>
                  <select className="w-full border border-slate-200 rounded p-2 text-sm bg-white" onChange={e => setNewVehicle({...newVehicle, type: e.target.value})}>
                    <option value="CAR">Voiture</option>
                    <option value="MOTORCYCLE">Moto</option>
                    <option value="TRUCK">Camion</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" defaultChecked onChange={e => setNewVehicle({...newVehicle, isForRent: e.target.checked})} />
                  Proposer à la location (Prix/jour XOF)
                </label>
              </div>
              <input type="number" className="w-full border border-slate-200 rounded p-2 text-sm bg-white" placeholder="Tarif journalier (XOF)" defaultValue="25000" onChange={e => setNewVehicle({...newVehicle, dailyRate: e.target.value})} />

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" onChange={e => setNewVehicle({...newVehicle, isForSale: e.target.checked})} />
                  Proposer à la vente (Prix de vente XOF)
                </label>
              </div>
              <input type="number" className="w-full border border-slate-200 rounded p-2 text-sm bg-white" placeholder="Prix de vente (XOF)" defaultValue="5000000" onChange={e => setNewVehicle({...newVehicle, salePrice: e.target.value})} />

              <Button onClick={handleCreate} className="w-full bg-primary-600 hover:bg-primary-500 text-white font-semibold">
                Soumettre le véhicule
              </Button>
            </div>
          </Card>
        )}

        {/* Filters */}
        <div className="flex gap-4 flex-wrap bg-white p-4 rounded-xl border border-slate-200 shadow-sm items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => setFilterType('ALL')} className={`text-xs ${filterType === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>Tous</Button>
            <Button onClick={() => setFilterType('CAR')} className={`text-xs ${filterType === 'CAR' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>Voitures</Button>
            <Button onClick={() => setFilterType('MOTORCYCLE')} className={`text-xs ${filterType === 'MOTORCYCLE' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>Motos</Button>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <input type="checkbox" onChange={e => {
                setIsForRent(e.target.checked ? true : undefined);
              }} /> Location
            </label>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <input type="checkbox" onChange={e => {
                setIsForSale(e.target.checked ? true : undefined);
              }} /> Vente
            </label>
          </div>
        </div>

        {/* Vehicle List */}
        {loading ? (
          <p className="text-slate-500">Chargement...</p>
        ) : vehicles.length === 0 ? (
          <p className="text-slate-500">Aucun véhicule trouvé correspondant aux critères.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <Card key={v.id} className="p-4 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <img
                    src="https://placehold.co/400x250/17519B/FFFFFF/png?text=Vehicule"
                    alt={v.model}
                    className="w-full h-40 object-cover rounded-xl mb-4 border border-slate-100"
                  />
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-950">{v.make} {v.model}</h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">{v.year}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                    Proposé par {v.owner?.profile?.firstName || 'Utilisateur'}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3">
                  {v.isForRent && (
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs text-slate-400">Location</span>
                        <p className="font-extrabold text-slate-900 text-sm">{v.dailyRate} XOF / jour</p>
                      </div>
                      <Button onClick={() => handleRent(v.id, v.dailyRate)} className="bg-primary-600 hover:bg-primary-500 text-white text-xs px-3 py-1 flex items-center gap-1 font-semibold">
                        <Key size={12} /> Louer (3j)
                      </Button>
                    </div>
                  )}

                  {v.isForSale && (
                    <div className="flex justify-between items-center border-t border-slate-50 pt-2">
                      <div>
                        <span className="text-xs text-slate-400">Vente</span>
                        <p className="font-extrabold text-slate-900 text-sm">{v.salePrice} XOF</p>
                      </div>
                      <Button onClick={() => handleBuy(v.id)} className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1 flex items-center gap-1 font-semibold">
                        <DollarSign size={12} /> Acheter
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
