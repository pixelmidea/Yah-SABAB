'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Star, Check } from 'lucide-react';
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
    <div className="group bg-[#15120e] rounded-2xl overflow-hidden border border-[#c9933a]/20 hover:border-[#c9933a]/60 hover:shadow-2xl hover:shadow-[#0c0a08] transition-all duration-300 flex flex-col h-full relative">
      {/* Image Container with Smooth Zoom & Secondary Crossfade */}
      <Link href={`/products/${product.slug}`} className="relative aspect-3/4 w-full bg-[#1b1712] overflow-hidden block">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Hover overlay secondary image if available */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
          />
        )}

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#15120e] via-transparent to-black/25 opacity-70 group-hover:opacity-40 transition-opacity" />

        {/* Luxury Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="bg-gradient-to-r from-[#b02a37] to-[#881a24] text-white font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-lg border border-red-400/30">
              {discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-gradient-to-r from-[#215638] to-[#163a26] text-[#bbf7d0] font-semibold text-[10px] tracking-widest uppercase px-2.5 py-0.5 rounded-full shadow-sm border border-emerald-400/30">
              New Drop
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-gradient-to-r from-[#c9933a] to-[#a37024] text-[#0e0c0a] font-bold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-md border border-[#f5eedb]/40">
              Signature
            </span>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="bg-[#2a1215] border border-red-500/40 text-red-300 font-bold text-xs uppercase px-3.5 py-1.5 rounded-lg tracking-widest shadow-xl">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Details Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Star Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#c9933a] font-semibold uppercase tracking-widest text-[10px]">
              {product.category?.name || 'Panjabi'}
            </span>
            <div className="flex items-center gap-1 text-[#d4b16a] font-medium text-[11px]">
              <Star className="w-3.5 h-3.5 fill-[#c9933a] text-[#c9933a]" />
              <span className="font-bold">{product.rating ? product.rating.toFixed(1) : '4.9'}</span>
              <span className="text-[#7c7060]">({product.numReviews || 18})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-serif text-base font-bold text-[#f5eedb] group-hover:text-[#c9933a] line-clamp-2 transition-colors mb-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Variants / Sizes Pill Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex items-center gap-1.5 my-2.5 flex-wrap">
              <span className="text-[10px] text-[#8c8071] font-medium mr-0.5">Size:</span>
              {product.variants.map((v, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    if (v.size) setSelectedSize(v.size);
                  }}
                  className={`text-[11px] px-2.5 py-0.5 rounded-md border font-medium transition-all ${
                    selectedSize === v.size
                      ? 'border-[#c9933a] bg-[#c9933a] text-[#0e0c0a] font-bold shadow-sm'
                      : 'border-[#382f25] text-[#b8ab99] hover:border-[#c9933a]/60 bg-[#1e1914]'
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-3 border-t border-[#c9933a]/15 flex items-center justify-between mt-2">
          <div>
            <div className="text-base sm:text-lg font-bold text-[#f5eedb] flex items-baseline gap-2">
              <span className="text-[#c9933a]">{formatPrice(effectivePrice)}</span>
              {hasDiscount && (
                <span className="text-xs text-[#7c7060] font-normal line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
              addedSuccess
                ? 'bg-[#1b4332] text-[#bbf7d0] border border-emerald-400/40'
                : isOutOfStock
                ? 'bg-[#241e18] text-[#6e6153] cursor-not-allowed border border-transparent'
                : 'bg-gradient-to-r from-[#c9933a] to-[#a37024] text-[#0e0c0a] hover:opacity-95 border border-[#f5eedb]/30'
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
