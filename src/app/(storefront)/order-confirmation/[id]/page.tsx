'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, Truck, Package, ShieldCheck, MapPin, Phone } from 'lucide-react';
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
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-amber-900">
        <div className="w-10 h-10 border-4 border-amber-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="font-semibold text-sm">Fetching order confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-slate-900">Order Not Found</h2>
        <p className="text-slate-500 text-sm mt-1 mb-6">Could not locate order details for #{id}.</p>
        <Link href="/shop" className="bg-amber-900 text-white font-bold text-sm px-6 py-3 rounded-xl">
          Return to Shop
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Top Banner */}
      <div className="bg-emerald-950 text-white p-8 rounded-3xl text-center space-y-3 shadow-xl border border-emerald-900">
        <CheckCircle2 className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
        <h1 className="font-serif text-3xl font-bold">Order Received!</h1>
        <p className="text-emerald-100 text-sm max-w-md mx-auto">
          Thank you for choosing Nabo Rūpa. Your order <strong className="text-amber-400 font-mono text-lg">{order.orderNumber}</strong> has been successfully registered.
        </p>
        <div className="inline-block bg-emerald-900 text-amber-300 font-bold text-xs px-4 py-1.5 rounded-full mt-2">
          Current Status: {order.orderStatus} ({order.paymentInfo?.status})
        </div>
      </div>

      {/* Order Tracking Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Truck className="w-5 h-5 text-amber-900" />
          <span>Live Order Tracking Timeline</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          {steps.map((step, idx) => {
            const isDone = step.status.includes(order.orderStatus);
            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isDone
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-400'
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
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">bKash/Nagad Payment Pending Verification</strong>
              <span>Our accounts team is verifying your Transaction ID <code className="font-bold">{order.paymentInfo?.transactionId}</code>. Once verified, your status will update to Confirmed automatically.</span>
            </div>
          </div>
        )}
      </div>

      {/* Order Details & Address Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer & Shipping Info */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-serif font-bold text-slate-900 text-lg border-b border-slate-100 pb-2">
            Shipping Address
          </h3>
          <div className="text-xs text-slate-600 space-y-2">
            <p className="font-bold text-slate-900 text-sm">{order.shippingAddress?.fullName}</p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-800" />
              <span>{order.shippingAddress?.phone}</span>
            </p>
            <p className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-800 shrink-0 mt-0.5" />
              <span>
                {order.shippingAddress?.address}, {order.shippingAddress?.area}, {order.shippingAddress?.district}
              </span>
            </p>
            <div className="pt-2 border-t border-slate-100 text-slate-800 font-semibold">
              Payment Method: <span className="text-amber-900 font-bold">{order.paymentInfo?.method}</span>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-serif font-bold text-slate-900 text-lg border-b border-slate-100 pb-2">
            Payment Summary
          </h3>
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({order.couponCode})</span>
                <span>-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-semibold text-slate-900">{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-amber-950 pt-2 border-t border-slate-200">
              <span>Total Paid / Payable</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/shop"
          className="bg-amber-900 text-white font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-amber-950 transition-colors shadow-md inline-block"
        >
          Continue Shopping
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
    <React.Suspense fallback={<div className="p-12 text-center text-slate-500 font-semibold">Loading confirmation details...</div>}>
      <OrderConfirmationContent params={params} />
    </React.Suspense>
  );
}
