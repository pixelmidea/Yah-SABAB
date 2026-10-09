'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Sparkles } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartSubtotal, settings } = useStore();

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings?.freeShippingThreshold || 3500;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercentage = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-[#f7f3eb]">
      {/* Dark Luxury Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#120f0c] shadow-2xl flex flex-col border-l border-[#c9933a]/30 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#c9933a]/20 flex items-center justify-between bg-[#18130f]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#c9933a]" />
              <h2 className="font-serif text-lg font-bold text-[#f7f3eb]">Your Shopping Bag</h2>
              <span className="bg-[#c9933a] text-[#0e0c0a] text-xs font-black px-2 py-0.5 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-[#261f18] text-[#a89b88] hover:text-[#f7f3eb] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#1c1611] border-b border-[#c9933a]/20 px-5 py-3 text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="flex items-center gap-1.5 font-medium mb-1.5 text-[#d6cdbf]">
                <Truck className="w-4 h-4 text-[#c9933a] shrink-0" />
                <span>
                  Add <strong className="text-[#c9933a] font-bold">{formatPrice(remainingForFreeShipping)}</strong> more for <span className="text-[#f5eedb] underline decoration-[#c9933a]">FREE Delivery</span>!
                </span>
              </p>
            ) : (
              <p className="flex items-center gap-1.5 font-bold text-[#bbf7d0] mb-1.5">
                <Sparkles className="w-4 h-4 text-[#c9933a] shrink-0" />
                <span>🎉 Privilege Unlocked: FREE Nationwide Express Delivery!</span>
              </p>
            )}
            <div className="w-full bg-[#2a2117] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#c9933a] to-[#ab752b] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-[#201811] border border-[#c9933a]/30 rounded-full flex items-center justify-center text-[#c9933a] mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#f7f3eb] mb-1">Your bag is currently empty</h3>
                <p className="text-xs sm:text-sm text-[#8c8071] max-w-xs mb-6">
                  Explore our exclusive Panjabi and Kabli collections to place your order.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:opacity-95 transition-opacity shadow-md"
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
                    className="flex gap-4 p-3.5 rounded-2xl border border-[#c9933a]/20 bg-[#16120e] hover:border-[#c9933a]/40 transition-all shadow-md"
                  >
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#201811] shrink-0 border border-[#c9933a]/20">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-semibold text-[#f7f3eb] line-clamp-1 pr-2">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.productId, item.size)}
                            className="text-[#8c8071] hover:text-red-400 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {item.size && (
                          <span className="inline-block mt-1 text-[10px] font-bold text-[#c9933a] bg-[#292017] border border-[#c9933a]/30 px-2 py-0.5 rounded-md">
                            Size: {item.size}
                          </span>
                        )}
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-sm font-bold text-[#c9933a]">
                            {formatPrice(effectivePrice)}
                          </span>
                          {item.discountPrice && item.discountPrice < item.price && (
                            <span className="text-xs text-[#6e6153] line-through">
                              {formatPrice(item.price)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#c9933a]/15">
                        <div className="flex items-center border border-[#c9933a]/30 rounded-lg overflow-hidden bg-[#1f1913]">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, -1)}
                            className="p-1 hover:bg-[#2c231b] text-[#c9933a] transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-[#f7f3eb]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, 1)}
                            className="p-1 hover:bg-[#2c231b] text-[#c9933a] transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-xs font-semibold text-[#a89b88]">
                          {formatPrice(effectivePrice * item.quantity)}
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
            <div className="p-5 border-t border-[#c9933a]/20 bg-[#16120e] space-y-3">
              <div className="space-y-1.5 text-xs sm:text-sm">
                <div className="flex justify-between text-[#a89b88]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#f7f3eb]">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-[#a89b88] text-xs">
                  <span>Nationwide Courier</span>
                  <span className="text-[#c9933a]">Calculated at Checkout</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#f7f3eb] pt-2 border-t border-[#c9933a]/20">
                  <span>Total Amount</span>
                  <span className="text-lg text-[#c9933a]">{formatPrice(cartSubtotal)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center py-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-[#c9933a]/40 text-[#f5eedb] hover:bg-[#221a13] transition-colors"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] hover:opacity-95 transition-opacity shadow-md"
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
