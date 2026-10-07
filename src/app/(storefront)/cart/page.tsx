'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, Loader2, Check } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-serif text-3xl font-bold text-slate-900 mb-8">
        Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
      </h1>

      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-900 mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-xl font-bold text-slate-900">Your Cart is Currently Empty</h2>
          <p className="text-slate-500 text-sm mt-1 mb-6">
            Explore our handcrafted menswear collections and add items to your cart.
          </p>
          <Link
            href="/shop"
            className="bg-amber-900 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-amber-950 transition-colors inline-block"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Item List Table */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, idx) => {
              const effectivePrice = item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price;
              return (
                <div
                  key={`${item.productId}-${item.size || idx}`}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-24 object-cover rounded-xl bg-slate-100 shrink-0"
                    />
                    <div>
                      <h3 className="font-serif font-bold text-slate-900 text-base line-clamp-1">
                        {item.name}
                      </h3>
                      {item.size && (
                        <span className="inline-block text-xs font-semibold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md mt-1">
                          Size: {item.size}
                        </span>
                      )}
                      <div className="text-sm font-bold text-amber-950 mt-1">
                        {formatPrice(effectivePrice)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, -1)}
                        className="p-1.5 text-slate-700 hover:bg-slate-200"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-bold text-xs text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, 1)}
                        className="p-1.5 text-slate-700 hover:bg-slate-200"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">
                        {formatPrice(effectivePrice * item.quantity)}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId, item.size)}
                        className="text-xs text-rose-600 hover:underline flex items-center gap-1 mt-0.5 ml-auto"
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs h-fit space-y-6">
            <h2 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h2>

            {/* Coupon Code Box */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Have a Coupon Code?
              </label>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter code (e.g. EID20)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold uppercase focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={validatingCoupon}
                  className="bg-amber-900 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-amber-950 transition-colors shrink-0 flex items-center gap-1"
                >
                  {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                </button>
              </form>
              {couponMsg.text && (
                <p className={`text-xs font-semibold mt-2 ${couponMsg.isError ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 text-sm border-t border-slate-100 pt-4">
              <div className="flex justify-between text-slate-600">
                <span>Cart Subtotal</span>
                <span className="font-semibold text-slate-900">{formatPrice(cartSubtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold text-xs">
                  <span>Coupon Discount ({appliedCouponCode})</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Estimated Delivery Fee</span>
                <span className="font-semibold text-slate-900">
                  {isFreeDelivery ? 'FREE' : `~${formatPrice(estimatedDelivery)}`}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold text-amber-950 pt-3 border-t border-slate-200">
                <span>Total Amount</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm bg-amber-900 text-white hover:bg-amber-950 transition-colors shadow-md"
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
