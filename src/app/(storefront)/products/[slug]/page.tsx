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
  ChevronRight,
  Ruler,
  X,
  Sparkles
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
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

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
      <div className="max-w-7xl mx-auto px-4 py-28 text-center text-[#c9933a]">
        <div className="w-12 h-12 border-4 border-[#c9933a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-serif font-semibold text-sm">Presenting Garment Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-3xl font-bold text-[#f7f3eb]">Product Not Found</h2>
        <p className="text-[#a89b88] text-sm mt-1.5 mb-6">The garment you are looking for does not exist or has been archived.</p>
        <Link href="/shop" className="bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] font-bold text-xs uppercase px-7 py-3.5 rounded-xl">
          Return to Collection
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-[#f7f3eb]">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-[#8c8071]">
        <Link href="/" className="hover:text-[#c9933a] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#52493e]" />
        <Link href="/shop" className="hover:text-[#c9933a] transition-colors">Collections</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#52493e]" />
        <span className="text-[#c9933a] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-4/5 w-full rounded-3xl overflow-hidden bg-[#181410] border border-[#c9933a]/30 shadow-2xl">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-gradient-to-r from-[#b02a37] to-[#881a24] text-white font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg border border-red-400/40">
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
                  className={`relative w-20 h-24 rounded-xl overflow-hidden bg-[#181410] border-2 shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-[#c9933a] ring-2 ring-[#c9933a]/30 shadow-lg scale-105'
                      : 'border-[#2d2419] opacity-60 hover:opacity-100'
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
              <span className="text-xs font-bold text-[#c9933a] uppercase tracking-widest bg-[#221a12] px-3.5 py-1 rounded-full border border-[#c9933a]/30">
                SKU: {product.sku}
              </span>
              <div className="flex items-center gap-1 text-[#d4b16a] font-bold text-sm">
                <Star className="w-4 h-4 fill-[#c9933a] text-[#c9933a]" />
                <span>{product.rating ? product.rating.toFixed(1) : '4.9'}</span>
                <span className="text-[#786c5c] font-normal">({reviews.length} reviews)</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#f7f3eb] mt-3 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing Box */}
          <div className="flex items-baseline gap-3 p-5 bg-[#17130f] rounded-2xl border border-[#c9933a]/30 shadow-inner">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#c9933a]">
              {formatPrice(effectivePrice)}
            </span>
            {hasDiscount && (
              <span className="text-base text-[#7c7060] line-through">
                {formatPrice(product.price)}
              </span>
            )}
            {hasDiscount && (
              <span className="text-xs font-bold text-[#fca5a5] bg-[#3a141b] border border-red-500/30 px-2.5 py-0.5 rounded-md ml-auto">
                Save {formatPrice(product.price - product.discountPrice)}
              </span>
            )}
          </div>

          {/* Sizes Selector & Size Guide Button */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-[#b8ab99]">
                <div className="flex items-center gap-2">
                  <span>SELECT SIZE</span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="inline-flex items-center gap-1 text-[#c9933a] hover:underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>
                <span className={variantStock > 0 ? 'text-emerald-400 font-semibold' : 'text-red-400 font-bold'}>
                  {variantStock > 0 ? `In Stock (${variantStock} left)` : 'Stock Out'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
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
                          ? 'border-[#c9933a] bg-[#c9933a] text-[#0e0c0a] font-bold shadow-lg'
                          : isVariantOutOfStock
                          ? 'border-[#261d15] bg-[#1a140f] text-[#5e5142] cursor-not-allowed line-through'
                          : 'border-[#34291f] bg-[#18130f] text-[#d6cdbf] hover:border-[#c9933a]/60 font-semibold'
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
            <span className="text-xs font-bold text-[#b8ab99] uppercase tracking-wider">Quantity</span>
            <div className="flex items-center border border-[#c9933a]/30 rounded-xl bg-[#17130f] overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 hover:bg-[#251e16] text-[#c9933a] transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-5 font-bold text-sm text-[#f7f3eb]">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(variantStock, q + 1))}
                className="p-2.5 hover:bg-[#251e16] text-[#c9933a] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`py-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 ${
                addedSuccess
                  ? 'bg-[#1b4332] text-[#bbf7d0] border border-emerald-400/40'
                  : isOutOfStock
                  ? 'bg-[#221b14] text-[#5a4d3f] cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] hover:opacity-95'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="py-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#1a140f] border border-[#c9933a]/50 text-[#f5eedb] hover:bg-[#241c14] transition-all shadow-lg active:scale-95 disabled:opacity-30"
            >
              Express Checkout
            </button>
          </div>

          {/* Delivery & Assurance Info */}
          <div className="bg-[#16120e] p-4.5 rounded-2xl border border-[#c9933a]/25 space-y-3 text-xs text-[#a89b88]">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-[#c9933a] shrink-0" />
              <div>
                <strong className="text-[#f7f3eb] block font-semibold">Nationwide Express Delivery</strong>
                <span>Inside Dhaka: ৳80 (24-48 hours) | Outside Dhaka: ৳130 (2-4 days)</span>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2.5 border-t border-[#c9933a]/15">
              <ShieldCheck className="w-5 h-5 text-[#c9933a] shrink-0" />
              <div>
                <strong className="text-[#f7f3eb] block font-semibold">Verified Payment Security</strong>
                <span>Cash on Delivery, bKash, Nagad, and Rocket accepted.</span>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2.5 border-t border-[#c9933a]/15">
              <RotateCcw className="w-5 h-5 text-[#c9933a] shrink-0" />
              <div>
                <strong className="text-[#f7f3eb] block font-semibold">Easy 7-Day Size Exchange</strong>
                <span>We guarantee your perfect fit with hassle-free exchange support.</span>
              </div>
            </div>
          </div>

          {/* Garment Details & Description */}
          <div className="space-y-3 pt-4 border-t border-[#c9933a]/20">
            <h3 className="font-serif font-bold text-[#f7f3eb] text-lg">Garment Craftsmanship</h3>
            <p className="text-xs sm:text-sm text-[#b8ab99] leading-relaxed whitespace-pre-line">
              {product.description || 'Crafted with premium Egyptian cotton yarns for high tensile durability and supreme comfort in festive weather.'}
            </p>
          </div>
        </div>
      </div>

      {/* SIZE GUIDE MODAL */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#14100c] text-[#f7f3eb] w-full max-w-lg rounded-3xl border border-[#c9933a]/30 p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#c9933a]/20 pb-3">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-[#c9933a]" />
                <h3 className="font-serif text-lg font-bold">Panjabi Size Guide (Inches)</h3>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#251e16] text-[#a89b88]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#201811] text-[#c9933a] uppercase font-bold border-b border-[#c9933a]/20">
                  <tr>
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Chest</th>
                    <th className="p-2.5">Length</th>
                    <th className="p-2.5">Collar</th>
                    <th className="p-2.5">Sleeve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c9933a]/15 text-[#d6cdbf]">
                  <tr><td className="p-2.5 font-bold">38 (S)</td><td className="p-2.5">40"</td><td className="p-2.5">38"</td><td className="p-2.5">15"</td><td className="p-2.5">24.5"</td></tr>
                  <tr><td className="p-2.5 font-bold">40 (M)</td><td className="p-2.5">42"</td><td className="p-2.5">40"</td><td className="p-2.5">15.5"</td><td className="p-2.5">25"</td></tr>
                  <tr><td className="p-2.5 font-bold">42 (L)</td><td className="p-2.5">44"</td><td className="p-2.5">42"</td><td className="p-2.5">16"</td><td className="p-2.5">25.5"</td></tr>
                  <tr><td className="p-2.5 font-bold">44 (XL)</td><td className="p-2.5">46"</td><td className="p-2.5">44"</td><td className="p-2.5">16.5"</td><td className="p-2.5">26"</td></tr>
                  <tr><td className="p-2.5 font-bold">46 (XXL)</td><td className="p-2.5">48"</td><td className="p-2.5">45"</td><td className="p-2.5">17"</td><td className="p-2.5">26.5"</td></tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-[#8c8071]">
              *Measurements are garment specifications. If you fall between two sizes, we recommend selecting the larger size for a relaxed traditional silhouette.
            </p>
          </div>
        </div>
      )}

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-[#c9933a]/20">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#c9933a]" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f7f3eb]">
              Complete Your Look
            </h2>
          </div>
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
