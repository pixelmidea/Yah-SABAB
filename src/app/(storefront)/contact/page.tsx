'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Check } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          WE ARE HERE TO HELP
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Contact Customer Care
        </h1>
        <p className="text-sm text-slate-500">
          Have a question about order status, size sizing, or bKash payment verification? Get in touch with our Dhaka team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-slate-900 text-base">Call / WhatsApp</h3>
            <p className="text-xs text-slate-500">Saturday to Thursday (10:00 AM - 8:00 PM)</p>
            <a href={`tel:${settings?.phone}`} className="text-sm font-bold text-amber-900 hover:underline block pt-1">
              {settings?.phone || '01711223344'}
            </a>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-slate-900 text-base">Email Support</h3>
            <p className="text-xs text-slate-500">For order inquiries & business partnerships</p>
            <a href={`mailto:${settings?.email}`} className="text-sm font-bold text-amber-900 hover:underline block pt-1">
              {settings?.email || 'support@naborupa.com'}
            </a>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-slate-900 text-base">Store & Office HQ</h3>
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              {settings?.address || 'House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh'}
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6">Send Us a Direct Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Your Name</label>
                <input required type="text" placeholder="Tanvir Hossain" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-amber-800" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Number</label>
                <input required type="tel" placeholder="01712345678" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-amber-800" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Message / Order Inquiry</label>
              <textarea required rows={4} placeholder="How can we assist you with your order?" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-amber-800" />
            </div>

            <button
              type="submit"
              className="bg-amber-900 text-white font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-amber-950 transition-colors shadow-md flex items-center gap-2"
            >
              {submitted ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Message Sent Successfully!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
