'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, Truck, MapPin, Phone, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

function OrderConfirmationContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      }
    } catch (e) {
      console.error('Fetch order error', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-28 text-center text-[#c9933a]">
        <div className="w-10 h-10 border-4 border-[#c9933a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="font-serif font-semibold text-sm">Retrieving your order record...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center text-[#f7f3eb]">
        <h2 className="font-serif text-3xl font-bold">Order Not Found</h2>
        <p className="text-[#a89b88] text-sm mt-1.5 mb-6">Could not locate order details for #{id}.</p>
        <Link href="/shop" className="bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] font-bold text-xs uppercase px-7 py-3.5 rounded-xl shadow-lg">
          Return to Collections
        </Link>
      </div>
    );
  }

  const steps = [
    { title: 'Order Placed', status: ['Pending', 'Payment Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'] },
    { title: 'Payment Verified', status: ['Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'] },
    { title: 'Processing & Packed', status: ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'] },
    { title: 'Shipped', status: ['Shipped', 'Out for Delivery', 'Delivered'] },
    { title: 'Delivered', status: ['Delivered'] }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 text-[#f7f3eb]">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-[#1c291e] via-[#121c14] to-[#0c140e] text-white p-8 sm:p-10 rounded-3xl text-center space-y-3.5 shadow-2xl border border-emerald-500/30">
        <CheckCircle2 className="w-16 h-16 text-[#c9933a] mx-auto animate-pulse" />
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#c9933a] uppercase tracking-widest bg-[#1c261d] px-3.5 py-1 rounded-full border border-emerald-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ORDER SECURED</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold">Thank You for Choosing Yah SABAB</h1>
        <p className="text-emerald-100/80 text-sm max-w-md mx-auto">
          Your bespoke order <strong className="text-[#c9933a] font-mono text-lg">{order.orderNumber}</strong> has been registered into our Dhaka dispatch system.
        </p>
        <div className="inline-block bg-[#16271a] text-[#bbf7d0] border border-emerald-500/30 font-bold text-xs px-4 py-1.5 rounded-full mt-2">
          Current Status: {order.orderStatus} ({order.paymentInfo?.status})
        </div>
      </div>

      {/* Order Tracking Timeline */}
      <div className="bg-[#14100c] p-6 sm:p-8 rounded-3xl border border-[#c9933a]/25 shadow-xl space-y-6">
        <h2 className="font-serif font-bold text-xl text-[#f7f3eb] border-b border-[#c9933a]/20 pb-3 flex items-center gap-2.5">
          <Truck className="w-5 h-5 text-[#c9933a]" />
          <span>Live Order Tracking Timeline</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          {steps.map((step, idx) => {
            const isDone = step.status.includes(order.orderStatus);
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  isDone
                    ? 'border-emerald-500/40 bg-[#14261a] text-[#bbf7d0] font-bold shadow-sm'
                    : 'border-[#2d2419] bg-[#1a140f] text-[#6e6153]'
                }`}
              >
                <div className="text-xs font-semibold">{step.title}</div>
                <div className="mt-1 text-[10px]">
                  {isDone ? '✓ Completed' : 'Pending'}
                </div>
              </div>
            );
          })}
        </div>

        {order.paymentInfo?.method !== 'COD' && order.paymentInfo?.status === 'Payment Pending' && (
          <div className="p-4 bg-[#241a12] rounded-2xl border border-[#c9933a]/30 text-xs text-[#d6cdbf] flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#c9933a] shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-[#f7f3eb]">bKash/Nagad Payment Pending Verification</strong>
              <span>Our concierge accounts team is confirming your TrxID <code className="text-[#c9933a] font-bold">{order.paymentInfo?.transactionId}</code>. Once verified, order status updates automatically.</span>
            </div>
          </div>
        )}
      </div>

      {/* Order Details & Address Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-[#14100c] p-6 rounded-3xl border border-[#c9933a]/25 shadow-xl space-y-3">
          <h3 className="font-serif font-bold text-[#f7f3eb] text-lg border-b border-[#c9933a]/20 pb-2">
            Dispatch Address
          </h3>
          <div className="text-xs text-[#a89b88] space-y-2">
            <p className="font-bold text-[#f7f3eb] text-sm">{order.shippingAddress?.fullName}</p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#c9933a]" />
              <span>{order.shippingAddress?.phone}</span>
            </p>
            <p className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#c9933a] shrink-0 mt-0.5" />
              <span>
                {order.shippingAddress?.address}, {order.shippingAddress?.area}, {order.shippingAddress?.district}
              </span>
            </p>
            <div className="pt-2 border-t border-[#c9933a]/15 text-[#f5eedb] font-semibold">
              Payment Method: <span className="text-[#c9933a] font-bold">{order.paymentInfo?.method}</span>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-[#14100c] p-6 rounded-3xl border border-[#c9933a]/25 shadow-xl space-y-3">
          <h3 className="font-serif font-bold text-[#f7f3eb] text-lg border-b border-[#c9933a]/20 pb-2">
            Financial Settlement
          </h3>
          <div className="space-y-1.5 text-xs text-[#a89b88]">
            <div className="flex justify-between">
              <span>Garments Subtotal</span>
              <span className="font-semibold text-[#f7f3eb]">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Voucher Privilege ({order.couponCode})</span>
                <span>-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-semibold text-[#f7f3eb]">{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#f7f3eb] pt-2 border-t border-[#c9933a]/20">
              <span>Total Settlement</span>
              <span className="text-[#c9933a] text-lg">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/shop"
          className="bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl hover:opacity-95 transition-opacity shadow-lg inline-block"
        >
          Explore More Pieces
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <React.Suspense fallback={<div className="p-16 text-center text-[#c9933a] font-serif">Loading confirmation details...</div>}>
      <OrderConfirmationContent params={params} />
    </React.Suspense>
  );
}
