'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, User, LogOut, ExternalLink, Sparkles } from 'lucide-react';
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
      <div className="max-w-4xl mx-auto px-4 py-28 text-center text-[#c9933a]">
        <p className="font-serif font-semibold text-sm">Opening customer lounge...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-[#f7f3eb]">
      {/* Header Profile Summary */}
      <div className="bg-[#14100c] p-6 sm:p-8 rounded-3xl border border-[#c9933a]/25 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c9933a] to-[#ab752b] text-[#0e0c0a] font-serif text-2xl font-black flex items-center justify-center shadow-lg border border-[#f5eedb]/30">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#f7f3eb]">{user.name}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#2a2016] text-[#c9933a] border border-[#c9933a]/30 px-2 py-0.5 rounded-full">
                {user.role === 'admin' ? 'Atelier Admin' : 'VIP Member'}
              </span>
            </div>
            <p className="text-xs text-[#a89b88] mt-0.5">{user.email} • {user.phone || 'No phone set'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'admin' && (
            <Link
              href="/admin"
              className="bg-[#2a2016] text-[#c9933a] border border-[#c9933a]/40 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#382b1d] transition-colors"
            >
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl border border-red-500/30 text-red-300 hover:bg-[#2e1317] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#c9933a]/20 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'orders'
              ? 'bg-[#c9933a] text-[#0e0c0a] shadow-md'
              : 'text-[#a89b88] hover:text-[#f7f3eb] hover:bg-[#1a140f]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Order History ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'profile'
              ? 'bg-[#c9933a] text-[#0e0c0a] shadow-md'
              : 'text-[#a89b88] hover:text-[#f7f3eb] hover:bg-[#1a140f]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Member Profile</span>
        </button>
      </div>

      {/* Order History Tab */}
      {activeTab === 'orders' && (
        <div>
          {loadingOrders ? (
            <div className="py-16 text-center text-[#c9933a]">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="bg-[#14100c] rounded-3xl border border-[#c9933a]/25 p-12 text-center max-w-md mx-auto">
              <Package className="w-12 h-12 text-[#c9933a] mx-auto mb-3" />
              <h3 className="font-serif text-xl font-bold text-[#f7f3eb]">No Orders Yet</h3>
              <p className="text-xs text-[#a89b88] mt-1 mb-6">You have not placed any orders yet with Yah SABAB.</p>
              <Link
                href="/shop"
                className="bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] font-bold text-xs uppercase px-6 py-3 rounded-xl inline-block"
              >
                Explore Collections
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o._id} className="bg-[#14100c] p-5 rounded-2xl border border-[#c9933a]/20 shadow-md space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#c9933a]/15 gap-2">
                    <div>
                      <span className="font-mono font-bold text-[#c9933a] text-sm">{o.orderNumber}</span>
                      <span className="text-xs text-[#8c8071] ml-2">
                        {new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#1e2a1e] text-[#bbf7d0] border border-emerald-500/30">
                        {o.orderStatus}
                      </span>
                      <Link
                        href={`/order-confirmation/${o.orderNumber.replace('#', '')}`}
                        className="text-xs font-semibold text-[#c9933a] hover:underline flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {o.items?.map((it: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <img src={it.image} alt={it.name} className="w-10 h-12 object-cover rounded-md bg-[#221a12]" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#f7f3eb] truncate">{it.name}</p>
                          <p className="text-[#8c8071]">Qty: {it.quantity} {it.size ? `• Size: ${it.size}` : ''}</p>
                        </div>
                        <span className="font-bold text-[#c9933a]">{formatPrice(it.price * it.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#c9933a]/15 flex justify-between items-center text-xs">
                    <span className="text-[#a89b88]">Payment: {o.paymentInfo?.method} ({o.paymentInfo?.status})</span>
                    <span className="font-bold text-sm text-[#f7f3eb]">Total: <span className="text-[#c9933a]">{formatPrice(o.totalAmount)}</span></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-[#14100c] p-6 sm:p-8 rounded-3xl border border-[#c9933a]/25 shadow-xl max-w-xl space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#f7f3eb] border-b border-[#c9933a]/20 pb-3">
            Profile Details
          </h3>
          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <span className="text-[#8c8071] block">Full Name:</span>
              <span className="font-semibold text-[#f7f3eb]">{user.name}</span>
            </div>
            <div>
              <span className="text-[#8c8071] block">Email Address:</span>
              <span className="font-semibold text-[#f7f3eb]">{user.email}</span>
            </div>
            <div>
              <span className="text-[#8c8071] block">Registered Contact:</span>
              <span className="font-semibold text-[#f7f3eb]">{user.phone || 'None recorded'}</span>
            </div>
            <div>
              <span className="text-[#8c8071] block">Account Classification:</span>
              <span className="font-semibold text-[#c9933a] uppercase">{user.role}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
