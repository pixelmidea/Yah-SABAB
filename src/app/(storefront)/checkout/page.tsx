'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Truck, CreditCard, Check, Loader2, Info } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatPrice, validateBDPhoneNumber } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, clearCart, settings, user } = useStore();

  // Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [district, setDistrict] = useState('Dhaka');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'bKash' | 'Nagad' | 'Rocket'>('COD');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [couponCode, setCouponCode] = useState('');

  // Status & Error
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Delivery Fee Calculation
  const isDhaka = district.trim().toLowerCase() === 'dhaka';
  const freeThreshold = settings?.freeShippingThreshold || 3500;
  const isFreeDelivery = cartSubtotal >= freeThreshold;
  const deliveryFee = isFreeDelivery
    ? 0
    : isDhaka
    ? settings?.insideDhakaFee || 80
    : settings?.outsideDhakaFee || 130;

  const totalAmount = cartSubtotal + deliveryFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !phone.trim() || !district || !area.trim() || !address.trim()) {
      setErrorMsg('Please fill in all required shipping address fields.');
      return;
    }

    if (!validateBDPhoneNumber(phone)) {
      setErrorMsg('Please enter a valid Bangladesh mobile phone number (e.g. 01712345678).');
      return;
    }

    if (paymentMethod !== 'COD') {
      if (!senderNumber.trim() || !transactionId.trim()) {
        setErrorMsg(`Please enter your ${paymentMethod} sender number and Transaction ID.`);
        return;
      }
    }

    setLoading(true);

    try {
      const orderPayload = {
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          discountPrice: item.discountPrice,
          size: item.size,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName,
          phone,
          email,
          district,
          area,
          address
        },
        paymentMethod,
        senderNumber: paymentMethod !== 'COD' ? senderNumber : undefined,
        transactionId: paymentMethod !== 'COD' ? transactionId : undefined,
        couponCode: couponCode ? couponCode : undefined
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (data.success && data.order) {
        clearCart();
        router.push(`/order-confirmation/${data.order.orderNumber.replace('#', '')}`);
      } else {
        setErrorMsg(data.error || 'Failed to place order. Please try again.');
      }
    } catch (err: any) {
      console.error('Order error', err);
      setErrorMsg('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-slate-500 text-sm mt-1 mb-6">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => router.push('/shop')}
          className="bg-amber-900 text-white font-bold text-sm px-6 py-3 rounded-xl"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-serif text-3xl font-bold text-slate-900 mb-8">
        Checkout & Payment
      </h1>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center gap-2">
          <Info className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Customer Address & Payment Selection */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. Customer Delivery Address */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <h2 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-900" />
              <span>1. Delivery Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tanvir Hossain"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-amber-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01712345678"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-amber-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-amber-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  District *
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-hidden focus:border-amber-800"
                >
                  <option value="Dhaka">Dhaka (৳80 Delivery)</option>
                  <option value="Chittagong">Chittagong (৳130 Delivery)</option>
                  <option value="Sylhet">Sylhet (৳130 Delivery)</option>
                  <option value="Rajshahi">Rajshahi (৳130 Delivery)</option>
                  <option value="Khulna">Khulna (৳130 Delivery)</option>
                  <option value="Barisal">Barisal (৳130 Delivery)</option>
                  <option value="Rangpur">Rangpur (৳130 Delivery)</option>
                  <option value="Mymensingh">Mymensingh (৳130 Delivery)</option>
                  <option value="Cumilla">Cumilla (৳130 Delivery)</option>
                  <option value="Gazipur">Gazipur (৳130 Delivery)</option>
                  <option value="Narayanganj">Narayanganj (৳130 Delivery)</option>
                  <option value="Other">Other 64 Districts (৳130 Delivery)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Area / Thana *
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Dhanmondi / Banani / Agrabad"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-amber-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Street Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House number, Road number, Apartment/Flat details..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-amber-800"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method Selection */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <h2 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-900" />
              <span>2. Select Payment Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* COD Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-amber-900 bg-amber-50/70 ring-2 ring-amber-900/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-amber-400'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                  paymentMethod === 'COD' ? 'border-amber-900 bg-amber-900 text-white' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'COD' && <Check className="w-3 h-3" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Cash on Delivery (COD)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Pay in cash when you receive your order at your doorstep.</p>
                </div>
              </button>

              {/* bKash Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bKash')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'bKash'
                    ? 'border-pink-700 bg-pink-50/70 ring-2 ring-pink-700/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-pink-400'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                  paymentMethod === 'bKash' ? 'border-pink-700 bg-pink-700 text-white' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'bKash' && <Check className="w-3 h-3" />}
                </div>
                <div>
                  <h4 className="font-bold text-pink-900 text-sm">bKash Mobile Payment</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Send money to our bKash merchant number & verify Trx ID.</p>
                </div>
              </button>

              {/* Nagad Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Nagad')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'Nagad'
                    ? 'border-orange-700 bg-orange-50/70 ring-2 ring-orange-700/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-orange-400'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                  paymentMethod === 'Nagad' ? 'border-orange-700 bg-orange-700 text-white' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'Nagad' && <Check className="w-3 h-3" />}
                </div>
                <div>
                  <h4 className="font-bold text-orange-950 text-sm">Nagad Payment</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Instant Nagad money transfer with transaction submission.</p>
                </div>
              </button>

              {/* Rocket Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Rocket')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'Rocket'
                    ? 'border-purple-700 bg-purple-50/70 ring-2 ring-purple-700/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-purple-400'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                  paymentMethod === 'Rocket' ? 'border-purple-700 bg-purple-700 text-white' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'Rocket' && <Check className="w-3 h-3" />}
                </div>
                <div>
                  <h4 className="font-bold text-purple-950 text-sm">Rocket Payment</h4>
                  <p className="text-xs text-slate-500 mt-0.5">DBBL Rocket payment transfer.</p>
                </div>
              </button>
            </div>

            {/* Manual Payment Verification Submission Box */}
            {paymentMethod !== 'COD' && (
              <div className="p-5 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-4 animate-in fade-in">
                <div className="text-xs text-amber-950 space-y-1">
                  <p className="font-bold text-sm">
                    📲 How to Pay via {paymentMethod}:
                  </p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Go to your {paymentMethod} App or dial code (*247# for bKash).</li>
                    <li>Choose <strong>Send Money</strong> or <strong>Payment</strong>.</li>
                    <li>
                      Enter Business Number:{' '}
                      <strong className="text-amber-900 font-mono text-sm">
                        {paymentMethod === 'bKash'
                          ? settings?.bkashNumber || '01711002233'
                          : paymentMethod === 'Nagad'
                          ? settings?.nagadNumber || '01811002233'
                          : settings?.rocketNumber || '01911002233'}
                      </strong>
                    </li>
                    <li>Enter Amount: <strong>{formatPrice(totalAmount)}</strong></li>
                  </ol>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Your {paymentMethod} Sender Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Transaction ID (TrxID) *
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                      placeholder="e.g. BK89X77A12"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-xs font-mono uppercase font-bold focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Confirm Button */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs h-fit space-y-6">
          <h2 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-3">
            Order Items ({cart.length})
          </h2>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {cart.map((item, idx) => (
              <div key={idx} className="flex gap-3 text-xs">
                <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-lg bg-slate-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 truncate">{item.name}</h4>
                  {item.size && <span className="text-slate-500">Size: {item.size}</span>}
                  <div className="text-amber-900 font-bold mt-0.5">
                    {item.quantity} x {formatPrice(item.discountPrice || item.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm border-t border-slate-100 pt-4 text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">{formatPrice(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee ({district})</span>
              <span className="font-semibold text-slate-900">
                {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-amber-950 pt-3 border-t border-slate-200">
              <span>Total Amount</span>
              <span className="text-xl">{formatPrice(totalAmount)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-sm bg-amber-900 text-white hover:bg-amber-950 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <span>Place Order ({formatPrice(totalAmount)})</span>
            )}
          </button>

          <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted & Safe Checkout</span>
          </p>
        </div>
      </form>
    </div>
  );
}
