import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Star,
  Award,
  Scissors,
  Layers,
  Crown
} from 'lucide-react';
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
    <div className="space-y-20 sm:space-y-28 pb-24 text-[#f7f3eb]">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[640px] lg:min-h-[750px] bg-[#0c0a09] overflow-hidden flex items-center border-b border-[#c9933a]/20">
        {/* Background Ambient Imagery & Radial Vignette */}
        <div className="absolute inset-0 z-0 opacity-45">
          <img
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1920&auto=format&fit=crop"
            alt="Yah SABAB Festive Men's Collection"
            className="w-full h-full object-cover object-top filter contrast-105"
          />
          {/* Multi-layered dark luxury gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0a09] via-[#0c0a09]/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-black/60" />
        </div>

        {/* Ambient Gold Glow Orbs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#c9933a]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl space-y-7">
            {/* Eid & Festive Pill */}
            <div className="inline-flex items-center gap-2.5 bg-[#211a12]/80 border border-[#c9933a]/40 text-[#f5eedb] text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg shadow-[#0a0806]">
              <Sparkles className="w-3.5 h-3.5 text-[#c9933a] animate-pulse" />
              <span className="tracking-widest uppercase text-[11px]">The Festive & Eid 2026 Collection</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#f7f3eb] leading-[1.1]">
                Heritage, Crafted for{' '}
                <span className="gold-gradient-text italic font-serif">Today.</span>
              </h1>
              <p className="font-bangla text-[#c9933a] text-lg sm:text-xl font-medium tracking-wide">
                অভিজাত বাঙালি পুরুষের পছন্দের ঐতিহ্যবাহী পাঞ্জাবি কালেকশন
              </p>
            </div>

            <p className="text-base sm:text-lg text-[#b8ab99] font-light leading-relaxed max-w-xl">
              Discover opulent Egyptian Giza cotton Panjabis, delicate handcrafted threadwork, and tailored Peshawari Kablis. Exclusively designed for discerning gentlemen across Bangladesh.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
              <Link
                href="/shop"
                className="bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] font-bold px-8 py-4 rounded-xl hover:opacity-95 transition-all shadow-xl shadow-[#c9933a]/25 flex items-center justify-center gap-2 group border border-[#f5eedb]/30"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/shop?category=panjabi"
                className="bg-[#1c1712]/80 hover:bg-[#282119] text-[#f5eedb] text-center font-medium px-8 py-4 rounded-xl border border-[#c9933a]/30 backdrop-blur-sm transition-all"
              >
                Explore Panjabis
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-[#c9933a]/20 text-xs text-[#a89b88]">
              <div>
                <strong className="block text-[#f7f3eb] text-sm font-semibold">64 Districts</strong>
                <span>Express Courier</span>
              </div>
              <div>
                <strong className="block text-[#f7f3eb] text-sm font-semibold">bKash / COD</strong>
                <span>Verified Payment</span>
              </div>
              <div>
                <strong className="block text-[#f7f3eb] text-sm font-semibold">100% Cotton</strong>
                <span>Guaranteed Quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SIGNATURE COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#c9933a] uppercase tracking-widest">
              <Crown className="w-3.5 h-3.5" />
              <span>SIGNATURE LINES</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#f7f3eb] mt-1.5">
              Explore Our Collections
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-[#c9933a] hover:text-[#e2cb97] flex items-center gap-1.5 group transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat: any) => (
            <Link
              key={cat._id}
              href={`/shop?category=${cat.slug}`}
              className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden bg-[#16120e] shadow-lg border border-[#c9933a]/20 hover:border-[#c9933a]/60 hover:shadow-2xl transition-all"
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-75 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0a] via-[#0e0c0a]/40 to-transparent" />
              <div className="absolute bottom-5 left-4 right-4 text-[#f7f3eb]">
                <h3 className="font-serif text-lg font-bold group-hover:text-[#c9933a] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#a89b88] line-clamp-1 mt-0.5">
                  {cat.description || 'Exclusive menswear craft'}
                </p>
                <div className="mt-2 inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#c9933a] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#c9933a] uppercase tracking-widest">CURATED EXCLUSIVES</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#f7f3eb] mt-1.5">
            Featured Panjabi Pieces
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#c9933a] to-transparent mx-auto my-3" />
          <p className="text-sm text-[#a89b88]">
            Masterpieces crafted with high-count Egyptian cotton, delicate neck embroidery, and modern tailored fits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. FABRIC & CRAFTSMANSHIP STORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1c1611] via-[#14100c] to-[#0d0a08] border border-[#c9933a]/30 p-8 sm:p-14 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#c9933a] uppercase tracking-widest bg-[#2b2116] px-3.5 py-1.5 rounded-full border border-[#c9933a]/30">
                <Scissors className="w-3.5 h-3.5" />
                <span>THE ATELIER STORY</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#f7f3eb] leading-tight">
                The Art of Tailoring <br />
                <span className="gold-gradient-text italic">Without Compromise</span>
              </h2>

              <p className="text-sm text-[#b8ab99] leading-relaxed">
                At Yah SABAB, we believe a Panjabi is not merely a garment; it is a canvas of heritage. Every stitch is placed with intention, using high-tensile Egyptian cotton yarns that breathe effortlessly under the warm Bangladeshi climate.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#221b14] border border-[#c9933a]/20">
                  <Layers className="w-5 h-5 text-[#c9933a] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#f7f3eb]">Egyptian Cotton</h4>
                    <p className="text-xs text-[#8c8071] mt-0.5">Silky finish, high breathability and supreme drape.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#221b14] border border-[#c9933a]/20">
                  <Scissors className="w-5 h-5 text-[#c9933a] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#f7f3eb]">Precision Collar</h4>
                    <p className="text-xs text-[#8c8071] mt-0.5">Fused band collar that maintains its sharp profile all day.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Showcase Visual */}
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-[#c9933a]/30">
              <img
                src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=900"
                alt="Craftsmanship and Fabric"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="text-xs font-bold text-[#c9933a] uppercase tracking-widest">Handcrafted In Dhaka</span>
                  <p className="text-sm font-semibold text-[#f7f3eb]">Designed for celebratory moments & Jummah prayers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROMOTIONAL FESTIVE OFFER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#172e21] via-[#0f1f16] to-[#121914] text-white p-8 sm:p-14 shadow-2xl border border-emerald-600/30 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4 text-center lg:text-left z-10">
            <span className="bg-[#c9933a] text-[#0e0c0a] font-black text-xs uppercase px-3.5 py-1 rounded-full tracking-wider shadow-md">
              FESTIVE VOUCHER
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-[#f7f3eb]">
              Eid Special Privilege: Save Up to <span className="gold-gradient-text">20% OFF</span>
            </h2>
            <p className="text-emerald-100/80 text-sm leading-relaxed">
              Use code <strong className="text-[#f5eedb] font-mono text-sm px-2.5 py-1 bg-[#1a3828] border border-emerald-500/30 rounded-lg">EID20</strong> at checkout on orders over ৳2,000. Nationwide express Cash on Delivery & bKash available.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] font-bold px-8 py-3.5 rounded-xl transition-all shadow-xl hover:opacity-95"
              >
                <span>Claim Offer Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative w-full max-w-sm aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/20">
            <img
              src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800"
              alt="Festive Offer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-[#c9933a] uppercase tracking-widest">FRESH DROPS</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f7f3eb] mt-1">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/shop?isNewArrival=true"
              className="text-sm font-semibold text-[#c9933a] hover:text-[#e2cb97] flex items-center gap-1 transition-colors"
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

      {/* 7. WHY CHOOSE YAH SABAB */}
      <section className="bg-[#14100c] py-16 border-y border-[#c9933a]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-md mx-auto mb-12">
            <span className="text-xs font-bold text-[#c9933a] uppercase tracking-widest">THE YAH SABAB PROMISE</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f7f3eb] mt-1">
              Why Discerning Men Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#1c1712] p-6 rounded-2xl border border-[#c9933a]/20 shadow-md text-center space-y-3">
              <div className="w-12 h-12 bg-[#2a2117] text-[#c9933a] rounded-xl flex items-center justify-center mx-auto border border-[#c9933a]/30">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-[#f7f3eb] text-lg">Finest Cotton</h3>
              <p className="text-xs text-[#a89b88] leading-relaxed">
                Fine long-staple Egyptian cotton & silk blends for supreme comfort in humid weather.
              </p>
            </div>

            <div className="bg-[#1c1712] p-6 rounded-2xl border border-[#c9933a]/20 shadow-md text-center space-y-3">
              <div className="w-12 h-12 bg-[#2a2117] text-[#c9933a] rounded-xl flex items-center justify-center mx-auto border border-[#c9933a]/30">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-[#f7f3eb] text-lg">Fast BD Courier</h3>
              <p className="text-xs text-[#a89b88] leading-relaxed">
                24-48 hour delivery inside Dhaka & 2-4 days across all 64 districts in Bangladesh.
              </p>
            </div>

            <div className="bg-[#1c1712] p-6 rounded-2xl border border-[#c9933a]/20 shadow-md text-center space-y-3">
              <div className="w-12 h-12 bg-[#2a2117] text-[#c9933a] rounded-xl flex items-center justify-center mx-auto border border-[#c9933a]/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-[#f7f3eb] text-lg">Verified Payment</h3>
              <p className="text-xs text-[#a89b88] leading-relaxed">
                Full support for bKash, Nagad, Rocket, and Cash on Delivery with direct verification.
              </p>
            </div>

            <div className="bg-[#1c1712] p-6 rounded-2xl border border-[#c9933a]/20 shadow-md text-center space-y-3">
              <div className="w-12 h-12 bg-[#2a2117] text-[#c9933a] rounded-xl flex items-center justify-center mx-auto border border-[#c9933a]/30">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-[#f7f3eb] text-lg">Easy Size Exchange</h3>
              <p className="text-xs text-[#a89b88] leading-relaxed">
                Hassle-free size replacement within 7 days. Your perfect fit is always guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-lg mx-auto mb-12">
          <span className="text-xs font-bold text-[#c9933a] uppercase tracking-widest">TESTIMONIALS</span>
          <h2 className="font-serif text-3xl font-bold text-[#f7f3eb] mt-1">
            Loved by Men Across Bangladesh
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#17130f] p-6 rounded-2xl border border-[#c9933a]/20 shadow-md space-y-4">
            <div className="flex text-[#c9933a] gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#c9933a]" />
              ))}
            </div>
            <p className="text-sm text-[#d6cdbf] italic leading-relaxed">
              "The neck embroidery on the Midnight Blue Panjabi is outstanding. Fitting was immaculate for Eid prayer. Delivered to Uttara within 24 hours!"
            </p>
            <div className="pt-2 border-t border-[#c9933a]/15 flex items-center justify-between">
              <span className="font-bold text-sm text-[#f7f3eb]">Dr. Mahfuzur Rahman</span>
              <span className="text-xs text-emerald-400 font-semibold bg-[#12281c] border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                Dhaka
              </span>
            </div>
          </div>

          <div className="bg-[#17130f] p-6 rounded-2xl border border-[#c9933a]/20 shadow-md space-y-4">
            <div className="flex text-[#c9933a] gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#c9933a]" />
              ))}
            </div>
            <p className="text-sm text-[#d6cdbf] italic leading-relaxed">
              "Ordered a Peshawari Kabli suit to Chittagong via bKash. Payment was verified swiftly and received in pristine condition. Excellent service!"
            </p>
            <div className="pt-2 border-t border-[#c9933a]/15 flex items-center justify-between">
              <span className="font-bold text-sm text-[#f7f3eb]">Saadman Chowdhury</span>
              <span className="text-xs text-emerald-400 font-semibold bg-[#12281c] border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                Chittagong
              </span>
            </div>
          </div>

          <div className="bg-[#17130f] p-6 rounded-2xl border border-[#c9933a]/20 shadow-md space-y-4">
            <div className="flex text-[#c9933a] gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#c9933a]" />
              ))}
            </div>
            <p className="text-sm text-[#d6cdbf] italic leading-relaxed">
              "The cotton fabric quality is genuine Egyptian cotton. Breathable for summer weddings and Jummah. Yah SABAB has won a loyal customer."
            </p>
            <div className="pt-2 border-t border-[#c9933a]/15 flex items-center justify-between">
              <span className="font-bold text-sm text-[#f7f3eb]">Mirza Redwan</span>
              <span className="text-xs text-emerald-400 font-semibold bg-[#12281c] border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                Sylhet
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
