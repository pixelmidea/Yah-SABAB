'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Star, Check, Heart } from 'lucide-react';
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
    product.variants && product.variants.length > 0 && product.variants[0].size
      ? product.variants[0].size
      : 'M (40)'
  );
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

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

  // Format size display like M (40), L (42) when numeric size is mapped or standard
  const formatSizeLabel = (sizeStr: string) => {
    const s = sizeStr.trim();
    if (s === '38') return 'S (38)';
    if (s === '40') return 'M (40)';
    if (s === '42') return 'L (42)';
    if (s === '44') return 'XL (44)';
    if (s === '46') return 'XXL (46)';
    if (s === 'M') return 'M (40)';
    if (s === 'L') return 'L (42)';
    if (s === 'XL') return 'XL (44)';
    return s;
  };

  return (
    <div className="group bg-[#14100c] rounded-2xl p-2.5 sm:p-3 overflow-hidden border border-[#2e2318] hover:border-[#c9933a]/80 hover:shadow-2xl hover:shadow-black/70 transition-all duration-300 flex flex-col justify-between h-full relative">
      {/* Inset Photo Frame with 4:5 Ratio */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/5] w-full rounded-xl bg-[#1b1712] overflow-hidden block">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 opacity-60 group-hover:opacity-30 transition-opacity" />

        {/* Luxury Badges on Top-Left (Exact from Reference Image) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5 z-10">
          {hasDiscount && (
            <span className="bg-[#e03131] text-white font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-md">
              {discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#e6ad35] text-[#0a0806] font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-sm">
              NEW DROP
            </span>
          )}
          {product.isFeatured && !product.isNewArrival && (
            <span className="bg-[#e6ad35] text-[#0a0806] font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-sm">
              SIGNATURE
            </span>
          )}
          {product.isBestSeller && !product.isNewArrival && !product.isFeatured && (
            <span className="bg-[#e6ad35] text-[#0a0806] font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-sm">
              BEST SELLER
            </span>
          )}
        </div>

        {/* Top-Right Circular Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-md border cursor-pointer ${
            isWishlisted
              ? 'bg-[#e6ad35] text-[#0a0806] border-[#e6ad35]'
              : 'bg-black/55 text-white/90 hover:text-white border-white/20 hover:border-[#e6ad35] hover:bg-black/70'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* 4 Carousel Dots Indicator Matching Reference Image */}
        <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-xs" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-xs" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-xs" />
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
      <div className="pt-3 px-0.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Star Rating Header Row */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[#a89b88] font-bold uppercase tracking-wider text-[10px] truncate max-w-[62%]">
              {product.category?.name || 'Panjabi'}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold">
              <Star className="w-3.5 h-3.5 fill-[#e6ad35] text-[#e6ad35]" />
              <span className="text-[#e6ad35]">{product.rating ? product.rating.toFixed(1) : '4.8'}</span>
              <span className="text-[#8c8071]">({product.numReviews || 17})</span>
            </div>
          </div>

          {/* Product Title (Editorial Serif Typography) */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3
              className="font-serif text-[14px] sm:text-[15px] font-bold text-white group-hover:text-[#e6ad35] line-clamp-1 transition-colors my-1 leading-snug"
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>

          {/* Variants / Sizes Pill Selector from Reference Image */}
          <div className="flex items-center gap-1.5 my-2 flex-wrap">
            <span className="text-[10px] text-[#8c8071] font-semibold mr-0.5">Size:</span>
            {['M (40)', 'L (42)', 'XL (44)'].map((sz, idx) => {
              const pillNum = sz.match(/\d+/)?.[0] || '';
              const pillAlpha = sz.split(' ')[0];
              const isSelected =
                selectedSize === sz ||
                selectedSize === pillNum ||
                selectedSize === pillAlpha ||
                (selectedSize && sz.toLowerCase().includes(selectedSize.toLowerCase()));
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSize(sz);
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#e6ad35] bg-[#2a2015] text-[#f5eedb] font-bold shadow-xs'
                      : 'border-[#382c1f] text-[#c7bcac] hover:border-[#c9933a]/60 bg-[#1a140f]'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing & Add to Cart Action Row */}
        <div className="pt-2.5 border-t border-[#382c1f]/40 flex items-center justify-between gap-2 mt-1 flex-wrap sm:flex-nowrap">
          <div className="flex items-baseline gap-1.5 shrink-0">
            <span className="text-base sm:text-lg font-bold text-[#e6ad35]">
              ৳{effectivePrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#736655] line-through font-normal">
                ৳{product.price.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer shrink-0 ${
              addedSuccess
                ? 'bg-emerald-600 text-white'
                : isOutOfStock
                ? 'bg-[#241e18] text-[#6e6153] cursor-not-allowed'
                : 'bg-[#e6ad35] hover:bg-[#f5c451] text-[#0a0806]'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
