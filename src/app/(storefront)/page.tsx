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
    <div className="space-y-10 sm:space-y-14 pb-24 text-[#f7f3eb] mt-[-60px]">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[620px] lg:min-h-[720px] bg-[#0c0a09] overflow-hidden flex items-center justify-center border-b border-[#c9933a]/20">
        {/* Background Ambient Imagery & Balanced Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.jpg"
            alt="Yah SABAB Festive Men's Collection"
            className="w-full h-full object-cover object-center filter contrast-105"
          />
          {/* Centered symmetrical dark luxury gradient overlays for seamless contrast */}
          <div className="absolute inset-0 bg-[#0c0a09]/55 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0a09]/90 via-transparent to-[#0c0a09]" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#0c0a09]/40 to-[#0c0a09]/90" />
        </div>

        {/* Ambient Gold Glow Orb Centered */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[380px] bg-[#c9933a]/12 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center flex flex-col items-center">
          <div className="w-full max-w-5xl space-y-7 flex flex-col items-center">
            {/* Eid & Festive Pill */}
            <div className="inline-flex items-center gap-2.5 bg-[#211a12]/90 border border-[#c9933a]/40 text-[#f5eedb] text-xs font-semibold px-5 py-2 rounded-full backdrop-blur-md shadow-lg shadow-[#0a0806]/70">
              <Sparkles className="w-3.5 h-3.5 text-[#c9933a] animate-pulse" />
              <span className="tracking-widest uppercase text-[11px]">D-Tex Micro Stitch & Arabian Thobe 2026</span>
            </div>

            {/* Headline */}
            <div className="space-y-3 text-center max-w-4xl mx-auto">
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#f7f3eb] leading-[1.12] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
                Upgrade Your Style with{' '}
                <span className="gold-gradient-text italic font-serif">Elegance!</span>
              </h1>
              <p className="font-bangla text-[#c9933a] text-lg sm:text-2xl lg:text-3xl font-medium tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                আভিজাত্য, আরাম ও প্রিমিয়াম কোয়ালিটির অনন্য সমন্বয়
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-[#d6cdbf] font-light leading-relaxed max-w-3xl mx-auto text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
              Discover our signature Detex China Micro Stitch Panjabi, textured China Popcorn series, and authentic imported Pepsi & Jeddah Cotton Arabian Thobes. 100% color & fabric guaranteed.
            </p>

            {/* Price Badge Highlight */}
            {/* <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-[#1e1710]/90 border border-[#c9933a]/35 backdrop-blur-md shadow-lg">
              <span className="bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] font-black text-xs uppercase px-3.5 py-1 rounded-xl shadow-xs">
                Special Offer: ৳1,450 Only
              </span>
              <span className="text-xs sm:text-sm text-[#e2cb97] font-medium font-bangla">
                মূল্য সম্পূর্ণ ফিক্সড — কোনো দরদাম নয়
              </span>
            </div> */}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1 w-full max-w-xl mx-auto">
              <Link
                href="/shop"
                className="w-full sm:w-auto min-w-[210px] bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] font-bold px-8 py-3.5 rounded-xl hover:opacity-95 transition-all shadow-xl shadow-[#c9933a]/25 flex items-center justify-center gap-2 group border border-[#f5eedb]/30"
              >
                <span>Shop All Panjabis</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/shop?category=d-tex-micro-stitch"
                className="w-full sm:w-auto min-w-[210px] bg-[#1c1712]/90 hover:bg-[#282119] text-[#f5eedb] text-center font-medium px-8 py-3.5 rounded-xl border border-[#c9933a]/30 backdrop-blur-md transition-all shadow-lg"
              >
                D-Tex Micro Stitch (৳1,450)
              </Link>
            </div>
            

            {/* Trust Highlights - Expanded horizontally to eliminate side empty space */}
            <div className="pt-8 sm:pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 border-t border-[#c9933a]/25 w-full max-w-4xl lg:max-w-5xl mx-auto text-center">
              <div className="bg-[#18130e]/85 border border-[#c9933a]/25 rounded-2xl py-3.5 px-6 backdrop-blur-md shadow-lg">
                <strong className="block text-[#f7f3eb] text-sm sm:text-base font-semibold">Delivery: ৳115 / ৳130</strong>
                <span className="text-xs text-[#a89b88] mt-0.5 block">ঢাকা ১১৫৳ | বাইরে ১৩০৳</span>
              </div>
              <div className="bg-[#18130e]/85 border border-[#c9933a]/25 rounded-2xl py-3.5 px-6 backdrop-blur-md shadow-lg">
                <strong className="block text-[#f7f3eb] text-sm sm:text-base font-semibold">ক্যাশ অন ডেলিভারি</strong>
                <span className="text-xs text-[#a89b88] mt-0.5 block">পণ্য চেক করে নেওয়ার সুবিধা</span>
              </div>
              <div className="bg-[#18130e]/85 border border-[#c9933a]/25 rounded-2xl py-3.5 px-6 backdrop-blur-md shadow-lg">
                <strong className="block text-[#f7f3eb] text-sm sm:text-base font-semibold">100% গ্যারান্টি</strong>
                <span className="text-xs text-[#a89b88] mt-0.5 block">কালার ও ফেব্রিক গ্যারান্টি</span>
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
            Featured Panjabi & Arabian Thobes
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#c9933a] to-transparent mx-auto my-3" />
          <p className="text-sm text-[#a89b88]">
            ডি-টেক্স মাইক্রো স্টিচ, চায়না পপকর্ন এবং ওমানি পেপসি কটনের নিখুঁত ফিনিশিং ও এলিগেন্ট কালেকশন।
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
                <span>THE SUNNAH & ATELIER STORY</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#f7f3eb] leading-tight">
                আভিজাত্য ও সুন্নাহর ছোঁয়ায় <br />
                <span className="gold-gradient-text italic font-serif">Style, Comfort & Elegance</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#c9933a] italic font-serif leading-relaxed border-l-2 border-[#c9933a]/40 pl-3">
                “If you love the Messenger of Allah ﷺ, then build your life through the Sunnah.”
              </p>

              <p className="text-sm text-[#b8ab99] leading-relaxed">
                Yah SABAB এ আমরা নিয়ে এসেছি প্রিমিয়াম ডি-টেক্স মাইক্রো স্টিচ এবং ওমানি রয়্যাল পেপসি কটন ফ্যাব্রিকের অনন্য সম্ভার। গরমের দিনেও আরামদায়ক অনুভূতি, ১০০% কালার গ্যারান্টি এবং প্রতিটি পোশাকে সুক্ষ্ম সেলাই ফিনিশিং।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#221b14] border border-[#c9933a]/20">
                  <Layers className="w-5 h-5 text-[#c9933a] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#f7f3eb]">D-Tex Micro Stitch</h4>
                    <p className="text-xs text-[#8c8071] mt-0.5">অত্যন্ত সফট, লাইটওয়েট এবং ধোয়ার পরও সাইজ ও উজ্জ্বলতা অটুট।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#221b14] border border-[#c9933a]/20">
                  <Scissors className="w-5 h-5 text-[#c9933a] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#f7f3eb]">Soft Pepsi Cotton</h4>
                    <p className="text-xs text-[#8c8071] mt-0.5">Imported Royal Oman quality, সুপার ব্রিদেবল ও মার্জিত কাট।</p>
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
                  <span className="text-xs font-bold text-[#c9933a] uppercase tracking-widest">Arabic Kanduri & Panjabi</span>
                  <p className="text-sm font-semibold text-[#f7f3eb]">দৈনন্দিন ব্যবহার, জুমার নামাজ ও ঈদের জন্য নিখুঁত</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROMOTIONAL FESTIVE OFFER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1f1912] via-[#14100c] to-[#0c0a08] text-white p-8 sm:p-14 shadow-2xl border border-[#c9933a]/40 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4 text-center lg:text-left z-10">
            <span className="bg-[#c9933a] text-[#0e0c0a] font-black text-xs uppercase px-3.5 py-1 rounded-full tracking-wider shadow-md">
              SPECIAL OFFER — মাত্র ১,৪৫০৳
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-[#f7f3eb]">
              D-Tex Micro Stitch Panjabi: <span className="gold-gradient-text">অফার প্রাইস ৳১,৪৫০</span>
            </h2>
            <p className="text-[#d6cdbf] text-sm leading-relaxed">
              মূল্য সম্পূর্ণ ফিক্সড — কোনো দরদাম নয়। ঢাকা ডেলিভারি ১১৫ টাকা | ঢাকার বাইরে ১৩০ টাকা। পণ্য হাতে পেয়ে চেক করে নেওয়ার সম্পূর্ণ সুবিধা!
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 justify-center lg:justify-start">
              <Link
                href="/shop?category=d-tex-micro-stitch"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] font-bold px-8 py-3.5 rounded-xl transition-all shadow-xl hover:opacity-95"
              >
                <span>Order Online</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/96878343923"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1c2e21] border border-emerald-500/40 text-emerald-300 font-semibold px-6 py-3.5 rounded-xl hover:bg-[#253f2c] transition-colors text-xs"
              >
                <span>WhatsApp: +96878343923</span>
              </a>
            </div>
          </div>

          <div className="relative w-full max-w-sm aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-[#c9933a]/30">
            <img
              src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800"
              alt="D-Tex Micro Stitch Panjabi"
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
              <h3 className="font-serif font-bold text-[#f7f3eb] text-lg">D-Tex & Pepsi Cotton</h3>
              <p className="text-xs text-[#a89b88] leading-relaxed">
                অত্যন্ত সফট, লাইটওয়েট ও গরমের দিনেও আরামদায়ক ফিলিংসের প্রিমিয়াম ফেব্রিক।
              </p>
            </div>

            <div className="bg-[#1c1712] p-6 rounded-2xl border border-[#c9933a]/20 shadow-md text-center space-y-3">
              <div className="w-12 h-12 bg-[#2a2117] text-[#c9933a] rounded-xl flex items-center justify-center mx-auto border border-[#c9933a]/30">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-[#f7f3eb] text-lg">Fixed Delivery</h3>
              <p className="text-xs text-[#a89b88] leading-relaxed">
                ঢাকা: ১১৫ টাকা | ঢাকার বাইরে: ১৩০ টাকা। সারা বাংলাদেশে নির্ভরযোগ্য কুরিয়ার।
              </p>
            </div>

            <div className="bg-[#1c1712] p-6 rounded-2xl border border-[#c9933a]/20 shadow-md text-center space-y-3">
              <div className="w-12 h-12 bg-[#2a2117] text-[#c9933a] rounded-xl flex items-center justify-center mx-auto border border-[#c9933a]/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-[#f7f3eb] text-lg">পণ্য চেক সুবিধা</h3>
              <p className="text-xs text-[#a89b88] leading-relaxed">
                হোম ডেলিভারিতে পণ্য হাতে পেয়ে চেক করে নেওয়ার ১০০% সুযোগ।
              </p>
            </div>

            <div className="bg-[#1c1712] p-6 rounded-2xl border border-[#c9933a]/20 shadow-md text-center space-y-3">
              <div className="w-12 h-12 bg-[#2a2117] text-[#c9933a] rounded-xl flex items-center justify-center mx-auto border border-[#c9933a]/30">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-[#f7f3eb] text-lg">Fixed Price Policy</h3>
              <p className="text-xs text-[#a89b88] leading-relaxed">
                মূল্য সম্পূর্ণ ফিক্সড — কোনো দরদাম নয়। সর্বোচ্চ কোয়ালিটিতে নিশ্চিত সেরা মূল্য।
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
              "D-Tex Micro Stitch পাঞ্জাবিটা সত্যি অসাধারণ সফট। গরমে পরে অনেক আরাম পেয়েছি। ঢাকায় ডেলিভারি মাত্র ১১৫ টাকায় ২৪ ঘণ্টায় পেয়েছি!"
            </p>
            <div className="pt-2 border-t border-[#c9933a]/15 flex items-center justify-between">
              <span className="font-bold text-sm text-[#f7f3eb]">মো. রফিকুল ইসলাম</span>
              <span className="text-xs text-emerald-400 font-semibold bg-[#12281c] border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                ঢাকা
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
              "Soft Pepsi Cotton Arabian Thobe নিয়েছিলাম। ফেব্রিকের ড্রেপ এবং নিখুঁত ফিনিশিং ওমানের রয়্যাল কোয়ালিটির মতো। জুমার নামাজে সবাই পছন্দ করেছে।"
            </p>
            <div className="pt-2 border-t border-[#c9933a]/15 flex items-center justify-between">
              <span className="font-bold text-sm text-[#f7f3eb]">আবু বকর সিদ্দিক</span>
              <span className="text-xs text-emerald-400 font-semibold bg-[#12281c] border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                চট্টগ্রাম
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
              "China Popcorn Panjabi টা হাতে পেয়ে চেক করে ডেলিভারি ম্যানকে পেমেন্ট করেছি। ছবির সাথে ১০০% মিল পেয়েছি। Yah SABAB কোয়ালিটি অতুলনীয়।"
            </p>
            <div className="pt-2 border-t border-[#c9933a]/15 flex items-center justify-between">
              <span className="font-bold text-sm text-[#f7f3eb]">ফাহিম তানভীর</span>
              <span className="text-xs text-emerald-400 font-semibold bg-[#12281c] border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                সিলেট
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
