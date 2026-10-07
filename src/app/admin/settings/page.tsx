'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2, Check } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function AdminSettingsPage() {
  const { settings, fetchSettings } = useStore();

  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [insideDhakaFee, setInsideDhakaFee] = useState('80');
  const [outsideDhakaFee, setOutsideDhakaFee] = useState('130');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('3500');
  const [bkashNumber, setBkashNumber] = useState('');
  const [nagadNumber, setNagadNumber] = useState('');
  const [rocketNumber, setRocketNumber] = useState('');
  const [announcementBarText, setAnnouncementBarText] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setStoreName(settings.storeName || '');
      setPhone(settings.phone || '');
      setEmail(settings.email || '');
      setAddress(settings.address || '');
      setInsideDhakaFee((settings.insideDhakaFee || 80).toString());
      setOutsideDhakaFee((settings.outsideDhakaFee || 130).toString());
      setFreeShippingThreshold((settings.freeShippingThreshold || 3500).toString());
      setBkashNumber(settings.bkashNumber || '');
      setNagadNumber(settings.nagadNumber || '');
      setRocketNumber(settings.rocketNumber || '');
      setAnnouncementBarText(settings.announcementBarText || '');
    }
  }, [settings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const payload = {
        storeName,
        phone,
        email,
        address,
        insideDhakaFee: parseFloat(insideDhakaFee),
        outsideDhakaFee: parseFloat(outsideDhakaFee),
        freeShippingThreshold: parseFloat(freeShippingThreshold),
        bkashNumber,
        nagadNumber,
        rocketNumber,
        announcementBarText
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        await fetchSettings();
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Settings save error', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            Store & Payment Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure delivery fees, bKash & Nagad merchant numbers, and store contact info.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* 1. Store Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="font-serif font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
            1. Business Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Store Name</label>
              <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold focus:outline-hidden" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Customer Support Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold focus:outline-hidden" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Support Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold focus:outline-hidden" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Headquarters Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold focus:outline-hidden" />
            </div>
          </div>
        </div>

        {/* 2. Bangladesh Delivery Charges */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="font-serif font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
            2. Bangladesh Delivery Fees Configuration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Inside Dhaka Fee (৳)</label>
              <input type="number" value={insideDhakaFee} onChange={(e) => setInsideDhakaFee(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-sm focus:outline-hidden" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Outside Dhaka Fee (৳)</label>
              <input type="number" value={outsideDhakaFee} onChange={(e) => setOutsideDhakaFee(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-sm focus:outline-hidden" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Free Shipping Order Min (৳)</label>
              <input type="number" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-sm focus:outline-hidden" />
            </div>
          </div>
        </div>

        {/* 3. Mobile Payment Numbers */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="font-serif font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
            3. Local Payment Merchant Phone Numbers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-pink-900 uppercase tracking-wider mb-1">bKash Number</label>
              <input type="text" value={bkashNumber} onChange={(e) => setBkashNumber(e.target.value)} className="w-full bg-pink-50/50 border border-pink-200 rounded-xl p-3 font-mono font-bold focus:outline-hidden" />
            </div>

            <div>
              <label className="block font-bold text-orange-950 uppercase tracking-wider mb-1">Nagad Number</label>
              <input type="text" value={nagadNumber} onChange={(e) => setNagadNumber(e.target.value)} className="w-full bg-orange-50/50 border border-orange-200 rounded-xl p-3 font-mono font-bold focus:outline-hidden" />
            </div>

            <div>
              <label className="block font-bold text-purple-950 uppercase tracking-wider mb-1">Rocket Number</label>
              <input type="text" value={rocketNumber} onChange={(e) => setRocketNumber(e.target.value)} className="w-full bg-purple-50/50 border border-purple-200 rounded-xl p-3 font-mono font-bold focus:outline-hidden" />
            </div>
          </div>
        </div>

        {/* 4. Announcement Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3 text-xs">
          <label className="block font-bold text-slate-700 uppercase tracking-wider">Top Banner Announcement Bar Text</label>
          <input type="text" value={announcementBarText} onChange={(e) => setAnnouncementBarText(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:outline-hidden" />
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-4 rounded-2xl font-bold text-sm text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
            savedSuccess ? 'bg-emerald-700' : 'bg-amber-900 hover:bg-amber-950'
          }`}
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : savedSuccess ? (
            <>
              <Check className="w-5 h-5" />
              <span>Settings Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Configuration Settings</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
