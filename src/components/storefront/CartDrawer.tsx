'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartSubtotal, settings } = useStore();

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings?.freeShippingThreshold || 3500;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercentage = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-amber-950/10 flex items-center justify-between bg-amber-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-900" />
              <h2 className="font-serif text-lg font-bold text-amber-950">Your Shopping Bag</h2>
              <span className="bg-amber-900 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-amber-100 text-slate-600 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-amber-900 text-white px-5 py-3 text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="flex items-center gap-1.5 font-medium mb-1.5">
                <Truck className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  Add <strong className="text-amber-300 font-bold">{formatPrice(remainingForFreeShipping)}</strong> more to get <span className="underline decoration-amber-400">FREE Express Delivery</span>!
                </span>
              </p>
            ) : (
              <p className="flex items-center gap-1.5 font-bold text-amber-300 mb-1.5">
                <Truck className="w-4 h-4 text-amber-300 shrink-0" />
                <span>🎉 Congratulations! You unlocked FREE Delivery across Bangladesh!</span>
              </p>
            )}
            <div className="w-full bg-amber-950/80 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-400 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-amber-100/70 rounded-full flex items-center justify-center text-amber-900 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">Your bag is empty</h3>
                <p className="text-sm text-slate-500 max-w-xs mb-6">
                  Explore our exclusive Panjabi, Kabli, and Pajama collections to place an order.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="bg-amber-900 text-white font-medium text-sm px-6 py-2.5 rounded-lg hover:bg-amber-950 transition-colors shadow-xs"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              cart.map((item, index) => {
                const effectivePrice = item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price;
                return (
                  <div
                    key={`${item.productId}-${item.size || index}`}
                    className="flex gap-4 p-3 rounded-xl border border-slate-100 hover:border-amber-200 bg-white transition-all shadow-2xs"
                  >
                    <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-semibold text-slate-900 line-clamp-1 pr-2">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.productId, item.size)}
                            className="text-slate-400 hover:text-red-600 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {item.size && (
                          <span className="inline-block mt-1 text-[11px] font-semibold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                            Size: {item.size}
                          </span>
                        )}
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-sm font-bold text-amber-950">
                            {formatPrice(effectivePrice)}
                          </span>
                          {item.discountPrice && item.discountPrice < item.price && (
                            <span className="text-xs text-slate-400 line-through">
                              {formatPrice(item.price)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, -1)}
                            className="p-1 hover:bg-slate-200 text-slate-700 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, 1)}
                            className="p-1 hover:bg-slate-200 text-slate-700 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-xs font-semibold text-slate-700">
                          Subtotal: {formatPrice(effectivePrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-amber-950/10 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-xs">
                  <span>Estimated Delivery Fee</span>
                  <span className="text-amber-800">Calculated at Checkout</span>
                </div>
                <div className="flex justify-between text-base font-bold text-amber-950 pt-2 border-t border-slate-200">
                  <span>Subtotal</span>
                  <span className="text-lg">{formatPrice(cartSubtotal)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center py-3 rounded-lg text-sm font-bold border border-amber-900 text-amber-900 hover:bg-amber-100 transition-colors"
                >
                  View Full Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-lg text-sm font-bold bg-amber-900 text-white hover:bg-amber-950 transition-colors shadow-md"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
