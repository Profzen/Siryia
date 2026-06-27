'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useCartStore } from '@/store/useCartStore';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${params.id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Failed to fetch product', error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: quantity,
        sellerId: product.sellerId,
        imageUrl: product.images?.[0],
      });
      alert('Produit ajouté au panier !');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 px-4 text-center text-white">
        Produit introuvable.
      </div>
    );
  }

  const imageUrl = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://placehold.co/800x800/111111/FFFFFF/png?text=No+Image';

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white mb-8 flex items-center transition-colors"
        >
          ← Retour à la marketplace
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden aspect-square">
            <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            {product.category && (
              <span className="text-blue-400 font-semibold tracking-wider uppercase text-sm mb-2">
                {product.category.name}
              </span>
            )}
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{product.title}</h1>
            <p className="text-3xl font-bold text-white mb-8">{product.price.toLocaleString()} FCFA</p>
            
            <div className="prose prose-invert mb-8">
              <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 flex items-center justify-between">
              <div className="text-gray-300">
                <span className="block text-sm">État : <span className="font-semibold text-white">{product.condition}</span></span>
                <span className="block text-sm">Stock : <span className="font-semibold text-white">{product.stock} disponibles</span></span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/5 border border-white/10 rounded-xl flex items-center h-14 px-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center text-white font-semibold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  +
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 h-14 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/30"
              >
                {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
