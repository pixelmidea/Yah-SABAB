'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Star, Eye, Check } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/utils';

interface Variant {
  size?: string;
  color?: string;
  stock: number;
  sku?: string;
}

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    discountPrice?: number;
    images: string[];
    variants?: Variant[];
    totalStock: number;
    isFeatured?: boolean;
    isNewArrival?: boolean;
    isBestSeller?: boolean;
    rating?: number;
    numReviews?: number;
    category?: { name: string; slug: string } | any;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants && product.variants.length > 0 ? product.variants[0].size || '' : ''
  );
  const [addedSuccess, setAddedSuccess] = useState(false);

  const effectivePrice = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const isOutOfStock = product.totalStock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    addToCart({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || '',
      price: product.price,
      discountPrice: product.discountPrice,
      size: selectedSize,
      maxStock: product.totalStock
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1500);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-amber-300 hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-4/5 w-full bg-slate-100 overflow-hidden block">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Hover overlay secondary image if available */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="bg-rose-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-full shadow-md tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-emerald-800 text-white font-semibold text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-xs tracking-wider">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-700 text-white font-semibold text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-xs tracking-wider">
              Best Seller
            </span>
          )}
        </div>

        {/* Out of Stock Banner */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-md tracking-widest shadow-lg">
              Stock Out
            </span>
          </div>
        )}
      </Link>

      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-amber-800 font-semibold uppercase tracking-wider text-[10px]">
              {product.category?.name || 'Menswear'}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating ? product.rating.toFixed(1) : '4.9'}</span>
              <span className="text-slate-400 font-normal">({product.numReviews || 12})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-serif text-base font-bold text-slate-900 group-hover:text-amber-900 line-clamp-2 transition-colors mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Variants / Sizes Pill Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex items-center gap-1.5 my-2 flex-wrap">
              <span className="text-[10px] text-slate-500 font-medium mr-0.5">Size:</span>
              {product.variants.map((v, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    if (v.size) setSelectedSize(v.size);
                  }}
                  className={`text-[11px] px-2 py-0.5 rounded-md border font-medium transition-all ${
                    selectedSize === v.size
                      ? 'border-amber-900 bg-amber-900 text-white font-bold'
                      : 'border-slate-200 text-slate-700 hover:border-amber-400 bg-slate-50'
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
          <div>
            <div className="text-base font-bold text-amber-950 flex items-baseline gap-2">
              <span>{formatPrice(effectivePrice)}</span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 font-normal line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              addedSuccess
                ? 'bg-emerald-700 text-white'
                : isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-amber-900 text-white hover:bg-amber-950 active:scale-95'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
