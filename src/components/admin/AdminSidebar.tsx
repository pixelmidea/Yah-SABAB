'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Tag,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Store,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useStore();

  const navItems = [
    { label: 'Overview & Analytics', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders & Payments', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Product Catalog', href: '/admin/products', icon: Package },
    { label: 'Inventory & Stock', href: '/admin/inventory', icon: SlidersHorizontal },
    { label: 'Categories', href: '/admin/categories', icon: Layers },
    { label: 'Coupons & Discounts', href: '/admin/coupons', icon: Tag },
    { label: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <img src="/logo.png" alt="Yah SABAB" className="w-9 h-9 object-contain bg-white rounded-lg p-0.5 shrink-0" />
        <div>
          <span className="font-serif text-lg font-bold text-amber-400 block leading-none">
            Yah SABAB <span className="text-white text-xs font-sans font-normal">ADMIN</span>
          </span>
          <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-1">
            Store Owner Dashboard
          </p>
        </div>
      </div>

      {/* Admin User Info */}
      {user && (
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-3 text-xs">
          <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="truncate">
            <div className="font-bold text-white truncate">{user.name}</div>
            <div className="text-[10px] text-amber-400 uppercase font-semibold">Store Owner</div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-amber-900/80 text-white font-bold border border-amber-700/50 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-amber-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Storefront & Logout Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
        >
          <Store className="w-4 h-4 text-amber-400" />
          <span>View Customer Storefront</span>
        </Link>

        <button
          onClick={async () => {
            await logout();
            router.push('/auth/login');
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-rose-400 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
