'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  ShoppingBag,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Tag,
  Settings,
  LogOut,
  Store,
  CreditCard,
  MessageSquare,
  FileText,
  BarChart3,
  Megaphone,
  Wrench,
  Compass
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useStore();
  const [productsOpen, setProductsOpen] = useState(true);

  return (
    <aside className="w-60 bg-[#fafaf8] text-[#334155] flex flex-col shrink-0 min-h-screen border-r border-[#e8e7e1] font-sans">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-[#ecebe5]">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            YS
          </div>
          <span className="font-bold text-sm text-[#0f172a] tracking-tight">
            Yah SABAB
          </span>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto text-xs font-medium">
        {/* Dashboard */}
        <Link
          href="/admin"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
            pathname === '/admin'
              ? 'bg-[#edece6] text-[#0f172a] font-bold'
              : 'text-[#475569] hover:bg-[#f3f2ed] hover:text-[#0f172a]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-[#64748b]" />
          <span>Dashboard</span>
        </Link>

        {/* Users */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl text-[#475569] hover:bg-[#f3f2ed] cursor-pointer">
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-[#64748b]" />
            <span>Users</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8]" />
        </div>

        {/* Products (Group) */}
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={() => setProductsOpen(!productsOpen)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
              pathname.startsWith('/admin/products') || pathname.startsWith('/admin/categories') || pathname.startsWith('/admin/inventory')
                ? 'bg-[#edece6] text-[#0f172a] font-bold'
                : 'text-[#475569] hover:bg-[#f3f2ed]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4 text-[#0f172a]" />
              <span>Products</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[#64748b] transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
          </button>

          {productsOpen && (
            <div className="pl-8 pr-2 py-1 space-y-0.5 text-[11px]">
              <Link
                href="/admin/products"
                className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                  pathname === '/admin/products'
                    ? 'text-[#0f172a] font-bold bg-white shadow-2xs'
                    : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f3f2ed]'
                }`}
              >
                All Products
              </Link>
              <Link
                href="/admin/categories"
                className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                  pathname === '/admin/categories'
                    ? 'text-[#0f172a] font-bold bg-white shadow-2xs'
                    : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f3f2ed]'
                }`}
              >
                Categories
              </Link>
              <Link
                href="/admin/inventory"
                className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                  pathname === '/admin/inventory'
                    ? 'text-[#0f172a] font-bold bg-white shadow-2xs'
                    : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f3f2ed]'
                }`}
              >
                Inventory
              </Link>
            </div>
          )}
        </div>

        {/* Transactions / Orders */}
        <Link
          href="/admin/orders"
          className={`flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
            pathname.startsWith('/admin/orders')
              ? 'bg-[#edece6] text-[#0f172a] font-bold'
              : 'text-[#475569] hover:bg-[#f3f2ed]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-[#64748b]" />
            <span>Orders & Shipping</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#94a3b8]" />
        </Link>

        {/* Coupons */}
        <Link
          href="/admin/coupons"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
            pathname.startsWith('/admin/coupons')
              ? 'bg-[#edece6] text-[#0f172a] font-bold'
              : 'text-[#475569] hover:bg-[#f3f2ed]'
          }`}
        >
          <Tag className="w-4 h-4 text-[#64748b]" />
          <span>Promotions & Coupons</span>
        </Link>

        {/* Analytics */}
        <Link
          href="/admin"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-[#475569] hover:bg-[#f3f2ed]"
        >
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-4 h-4 text-[#64748b]" />
            <span>Analytics</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8]" />
        </Link>

        {/* Settings */}
        <Link
          href="/admin/settings"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
            pathname.startsWith('/admin/settings')
              ? 'bg-[#edece6] text-[#0f172a] font-bold'
              : 'text-[#475569] hover:bg-[#f3f2ed]'
          }`}
        >
          <Settings className="w-4 h-4 text-[#64748b]" />
          <span>Settings</span>
        </Link>
      </nav>

      {/* Bottom User Profile & Storefront Link */}
      <div className="p-3 border-t border-[#ecebe5] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-white border border-[#e2e0d8] text-[#334155] hover:bg-[#f5f4ef] transition-colors shadow-2xs"
        >
          <Store className="w-3.5 h-3.5 text-[#0f172a]" />
          <span>View Customer Store</span>
        </Link>

        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#e2e0d8] shadow-2xs">
          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-full bg-[#1e293b] text-white font-bold text-xs flex items-center justify-center shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="truncate text-left">
              <div className="font-bold text-[11px] text-[#0f172a] truncate">{user?.name || 'Admin'}</div>
              <div className="text-[9px] text-[#64748b] truncate">{user?.email || 'admin@yahsabab.com'}</div>
            </div>
          </div>
          <button
            onClick={async () => {
              await logout();
              router.push('/auth/login');
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
