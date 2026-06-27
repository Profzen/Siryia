'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import api from '@/lib/api';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
  const [paymentProvider, setPaymentProvider] = useState<'TMONEY' | 'MOOV'>('TMONEY');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!phone) {
      alert('Veuillez saisir votre numéro de téléphone Mobile Money.');
      return;
    }
    
    setLoading(true);
    try {
      // Map cart items to the DTO expected by backend (productId, quantity)
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const response = await api.post('/orders', { 
        items: orderItems,
        paymentProvider,
        phone
      });
      
      clearCart();
      alert('Commande créée et paiement initié avec succès !');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Checkout failed', error);
      alert(error.response?.data?.message || 'Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex justify-center items-center">
        <div className="text-center bg-white/5 backdrop-blur-md p-10 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Votre panier est vide</h2>
          <p className="text-gray-400 mb-8">Découvrez nos produits sur la marketplace.</p>
          <button
            onClick={() => router.push('/marketplace')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl transition-colors"
          >
            Aller à la boutique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white tracking-tight mb-8">Mon Panier</h1>

        {/* Liste des articles */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 mb-6">
          <ul className="divide-y divide-white/10">
            {items.map((item) => (
              <li key={item.id} className="py-6 flex flex-col sm:flex-row gap-6 items-center">
                <img 
                  src={item.imageUrl || 'https://placehold.co/200x200/111111/FFFFFF/png?text=No+Image'} 
                  alt={item.title} 
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-blue-400 font-bold">{item.price.toLocaleString()} FCFA</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl flex items-center h-12 px-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-white font-semibold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-300 font-medium transition-colors"
                  >
                    Retirer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Options de Paiement Séquestre */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 mb-6 text-white">
          <h2 className="text-xl font-bold mb-4">Mode de Paiement (Séquestre Siryia)</h2>
          <p className="text-gray-400 text-sm mb-6">
            Vos fonds seront bloqués de manière sécurisée par Siryia et ne seront reversés au vendeur qu'une fois que vous aurez confirmé la livraison.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setPaymentProvider('TMONEY')}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                paymentProvider === 'TMONEY'
                  ? 'border-yellow-500 bg-yellow-500/10 text-white'
                  : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <span className="font-bold text-lg">TMoney</span>
              <span className="text-xs mt-1">Togo (T-Money)</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentProvider('MOOV')}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                paymentProvider === 'MOOV'
                  ? 'border-blue-500 bg-blue-500/10 text-white'
                  : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <span className="font-bold text-lg">Moov Money</span>
              <span className="text-xs mt-1">Togo (Flooz)</span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">Numéro Mobile Money (+228...)</label>
            <input
              type="tel"
              placeholder="+228 90 00 00 00"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Sommaire & Validation */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-6 sm:mb-0 text-center sm:text-left">
            <span className="text-gray-400 block mb-1">Total à payer</span>
            <span className="text-3xl font-bold text-white">{getTotal().toLocaleString()} FCFA</span>
          </div>
          
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
            ) : (
              'Valider et Payer'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
