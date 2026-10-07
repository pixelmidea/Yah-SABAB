import React from 'react';
import Link from 'next/link';
import { Award, ShieldCheck, Truck, Sparkles, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
          THE NABO RŪPA STORY
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
          Redefining Heritage Menswear in Bangladesh
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Nabo Rūpa (নবরূপা) was founded with a singular vision: to craft world-class Panjabis, Peshawari Kablis, and waistcoats that blend rich Bengali embroidery traditions with contemporary menswear tailoring.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1200"
            alt="Craftsmanship"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <h2 className="font-serif text-3xl font-bold text-slate-900">
            Uncompromised Quality & Fabric
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every garment starts with sourcing 100% long-staple Egyptian cotton, fine jacquard silk blends, and premium velvet. Our master artisans in Dhaka painstakingly execute every thread embroidery stitch and metallic button placement.
          </p>
          <div className="space-y-3 pt-2 text-xs font-semibold text-slate-800">
            <div className="flex items-center gap-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200">
              <Award className="w-5 h-5 text-amber-900 shrink-0" />
              <span>100% Breathable Egyptian Cotton & Fine Silk Blends</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200">
              <Truck className="w-5 h-5 text-amber-900 shrink-0" />
              <span>Express Delivery across all 64 Districts in Bangladesh</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200">
              <ShieldCheck className="w-5 h-5 text-amber-900 shrink-0" />
              <span>Trusted Cash on Delivery & Verified bKash/Nagad Payments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
