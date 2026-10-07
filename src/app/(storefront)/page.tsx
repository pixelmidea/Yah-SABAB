import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Clock, Sparkles, Star, Award } from 'lucide-react';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ProductCard from '@/components/storefront/ProductCard';

export const revalidate = 60; // Revalidate page every 60 seconds

async function getHomepageData() {
  await connectToDatabase();

  const [categories, featuredProducts, newArrivals] = await Promise.all([
    Category.find({ isActive: true }).sort({ displayOrder: 1 }).limit(6).lean(),
    Product.find({ isActive: true, isFeatured: true }).populate('category', 'name slug').limit(8).lean(),
    Product.find({ isActive: true, isNewArrival: true }).populate('category', 'name slug').limit(4).lean()
  ]);

  return {
    categories: JSON.parse(JSON.stringify(categories)),
    featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
    newArrivals: JSON.parse(JSON.stringify(newArrivals))
  };
}

export default async function HomePage() {
  const { categories, featuredProducts, newArrivals } = await getHomepageData();

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[640px] bg-slate-950 text-white overflow-hidden flex items-center">
        {/* Background Overlay Image */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1800&auto=format&fit=crop"
            alt="Nabo Rūpa Eid Collection"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>THE EID & FESTIVE 2026 COLLECTION</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              Heritage, Crafted for <span className="text-amber-400 italic">Today.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              Discover opulent Egyptian cotton Panjabis, handcrafted thread embroidery, and tailored Peshawari Kablis. Tailored for Bangladesh's modern gentlemen.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                href="/shop"
                className="bg-amber-700 text-white text-center font-bold px-8 py-4 rounded-xl hover:bg-amber-800 transition-all shadow-xl shadow-amber-950/40 flex items-center justify-center gap-2 group"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/shop?category=panjabi"
                className="bg-white/10 hover:bg-white/20 text-white text-center font-medium px-8 py-4 rounded-xl border border-white/20 backdrop-blur-sm transition-all"
              >
                Explore Panjabis
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-xs text-slate-400">
              <div>
                <strong className="block text-white text-sm font-semibold">64 Districts</strong>
                <span>Express Delivery</span>
              </div>
              <div>
                <strong className="block text-white text-sm font-semibold">bKash / COD</strong>
                <span>Verified Payment</span>
              </div>
              <div>
                <strong className="block text-white text-sm font-semibold">100% Cotton</strong>
                <span>Guaranteed Quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">CATEGORIES</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Explore Our Signature Lines
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat: any) => (
            <Link
              key={cat._id}
              href={`/shop?category=${cat.slug}`}
              className="group relative h-64 rounded-2xl overflow-hidden bg-slate-900 shadow-md border border-slate-100 hover:shadow-xl transition-all"
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-serif text-lg font-bold group-hover:text-amber-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">CURATED FOR YOU</span>
          <h2 className="font-serif text-3xl font-bold text-slate-900 mt-1">
            Featured Products
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Handpicked premium menswear crafted with high-count cotton fabrics and traditional handwork.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* PROMOTIONAL BANNER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-emerald-950 text-white p-8 sm:p-14 shadow-2xl border border-emerald-900 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4 text-center lg:text-left z-10">
            <span className="bg-amber-400 text-emerald-950 font-bold text-xs uppercase px-3 py-1 rounded-full">
              LIMITED TIME OFFER
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Eid Special Discount: Save Up to <span className="text-amber-400">20% OFF</span>
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Use promo code <strong className="text-amber-400 font-mono text-base px-2 py-0.5 bg-emerald-900 rounded-md">EID20</strong> at checkout on orders over ৳2,000. Express Cash on Delivery & bKash available nationwide.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg"
              >
                <span>Claim Offer Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative w-full max-w-sm aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-emerald-800">
            <img
              src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800"
              alt="Promotional Banner"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">FRESH DROP</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/shop?isNewArrival=true"
              className="text-sm font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1"
            >
              Explore All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* WHY CHOOSE US */}
      <section className="bg-amber-50/50 py-16 border-y border-amber-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-md mx-auto mb-12">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">THE NABO RŪPA PROMISE</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Why Customers Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-xl flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-lg">Premium Fabric</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We source fine long-staple Egyptian cotton & silk blends for supreme comfort in humid weather.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-xl flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-lg">Fast BD Delivery</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                24-48 hour delivery inside Dhaka & 2-4 days across all 64 districts in Bangladesh.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-xl flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-lg">Verified Payment</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Full support for bKash, Nagad, Rocket, and Cash on Delivery with manual verification security.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-xl flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-lg">Hassle-Free Returns</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Easy size exchanges within 7 days. Customer satisfaction is our highest priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-lg mx-auto mb-12">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">TESTIMONIALS</span>
          <h2 className="font-serif text-3xl font-bold text-slate-900 mt-1">
            Loved by Men Across Bangladesh
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-slate-600 italic">
              "The embroidery on the Midnight Blue Panjabi is outstanding. Fitting was perfect for Eid prayer. Delivered to Uttara within 24 hours!"
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Dr. Mahfuzur Rahman</span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                Verified Buyer (Dhaka)
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-slate-600 italic">
              "Ordered a Peshawari Kabli suit to Chittagong via bKash. Payment was verified in 10 minutes and received the order safely. Excellent service!"
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Saadman Chowdhury</span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                Verified Buyer (Chittagong)
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-slate-600 italic">
              "The cotton fabric quality is genuine Egyptian cotton. Breathable for summer weddings. Will order again for sure."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Mirza Redwan</span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                Verified Buyer (Sylhet)
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
