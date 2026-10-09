'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Truck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function Footer() {
  const { settings } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#090807] text-[#c7bcab] pt-16 pb-12 border-t border-[#c9933a]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Signup VIP Club Bar */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#1b1510] via-[#241c14] to-[#17120d] border border-[#c9933a]/30 p-8 sm:p-10 mb-16 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#c9933a] uppercase tracking-widest bg-[#2b2116] px-3 py-1 rounded-full border border-[#c9933a]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE YAH SABAB INSIDERS</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#f7f3eb]">
              Receive Exclusive Festive Drops & Privileges
            </h3>
            <p className="text-xs sm:text-sm text-[#a89b88]">
              Be the first to preview our limited Eid collections and secret festive discounts.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full max-w-md flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              className="flex-1 bg-[#120f0c] border border-[#c9933a]/40 text-[#f7f3eb] placeholder:text-[#786c5c] text-sm px-4 py-3 rounded-xl focus:outline-hidden focus:border-[#c9933a]"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 shrink-0"
            >
              {subscribed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Joined</span>
                </>
              ) : (
                <>
                  <span>Join Club</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#c9933a]/20">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3.5 mb-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2a2218] via-[#1c1712] to-[#0f0c09] p-0.5 border border-[#c9933a]/40 shadow-md">
                <img
                  src="/logo.png"
                  alt="Yah SABAB"
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-[#f7f3eb] block">
                  Yah SABAB <span className="text-[#c9933a] font-bangla text-lg font-normal">| ইয়াহ সাবাব</span>
                </span>
                <p className="text-[10px] text-[#c9933a] tracking-[0.25em] uppercase font-sans font-medium -mt-0.5">
                  Heritage & Modern Elegance
                </p>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-[#a89b88] leading-relaxed pr-4">
              Yah SABAB is a premier Bangladeshi menswear atelier specializing in handcrafted neck embroidery, fine long-staple Egyptian cotton Panjabis, and Peshawari Kablis. Tailored for Eid, Jummah, weddings, and distinguished celebrations.
            </p>

            <div className="pt-2 space-y-2.5 text-xs sm:text-sm text-[#d6cdbf]">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#c9933a] shrink-0" />
                <span>{settings?.address || 'House 42, Road 11, Banani, Dhaka-1213, Bangladesh'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#c9933a] shrink-0" />
                <a href={`tel:${settings?.phone || '01711223344'}`} className="hover:text-[#c9933a] transition-colors">
                  {settings?.phone || '+880 1711-223344'}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#c9933a] shrink-0" />
                <a href={`mailto:${settings?.email || 'support@yahsabab.com'}`} className="hover:text-[#c9933a] transition-colors">
                  {settings?.email || 'support@yahsabab.com'}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h4 className="font-serif text-base font-bold text-[#f7f3eb] mb-4 tracking-wide border-b border-[#c9933a]/30 pb-2">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/shop?category=panjabi" className="hover:text-[#c9933a] transition-colors">
                  Embroidered Panjabi
                </Link>
              </li>
              <li>
                <Link href="/shop?category=kabli-suit" className="hover:text-[#c9933a] transition-colors">
                  Peshawari Kabli Suits
                </Link>
              </li>
              <li>
                <Link href="/shop?category=combo" className="hover:text-[#c9933a] transition-colors">
                  Festive Royal Combos
                </Link>
              </li>
              <li>
                <Link href="/shop?category=koti" className="hover:text-[#c9933a] transition-colors">
                  Jacquard & Velvet Kotis
                </Link>
              </li>
              <li>
                <Link href="/shop?category=pajama" className="hover:text-[#c9933a] transition-colors">
                  Aligarh Cut Pajamas
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="font-serif text-base font-bold text-[#f7f3eb] mb-4 tracking-wide border-b border-[#c9933a]/30 pb-2">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/account" className="hover:text-[#c9933a] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#c9933a] transition-colors">
                  Shipping & Delivery Info
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#c9933a] transition-colors">
                  Size Guide & Care Instructions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#c9933a] transition-colors">
                  Exchange & Return Policy
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-[#c9933a] transition-colors">
                  Account Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Payment & Express Delivery */}
          <div>
            <h4 className="font-serif text-base font-bold text-[#f7f3eb] mb-4 tracking-wide border-b border-[#c9933a]/30 pb-2">
              Payment & Shipping
            </h4>
            <p className="text-xs text-[#a89b88] mb-3">
              Express Courier throughout all 64 districts in Bangladesh. We accept:
            </p>

            {/* Payment Method Badges */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="bg-[#241017] border border-[#e2136e]/40 text-[#fca5a5] text-[11px] px-2.5 py-1 rounded-md font-bold">
                bKash
              </span>
              <span className="bg-[#26150f] border border-[#f97316]/40 text-[#fed7aa] text-[11px] px-2.5 py-1 rounded-md font-bold">
                Nagad
              </span>
              <span className="bg-[#1c1126] border border-[#a855f7]/40 text-[#e9d5ff] text-[11px] px-2.5 py-1 rounded-md font-bold">
                Rocket
              </span>
              <span className="bg-[#12241a] border border-[#10b981]/40 text-[#a7f3d0] text-[11px] px-2.5 py-1 rounded-md font-bold">
                Cash on Delivery
              </span>
            </div>

            <div className="bg-[#16120e] p-3 rounded-xl border border-[#c9933a]/20 space-y-1.5 text-xs text-[#d6cdbf]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#c9933a] shrink-0" />
                <span>Inside Dhaka: ৳{settings?.insideDhakaFee || 80} (24-48 Hours)</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#c9933a] shrink-0" />
                <span>Outside Dhaka: ৳{settings?.outsideDhakaFee || 130} (2-4 Days)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#786c5c] gap-4">
          <p>© 2026 Yah SABAB (ইয়াহ সাবাব) Bangladesh. All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/about" className="hover:text-[#c9933a] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-[#c9933a] transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-[#c9933a] transition-colors">
              Contact Concierge
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
