'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartSubtotal, settings } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState({ text: '', isError: false });
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setValidatingCoupon(true);
    setCouponMsg({ text: '', isError: false });

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotal: cartSubtotal })
      });
      const data = await res.json();

      if (data.success) {
        setCouponDiscount(data.discountAmount);
        setAppliedCouponCode(data.code);
        setCouponMsg({ text: data.message, isError: false });
      } else {
        setCouponDiscount(0);
        setAppliedCouponCode('');
        setCouponMsg({ text: data.error || 'Invalid coupon', isError: true });
      }
    } catch (err) {
      console.error('Coupon error', err);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const freeShippingThreshold = settings?.freeShippingThreshold || 3500;
  const isFreeDelivery = cartSubtotal >= freeShippingThreshold;
  const estimatedDelivery = isFreeDelivery ? 0 : settings?.insideDhakaFee || 80;

  const finalTotal = Math.max(0, cartSubtotal - couponDiscount + estimatedDelivery);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#f7f3eb]">
      <div className="flex items-center gap-2 text-xs font-bold text-[#c9933a] uppercase tracking-widest mb-1.5">
        <Sparkles className="w-3.5 h-3.5" />
        <span>YOUR ATELIER BAG</span>
      </div>
      <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#f7f3eb] mb-10">
        Shopping Bag ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
      </h1>

      {cart.length === 0 ? (
        <div className="bg-[#14100c] rounded-3xl border border-[#c9933a]/30 p-12 text-center max-w-md mx-auto my-12 shadow-2xl">
          <div className="w-16 h-16 bg-[#251e16] border border-[#c9933a]/30 rounded-full flex items-center justify-center text-[#c9933a] mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#f7f3eb]">Your Bag is Currently Empty</h2>
          <p className="text-[#a89b88] text-xs sm:text-sm mt-1.5 mb-6">
            Explore our handcrafted Panjabis and celebratory Kabli sets.
          </p>
          <Link
            href="/shop"
            className="bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] font-bold text-xs uppercase px-7 py-3.5 rounded-xl hover:opacity-95 transition-opacity inline-block shadow-md"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Item List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, idx) => {
              const effectivePrice = item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price;
              return (
                <div
                  key={`${item.productId}-${item.size || idx}`}
                  className="bg-[#15120e] p-4 sm:p-5 rounded-2xl border border-[#c9933a]/20 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-24 object-cover rounded-xl bg-[#201811] border border-[#c9933a]/20 shrink-0"
                    />
                    <div>
                      <h3 className="font-serif font-bold text-[#f7f3eb] text-base line-clamp-1">
                        {item.name}
                      </h3>
                      {item.size && (
                        <span className="inline-block text-[10px] font-bold text-[#c9933a] bg-[#292017] border border-[#c9933a]/30 px-2 py-0.5 rounded-md mt-1">
                          Size: {item.size}
                        </span>
                      )}
                      <div className="text-sm font-bold text-[#c9933a] mt-1">
                        {formatPrice(effectivePrice)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#c9933a]/15">
                    <div className="flex items-center border border-[#c9933a]/30 rounded-xl bg-[#1d1712] overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, -1)}
                        className="p-1.5 text-[#c9933a] hover:bg-[#282018]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-bold text-xs text-[#f7f3eb]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, 1)}
                        className="p-1.5 text-[#c9933a] hover:bg-[#282018]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-[#f7f3eb]">
                        {formatPrice(effectivePrice * item.quantity)}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId, item.size)}
                        className="text-xs text-red-400 hover:underline flex items-center gap-1 mt-0.5 ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Order Summary */}
          <div className="bg-[#14100c] p-6 rounded-2xl border border-[#c9933a]/25 shadow-xl h-fit space-y-6">
            <h2 className="font-serif font-bold text-xl text-[#f7f3eb] border-b border-[#c9933a]/20 pb-3">
              Order Summary
            </h2>

            {/* Coupon Code Box */}
            <div>
              <label className="block text-xs font-bold text-[#b8ab99] uppercase tracking-wider mb-2">
                Have a Festive Coupon?
              </label>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="e.g. EID20"
                  className="w-full bg-[#1c1611] border border-[#c9933a]/30 rounded-xl px-3 py-2 text-xs font-bold uppercase text-[#f7f3eb] focus:outline-hidden focus:border-[#c9933a]"
                />
                <button
                  type="submit"
                  disabled={validatingCoupon}
                  className="bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] font-bold text-xs px-4 py-2 rounded-xl hover:opacity-95 transition-opacity shrink-0 flex items-center gap-1"
                >
                  {validatingCoupon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                </button>
              </form>
              {couponMsg.text && (
                <p className={`text-xs font-semibold mt-2 ${couponMsg.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs sm:text-sm border-t border-[#c9933a]/15 pt-4">
              <div className="flex justify-between text-[#a89b88]">
                <span>Garment Subtotal</span>
                <span className="font-semibold text-[#f7f3eb]">{formatPrice(cartSubtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold text-xs">
                  <span>Voucher Privilege ({appliedCouponCode})</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#a89b88]">
                <span>Express Courier</span>
                <span className="font-semibold text-[#f7f3eb]">
                  {isFreeDelivery ? 'FREE (Privilege)' : `~${formatPrice(estimatedDelivery)}`}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold text-[#f7f3eb] pt-3 border-t border-[#c9933a]/20">
                <span>Total Due</span>
                <span className="text-[#c9933a] text-xl">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] hover:opacity-95 transition-opacity shadow-lg"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
