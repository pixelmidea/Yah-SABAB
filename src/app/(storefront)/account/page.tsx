'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, User, MapPin, LogOut, ExternalLink, Clock, Truck } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/utils';

export default function CustomerAccountPage() {
  const router = useRouter();
  const { user, loadingUser, logout } = useStore();

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  useEffect(() => {
    if (!loadingUser && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      fetchCustomerOrders();
    }
  }, [user, loadingUser]);

  const fetchCustomerOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Fetch orders error', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (loadingUser || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-sm font-semibold text-amber-900">Loading your account...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Summary */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-900 text-white font-serif text-2xl font-bold flex items-center justify-center shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-xs text-slate-500 font-medium">{user.email} • {user.phone}</p>
            <span className="inline-block bg-amber-100 text-amber-900 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full mt-1">
              Customer Account
            </span>
          </div>
        </div>

        <button
          onClick={async () => {
            await logout();
            router.push('/');
          }}
          className="flex items-center gap-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-4 py-2.5 rounded-xl transition-colors border border-rose-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-amber-900 text-amber-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-amber-900 text-amber-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Addresses</span>
        </button>
      </div>

      {/* TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="text-center py-12 text-slate-500 text-sm">Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-slate-900">No Orders Yet</h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">You haven't placed any orders with Nabo Rūpa yet.</p>
              <Link href="/shop" className="bg-amber-900 text-white font-bold text-xs px-6 py-2.5 rounded-xl">
                Explore Products
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 hover:border-amber-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono text-base font-bold text-amber-950">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-400 ml-2">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-BD')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
                      Status: {order.orderStatus}
                    </span>
                    <Link
                      href={`/order-confirmation/${order.orderNumber.replace('#', '')}`}
                      className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1"
                    >
                      <span>Track Order</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Items preview */}
                <div className="space-y-2">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <img src={item.image} alt={item.name} className="w-10 h-12 object-cover rounded-lg bg-slate-100 shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 line-clamp-1">{item.name}</h4>
                        {item.size && <span className="text-slate-500">Size: {item.size}</span>}
                      </div>
                      <div className="font-bold text-slate-800">
                        {item.quantity} x {formatPrice(item.price)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Payment Method: <strong className="text-slate-800">{order.paymentInfo?.method}</strong> ({order.paymentInfo?.status})
                  </span>
                  <span className="text-base font-bold text-amber-950">
                    Total: {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 max-w-2xl">
          <h2 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-3">
            Profile Information
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">Full Name</label>
              <div className="font-semibold text-slate-900 mt-0.5">{user.name}</div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">Email Address</label>
              <div className="font-semibold text-slate-900 mt-0.5">{user.email}</div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">Phone Number</label>
              <div className="font-semibold text-slate-900 mt-0.5">{user.phone}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
