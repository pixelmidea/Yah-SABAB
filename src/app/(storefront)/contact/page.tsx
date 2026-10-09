'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, Check, Sparkles } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function ContactPage() {
  const { settings } = useStore();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 text-[#f7f3eb]">
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#c9933a] uppercase tracking-widest bg-[#221a12] px-3.5 py-1 rounded-full border border-[#c9933a]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CONCIERGE & SUPPORT</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#f7f3eb]">
          Contact Concierge
        </h1>
        <p className="text-xs sm:text-sm text-[#a89b88]">
          Have a query about sizing, festive custom orders, or bKash payment verification? Our Banani, Dhaka concierge is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="bg-[#14100c] p-6 rounded-3xl border border-[#c9933a]/25 shadow-xl space-y-2">
            <div className="w-10 h-10 bg-[#221a12] text-[#c9933a] border border-[#c9933a]/30 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-[#f7f3eb] text-base">Call / WhatsApp</h3>
            <p className="text-xs text-[#8c8071]">Saturday to Thursday (10:00 AM - 8:00 PM)</p>
            <a href={`tel:${settings?.phone || '01711223344'}`} className="text-sm font-bold text-[#c9933a] hover:underline block pt-1">
              {settings?.phone || '+880 1711-223344'}
            </a>
          </div>

          <div className="bg-[#14100c] p-6 rounded-3xl border border-[#c9933a]/25 shadow-xl space-y-2">
            <div className="w-10 h-10 bg-[#221a12] text-[#c9933a] border border-[#c9933a]/30 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-[#f7f3eb] text-base">Email Concierge</h3>
            <p className="text-xs text-[#8c8071]">For order inquiries & bespoke bridal requests</p>
            <a href={`mailto:${settings?.email || 'support@yahsabab.com'}`} className="text-sm font-bold text-[#c9933a] hover:underline block pt-1">
              {settings?.email || 'support@yahsabab.com'}
            </a>
          </div>

          <div className="bg-[#14100c] p-6 rounded-3xl border border-[#c9933a]/25 shadow-xl space-y-2">
            <div className="w-10 h-10 bg-[#221a12] text-[#c9933a] border border-[#c9933a]/30 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-[#f7f3eb] text-base">Atelier HQ</h3>
            <p className="text-xs text-[#8c8071]">Flagship studio & dispatch center</p>
            <p className="text-xs font-semibold text-[#f5eedb] pt-1">
              {settings?.address || 'House 42, Road 11, Banani, Dhaka-1213, Bangladesh'}
            </p>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-2 bg-[#14100c] p-8 sm:p-10 rounded-3xl border border-[#c9933a]/25 shadow-xl">
          <h2 className="font-serif text-2xl font-bold text-[#f7f3eb] mb-6">
            Send an Inquiry
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#b8ab99] uppercase tracking-wider mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Tanvir Ahmed"
                  className="w-full bg-[#1c1611] border border-[#c9933a]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#f7f3eb] placeholder:text-[#6e6153] focus:outline-hidden focus:border-[#c9933a]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#b8ab99] uppercase tracking-wider mb-1.5">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  className="w-full bg-[#1c1611] border border-[#c9933a]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#f7f3eb] placeholder:text-[#6e6153] focus:outline-hidden focus:border-[#c9933a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#b8ab99] uppercase tracking-wider mb-1.5">
                Message / Order Inquiries *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Inquire about fitting, fabric texture, or order tracking..."
                className="w-full bg-[#1c1611] border border-[#c9933a]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#f7f3eb] placeholder:text-[#6e6153] focus:outline-hidden focus:border-[#c9933a]"
              />
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl hover:opacity-95 transition-opacity shadow-lg flex items-center justify-center gap-2"
            >
              {submitted ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Message Dispatched</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Dispatch Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
