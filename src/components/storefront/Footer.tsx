'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RotateCcw, Clock } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function Footer() {
  const { settings } = useStore();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-amber-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 mb-2">
              <img src="/logo.png" alt="Yah SABAB" className="w-10 h-10 object-contain bg-white rounded-lg p-1" />
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                  Yah SABAB <span className="text-amber-400 font-sans text-lg font-normal">| ইয়াহ সাবাব</span>
                </span>
                <p className="text-[10px] text-amber-200/80 tracking-widest uppercase -mt-1">
                  Heritage & Modern Elegance for Men
                </p>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              Yah SABAB is a premier Bangladeshi menswear brand specializing in handcrafted embroidery, fine long-staple Egyptian cotton Panjabis, Peshawari Kabli sets, and velvet waistcoats. Tailored for Eid, Jummah, weddings, and special celebrations.
            </p>

            <div className="pt-2 space-y-2 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{settings?.address || 'House 42, Road 11, Banani, Dhaka-1213, Bangladesh'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`tel:${settings?.phone}`} className="hover:text-amber-400 transition-colors">
                  {settings?.phone || '01711223344'}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`mailto:${settings?.email}`} className="hover:text-amber-400 transition-colors">
                  {settings?.email || 'support@naborupa.com'}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4 tracking-wide border-b border-amber-800/40 pb-2">
              Collections
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/shop?category=panjabi" className="hover:text-amber-400 transition-colors">
                  Embroidered Panjabi
                </Link>
              </li>
              <li>
                <Link href="/shop?category=kabli-suit" className="hover:text-amber-400 transition-colors">
                  Peshawari Kabli Suits
                </Link>
              </li>
              <li>
                <Link href="/shop?category=combo" className="hover:text-amber-400 transition-colors">
                  Exclusive Festive Combos
                </Link>
              </li>
              <li>
                <Link href="/shop?category=koti" className="hover:text-amber-400 transition-colors">
                  Velvet & Jacquard Kotis
                </Link>
              </li>
              <li>
                <Link href="/shop?category=pajama" className="hover:text-amber-400 transition-colors">
                  Aligarh Cotton Pajamas
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4 tracking-wide border-b border-amber-800/40 pb-2">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/account" className="hover:text-amber-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  Shipping & Delivery Info
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  Returns & Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  Size Guide & Care Instructions
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-amber-400 transition-colors">
                  Store Owner Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Delivery & Payment Methods */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4 tracking-wide border-b border-amber-800/40 pb-2">
              Payment & Delivery
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Fast delivery across all 64 districts in Bangladesh. We accept:
            </p>
            {/* Payment Method Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-pink-900/60 border border-pink-700/50 text-pink-200 text-xs px-2.5 py-1 rounded-md font-semibold">
                bKash
              </span>
              <span className="bg-orange-900/60 border border-orange-700/50 text-orange-200 text-xs px-2.5 py-1 rounded-md font-semibold">
                Nagad
              </span>
              <span className="bg-purple-900/60 border border-purple-700/50 text-purple-200 text-xs px-2.5 py-1 rounded-md font-semibold">
                Rocket
              </span>
              <span className="bg-emerald-900/60 border border-emerald-700/50 text-emerald-200 text-xs px-2.5 py-1 rounded-md font-semibold">
                Cash on Delivery
              </span>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Inside Dhaka: ৳{settings?.insideDhakaFee || 80} (24-48 Hours)</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Outside Dhaka: ৳{settings?.outsideDhakaFee || 130} (2-4 Days)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Yah SABAB Bangladesh. All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
