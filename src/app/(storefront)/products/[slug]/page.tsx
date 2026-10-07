'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  Sparkles,
  ChevronRight,
  Share2
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/utils';
import ProductCard from '@/components/storefront/ProductCard';

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { addToCart, settings } = useStore();

  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery state
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Variant & Quantity state
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [slug]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${slug}`);
      const data = await res.json();
      if (data.success && data.product) {
        setProduct(data.product);
        setReviews(data.reviews || []);
        setRelatedProducts(data.relatedProducts || []);
        setSelectedImage(data.product.images[0] || '');

        if (data.product.variants && data.product.variants.length > 0) {
          setSelectedSize(data.product.variants[0].size || '');
        }
      }
    } catch (e) {
      console.error('Fetch product details error', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-amber-900">
        <div className="w-12 h-12 border-4 border-amber-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-semibold text-sm">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-slate-500 text-sm mt-1 mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link href="/shop" className="bg-amber-900 text-white font-bold text-sm px-6 py-3 rounded-xl">
          Back to Shop
        </Link>
      </div>
    );
  }

  const activeVariant = product.variants?.find((v: any) => v.size === selectedSize);
  const variantStock = activeVariant ? activeVariant.stock : product.totalStock;
  const isOutOfStock = variantStock <= 0;

  const effectivePrice = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: selectedImage || product.images[0],
      price: product.price,
      discountPrice: product.discountPrice,
      size: selectedSize,
      quantity,
      maxStock: variantStock
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link href="/" className="hover:text-amber-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <Link href="/shop" className="hover:text-amber-900">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-4/5 w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-rose-700 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Image Thumbnail Selector */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden bg-slate-100 border-2 shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-amber-900 ring-2 ring-amber-900/20 shadow-md scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Order Controls */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                SKU: {product.sku}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating ? product.rating.toFixed(1) : '4.9'}</span>
                <span className="text-slate-400 font-normal">({reviews.length} reviews)</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-3 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing Box */}
          <div className="flex items-baseline gap-3 p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
            <span className="font-serif text-3xl font-bold text-amber-950">
              {formatPrice(effectivePrice)}
            </span>
            {hasDiscount && (
              <span className="text-base text-slate-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
            {hasDiscount && (
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                Save {formatPrice(product.price - product.discountPrice)}
              </span>
            )}
          </div>

          {/* Sizes Selector & Individual Variant Stock */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>SELECT SIZE</span>
                <span className={variantStock > 0 ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-bold'}>
                  {variantStock > 0 ? `In Stock (${variantStock} available)` : 'Stock Out'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.variants.map((v: any, idx: number) => {
                  const isSelected = selectedSize === v.size;
                  const isVariantOutOfStock = v.stock <= 0;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(v.size)}
                      disabled={isVariantOutOfStock}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-amber-900 bg-amber-900 text-white font-bold shadow-md'
                          : isVariantOutOfStock
                          ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                          : 'border-slate-200 bg-white text-slate-800 hover:border-amber-400 font-semibold'
                      }`}
                    >
                      <div className="text-sm">{v.size}</div>
                      <div className="text-[10px] opacity-80 font-normal mt-0.5">
                        {isVariantOutOfStock ? 'Sold Out' : `${v.stock} left`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quantity</span>
            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-bold text-sm text-slate-800">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(variantStock, q + 1))}
                className="p-2.5 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                addedSuccess
                  ? 'bg-emerald-700 text-white'
                  : isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-amber-900 text-white hover:bg-amber-950 active:scale-98'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="py-4 rounded-2xl font-bold text-sm bg-emerald-800 text-white hover:bg-emerald-900 transition-all shadow-md active:scale-98 disabled:opacity-40"
            >
              Buy Now (Express Checkout)
            </button>
          </div>

          {/* Delivery & Assurance Info */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <strong className="text-slate-900 block font-semibold">Bangladesh Delivery Rates</strong>
                <span>Inside Dhaka: ৳80 (24-48 hours) | Outside Dhaka: ৳130 (2-4 days)</span>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
              <div>
                <strong className="text-slate-900 block font-semibold">Payment Methods</strong>
                <span>Cash on Delivery, bKash, Nagad, and Rocket accepted.</span>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-2 pt-4 border-t border-slate-200">
            <h3 className="font-serif font-bold text-slate-900 text-lg">Product Description</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-slate-200">
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6">
            Complete Your Look
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((rel: any) => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
