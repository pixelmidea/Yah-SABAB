'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Truck, CreditCard, Check, Loader2, Info, Sparkles } from 'lucide-react';
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
        userId: user?._id || user?.id || null,
        items: cart.map((i) => ({
          productId: i.productId,
          name: i.name,
          slug: i.slug,
          image: i.image,
          price: i.discountPrice && i.discountPrice > 0 ? i.discountPrice : i.price,
          size: i.size,
          quantity: i.quantity
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
        paymentDetails: paymentMethod !== 'COD' ? {
          senderNumber,
          transactionId
        } : undefined,
        subtotal: cartSubtotal,
        deliveryFee,
        total: totalAmount
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
      <div className="max-w-3xl mx-auto px-4 py-24 text-center text-[#f7f3eb]">
        <h2 className="font-serif text-3xl font-bold">Your Bag is Empty</h2>
        <p className="text-[#a89b88] text-sm mt-1.5 mb-6">Please add garments to your bag before proceeding to checkout.</p>
        <button
          onClick={() => router.push('/shop')}
          className="bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] font-bold text-xs uppercase px-7 py-3.5 rounded-xl shadow-lg"
        >
          Return to Collections
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#f7f3eb]">
      <div className="flex items-center gap-2 text-xs font-bold text-[#c9933a] uppercase tracking-widest mb-1.5">
        <Sparkles className="w-3.5 h-3.5" />
        <span>SECURE EXPRESS CHECKOUT</span>
      </div>
      <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#f7f3eb] mb-10">
        Order Dispatch & Settlement
      </h1>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-[#381419] border border-red-500/40 text-red-200 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
          <Info className="w-5 h-5 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Address & Payment */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. Customer Delivery Address */}
          <div className="bg-[#14100c] p-6 sm:p-8 rounded-3xl border border-[#c9933a]/25 shadow-xl space-y-5">
            <h2 className="font-serif text-xl font-bold text-[#f7f3eb] border-b border-[#c9933a]/20 pb-3 flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-[#c9933a]" />
              <span>1. Delivery Destination</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#b8ab99] uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tanvir Hossain"
                  className="w-full bg-[#1c1611] border border-[#c9933a]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#f7f3eb] placeholder:text-[#6e6153] focus:outline-hidden focus:border-[#c9933a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#b8ab99] uppercase tracking-wider mb-1.5">
                  Mobile Number (BD) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01712345678"
                  className="w-full bg-[#1c1611] border border-[#c9933a]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#f7f3eb] placeholder:text-[#6e6153] focus:outline-hidden focus:border-[#c9933a] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#b8ab99] uppercase tracking-wider mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#1c1611] border border-[#c9933a]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#f7f3eb] placeholder:text-[#6e6153] focus:outline-hidden focus:border-[#c9933a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#b8ab99] uppercase tracking-wider mb-1.5">
                  District *
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-[#1c1611] border border-[#c9933a]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#f7f3eb] font-semibold focus:outline-hidden focus:border-[#c9933a] cursor-pointer"
                >
                  <option value="Dhaka" className="bg-[#1c1611]">Dhaka (৳80 Delivery)</option>
                  <option value="Chittagong" className="bg-[#1c1611]">Chittagong (৳130 Delivery)</option>
                  <option value="Sylhet" className="bg-[#1c1611]">Sylhet (৳130 Delivery)</option>
                  <option value="Rajshahi" className="bg-[#1c1611]">Rajshahi (৳130 Delivery)</option>
                  <option value="Khulna" className="bg-[#1c1611]">Khulna (৳130 Delivery)</option>
                  <option value="Barisal" className="bg-[#1c1611]">Barisal (৳130 Delivery)</option>
                  <option value="Rangpur" className="bg-[#1c1611]">Rangpur (৳130 Delivery)</option>
                  <option value="Mymensingh" className="bg-[#1c1611]">Mymensingh (৳130 Delivery)</option>
                  <option value="Cumilla" className="bg-[#1c1611]">Cumilla (৳130 Delivery)</option>
                  <option value="Gazipur" className="bg-[#1c1611]">Gazipur (৳130 Delivery)</option>
                  <option value="Narayanganj" className="bg-[#1c1611]">Narayanganj (৳130 Delivery)</option>
                  <option value="Other" className="bg-[#1c1611]">Other 64 Districts (৳130 Delivery)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#b8ab99] uppercase tracking-wider mb-1.5">
                  Area / Thana *
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Banani / Dhanmondi / Agrabad / Amberkhana"
                  className="w-full bg-[#1c1611] border border-[#c9933a]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#f7f3eb] placeholder:text-[#6e6153] focus:outline-hidden focus:border-[#c9933a]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#b8ab99] uppercase tracking-wider mb-1.5">
                  Full Street Address & Holding *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House number, Road number, Apartment/Flat details..."
                  className="w-full bg-[#1c1611] border border-[#c9933a]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#f7f3eb] placeholder:text-[#6e6153] focus:outline-hidden focus:border-[#c9933a]"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method Selection */}
          <div className="bg-[#14100c] p-6 sm:p-8 rounded-3xl border border-[#c9933a]/25 shadow-xl space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#f7f3eb] border-b border-[#c9933a]/20 pb-3 flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-[#c9933a]" />
              <span>2. Verified Settlement Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* COD Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-[#c9933a] bg-[#221a12] shadow-lg ring-1 ring-[#c9933a]/40'
                    : 'border-[#2d2419] bg-[#16120e] hover:border-[#c9933a]/50'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                  paymentMethod === 'COD' ? 'border-[#c9933a] bg-[#c9933a] text-[#0e0c0a]' : 'border-[#4a3d2e]'
                }`}>
                  {paymentMethod === 'COD' && <Check className="w-3 h-3 stroke-3" />}
                </div>
                <div>
                  <h4 className="font-bold text-[#f7f3eb] text-sm">Cash on Delivery (COD)</h4>
                  <p className="text-xs text-[#8c8071] mt-0.5">Pay cash upon inspecting parcel at your doorstep.</p>
                </div>
              </button>

              {/* bKash Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bKash')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'bKash'
                    ? 'border-[#e2136e] bg-[#221017] shadow-lg ring-1 ring-[#e2136e]/40'
                    : 'border-[#2d2419] bg-[#16120e] hover:border-[#e2136e]/40'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                  paymentMethod === 'bKash' ? 'border-[#e2136e] bg-[#e2136e] text-white' : 'border-[#4a3d2e]'
                }`}>
                  {paymentMethod === 'bKash' && <Check className="w-3 h-3 stroke-3" />}
                </div>
                <div>
                  <h4 className="font-bold text-[#fca5a5] text-sm">bKash Merchant Pay</h4>
                  <p className="text-xs text-[#8c8071] mt-0.5">Instant payment via bKash App with TrxID submission.</p>
                </div>
              </button>

              {/* Nagad Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Nagad')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'Nagad'
                    ? 'border-[#f97316] bg-[#24130d] shadow-lg ring-1 ring-[#f97316]/40'
                    : 'border-[#2d2419] bg-[#16120e] hover:border-[#f97316]/40'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                  paymentMethod === 'Nagad' ? 'border-[#f97316] bg-[#f97316] text-white' : 'border-[#4a3d2e]'
                }`}>
                  {paymentMethod === 'Nagad' && <Check className="w-3 h-3 stroke-3" />}
                </div>
                <div>
                  <h4 className="font-bold text-[#fed7aa] text-sm">Nagad Payment</h4>
                  <p className="text-xs text-[#8c8071] mt-0.5">Direct money transfer through official Nagad account.</p>
                </div>
              </button>

              {/* Rocket Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Rocket')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'Rocket'
                    ? 'border-[#a855f7] bg-[#1c1126] shadow-lg ring-1 ring-[#a855f7]/40'
                    : 'border-[#2d2419] bg-[#16120e] hover:border-[#a855f7]/40'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                  paymentMethod === 'Rocket' ? 'border-[#a855f7] bg-[#a855f7] text-white' : 'border-[#4a3d2e]'
                }`}>
                  {paymentMethod === 'Rocket' && <Check className="w-3 h-3 stroke-3" />}
                </div>
                <div>
                  <h4 className="font-bold text-[#e9d5ff] text-sm">Rocket Payment</h4>
                  <p className="text-xs text-[#8c8071] mt-0.5">DBBL Rocket wallet settlement with TrxID verification.</p>
                </div>
              </button>
            </div>

            {/* Manual Payment Verification Submission Box */}
            {paymentMethod !== 'COD' && (
              <div className="p-5 bg-[#1b1510] rounded-2xl border border-[#c9933a]/30 space-y-4 animate-in fade-in">
                <div className="text-xs text-[#d6cdbf] space-y-1">
                  <p className="font-bold text-sm text-[#c9933a]">
                    📲 Payment Instructions ({paymentMethod}):
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-[#b8ab99]">
                    <li>Open your {paymentMethod} App (or dial USSD code).</li>
                    <li>Select <strong>Send Money</strong> or <strong>Payment</strong>.</li>
                    <li>
                      Account Number:{' '}
                      <strong className="text-[#f5eedb] font-mono text-sm">
                        {paymentMethod === 'bKash'
                          ? settings?.bkashNumber || '01711002233'
                          : paymentMethod === 'Nagad'
                          ? settings?.nagadNumber || '01811002233'
                          : settings?.rocketNumber || '01911002233'}
                      </strong>
                    </li>
                    <li>Amount: <strong className="text-[#c9933a]">{formatPrice(totalAmount)}</strong></li>
                  </ol>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#b8ab99] uppercase tracking-wider mb-1">
                      Sender Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full bg-[#120f0c] border border-[#c9933a]/30 rounded-xl px-3 py-2.5 text-xs font-bold text-[#f7f3eb] focus:outline-hidden focus:border-[#c9933a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#b8ab99] uppercase tracking-wider mb-1">
                      Transaction ID (TrxID) *
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                      placeholder="e.g. BK89X77A12"
                      className="w-full bg-[#120f0c] border border-[#c9933a]/30 rounded-xl px-3 py-2.5 text-xs font-mono uppercase font-bold text-[#c9933a] focus:outline-hidden focus:border-[#c9933a]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Confirm Button */}
        <div className="bg-[#14100c] p-6 sm:p-7 rounded-3xl border border-[#c9933a]/25 shadow-xl h-fit space-y-6">
          <h2 className="font-serif font-bold text-xl text-[#f7f3eb] border-b border-[#c9933a]/20 pb-3">
            Garments ({cart.length})
          </h2>

          <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
            {cart.map((item, idx) => (
              <div key={idx} className="flex gap-3 text-xs">
                <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-lg bg-[#201811] border border-[#c9933a]/20 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#f7f3eb] truncate">{item.name}</h4>
                  {item.size && <span className="text-[#8c8071]">Size: {item.size}</span>}
                  <div className="text-[#c9933a] font-bold mt-0.5">
                    {item.quantity} x {formatPrice(item.discountPrice || item.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs sm:text-sm border-t border-[#c9933a]/20 pt-4 text-[#a89b88]">
            <div className="flex justify-between">
              <span>Garments Total</span>
              <span className="font-semibold text-[#f7f3eb]">{formatPrice(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Express Delivery ({district})</span>
              <span className="font-semibold text-[#f7f3eb]">
                {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#f7f3eb] pt-3 border-t border-[#c9933a]/20">
              <span>Final Settlement</span>
              <span className="text-xl text-[#c9933a]">{formatPrice(totalAmount)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] hover:opacity-95 transition-opacity shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Securing Order...</span>
              </>
            ) : (
              <span>Confirm & Place Order ({formatPrice(totalAmount)})</span>
            )}
          </button>

          <p className="text-[11px] text-[#786c5c] text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#c9933a]" />
            <span>Encrypted & Verified Checkout</span>
          </p>
        </div>
      </form>
    </div>
  );
}
