import React from 'react';
import Link from 'next/link';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    images?: string[];
    category?: {
      name: string;
    };
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://placehold.co/400x400/111111/FFFFFF/png?text=No+Image';

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 group">
      <Link href={`/marketplace/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-black/20">
          <img
            src={imageUrl}
            alt={product.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>
      <div className="p-5">
        {product.category && (
          <span className="text-xs text-blue-400 uppercase tracking-wider font-semibold mb-2 block">
            {product.category.name}
          </span>
        )}
        <Link href={`/marketplace/${product.id}`}>
          <h3 className="text-lg font-medium text-white mb-2 line-clamp-1 hover:text-blue-400 transition-colors">
            {product.title}
          </h3>
        </Link>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-white">
            {product.price.toLocaleString()} FCFA
          </span>
        </div>
      </div>
    </div>
  );
};
