'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('2000');
  const [maxDiscountAmount, setMaxDiscountAmount] = useState('1000');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ text: '', isError: false });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/seed'); // seed endpoint initializes sample coupons or fetch route
      // Let's create an inline fetch from DB if needed
      setCoupons([
        { code: 'EID20', discountType: 'percentage', discountValue: 20, minOrderAmount: 2000, maxDiscountAmount: 1000, usedCount: 14, isActive: true },
        { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minOrderAmount: 1000, maxDiscountAmount: 500, usedCount: 42, isActive: true },
        { code: 'FLAT300', discountType: 'fixed', discountValue: 300, minOrderAmount: 3000, usedCount: 8, isActive: true }
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) return;

    setCoupons((prev) => [
      {
        code: code.toUpperCase().trim(),
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderAmount: parseFloat(minOrderAmount || '0'),
        maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : undefined,
        usedCount: 0,
        isActive: true
      },
      ...prev
    ]);

    setCode('');
    setDiscountValue('');
    setMsg({ text: `Coupon ${code.toUpperCase()} created successfully!`, isError: false });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <h1 className="font-serif text-2xl font-bold text-slate-900">
          Discount & Coupon Codes
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Create promotional percentage discounts or fixed BDT promo codes with minimum order constraints.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Create Coupon Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 h-fit">
          <h2 className="font-serif font-bold text-slate-900 text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-900" />
            <span>Create Promo Coupon</span>
          </h2>

          {msg.text && (
            <div className={`p-3 rounded-xl text-xs font-bold ${msg.isError ? 'bg-rose-50 text-rose-800' : 'bg-emerald-50 text-emerald-800'}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Coupon Code *</label>
              <input required type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. EID20" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono font-bold uppercase focus:outline-hidden" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Discount Type *</label>
              <select value={discountType} onChange={(e: any) => setDiscountType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold">
                <option value="percentage">Percentage Discount (%)</option>
                <option value="fixed">Fixed BDT Amount (৳)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Discount Value *</label>
              <input required type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder={discountType === 'percentage' ? '20 (%)' : '300 (৳)'} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Minimum Order Amount (৳)</label>
              <input type="number" value={minOrderAmount} onChange={(e) => setMinOrderAmount(e.target.value)} placeholder="2000" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold" />
            </div>

            <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-xs bg-amber-900 text-white hover:bg-amber-950 transition-colors shadow-md">
              Create Coupon
            </button>
          </form>
        </div>

        {/* Coupons List */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-serif font-bold text-base text-slate-900">
            Active Store Promo Codes
          </div>

          <div className="divide-y divide-slate-100">
            {coupons.map((c, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-amber-50/40 transition-colors text-xs">
                <div className="space-y-1">
                  <span className="font-mono text-base font-bold text-amber-950 bg-amber-100 px-3 py-1 rounded-lg border border-amber-300 inline-block">
                    {c.code}
                  </span>
                  <div className="text-slate-600 font-medium pt-1">
                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `৳${c.discountValue} OFF`} on orders above ৳{c.minOrderAmount}
                  </div>
                </div>

                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-full text-[10px]">
                    Active ({c.usedCount} times used)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
