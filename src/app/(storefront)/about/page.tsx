import React from 'react';
import { Award, ShieldCheck, Truck, Sparkles, Scissors, Crown } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20 text-[#f7f3eb]">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#c9933a] uppercase tracking-widest bg-[#221a12] px-4 py-1.5 rounded-full border border-[#c9933a]/30 shadow-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>THE YAH SABAB ATELIER STORY</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#f7f3eb] leading-tight">
          Redefining Heritage Menswear for the Modern Gentleman
        </h1>
        <p className="font-bangla text-[#c9933a] text-lg font-medium">
          বাঙালি ঐতিহ্যের অহংকার ও আভিজাত্যের নিখুঁত মেলবন্ধন
        </p>
        <p className="text-sm sm:text-base text-[#b8ab99] leading-relaxed">
          Yah SABAB (ইয়াহ সাবাব) was founded with a singular conviction: to craft world-class Panjabis, Peshawari Kablis, and festive sets that blend sacred South Asian hand-embroidery traditions with contemporary gentleman's tailoring.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-[#181410] border border-[#c9933a]/30 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1200"
            alt="Craftsmanship"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
            <span className="text-xs uppercase font-bold tracking-widest text-[#c9933a]">Handmade in Bangladesh</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#c9933a] uppercase tracking-widest">
            <Crown className="w-4 h-4" />
            <span>EXCELLENCE IN EVERY STITCH</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#f7f3eb]">
            Uncompromised Quality & Royal Fabric
          </h2>
          <p className="text-xs sm:text-sm text-[#a89b88] leading-relaxed">
            Every garment begins with carefully chosen 100% long-staple Egyptian Giza cotton, handpicked silk blends, and rich velvet. Our master artisans in Dhaka meticulously execute collar embroidery and precision button placements for timeless drape.
          </p>
          <div className="space-y-3 pt-2 text-xs font-semibold text-[#f5eedb]">
            <div className="flex items-center gap-3.5 p-3.5 bg-[#17130f] rounded-2xl border border-[#c9933a]/20">
              <Award className="w-5 h-5 text-[#c9933a] shrink-0" />
              <span>100% Breathable Egyptian Cotton & Fine Silk Blends</span>
            </div>
            <div className="flex items-center gap-3.5 p-3.5 bg-[#17130f] rounded-2xl border border-[#c9933a]/20">
              <Truck className="w-5 h-5 text-[#c9933a] shrink-0" />
              <span>Express Delivery across all 64 Districts in Bangladesh</span>
            </div>
            <div className="flex items-center gap-3.5 p-3.5 bg-[#17130f] rounded-2xl border border-[#c9933a]/20">
              <ShieldCheck className="w-5 h-5 text-[#c9933a] shrink-0" />
              <span>Trusted Cash on Delivery & Direct bKash/Nagad Verification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
