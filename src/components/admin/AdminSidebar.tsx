'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  SlidersHorizontal,
  ChevronDown,
  LogOut,
  Store,
  MessageSquare,
  BarChart3,
  Percent,
  Receipt,
  X,
  Sparkles
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useStore();
  const [productsOpen, setProductsOpen] = useState(true);

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="w-64 bg-[#100D0A] text-[#A59A88] flex flex-col shrink-0 min-h-screen border-r border-[#403221]/60 font-sans select-none transition-colors duration-200">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#403221]/50">
        <Link href="/admin" onClick={handleLinkClick} className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-[#1c1611] text-[#E6AD35] border border-[#403221] flex items-center justify-center font-bold text-xs shadow-xs tracking-wider group-hover:border-[#E6AD35] transition-colors">
            YS
          </div>
          <div>
            <span className="font-bold text-[15px] text-[#F8F3E9] tracking-tight block">
              Yah SABAB
            </span>
            <span className="text-[11px] text-[#E6AD35] block font-medium">
              Admin Workspace
            </span>
          </div>
        </Link>

        {/* Mobile Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-[#A59A88] hover:text-[#F8F3E9] hover:bg-[#221a12] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto text-sm font-medium">
        {/* Dashboard */}
        <Link
          href="/admin"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
            pathname === '/admin'
              ? 'bg-[#251e17] text-[#F8F3E9] font-bold border-l-2 border-[#E6AD35] shadow-xs'
              : 'text-[#A59A88] hover:bg-[#1a140f] hover:text-[#F8F3E9]'
          }`}
        >
          <LayoutDashboard className={`w-[18px] h-[18px] ${pathname === '/admin' ? 'text-[#E6AD35]' : 'text-[#A59A88]'}`} />
          <span>Dashboard</span>
        </Link>

        {/* Users & Audience */}
        <Link
          href="/admin/users"
          onClick={handleLinkClick}
          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
            pathname.startsWith('/admin/users')
              ? 'bg-[#251e17] text-[#F8F3E9] font-bold border-l-2 border-[#E6AD35] shadow-xs'
              : 'text-[#A59A88] hover:bg-[#1a140f] hover:text-[#F8F3E9]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Users className={`w-[18px] h-[18px] ${pathname.startsWith('/admin/users') ? 'text-[#E6AD35]' : 'text-[#A59A88]'}`} />
            <span>Users & Access</span>
          </div>
          <ChevronDown className="w-4 h-4 text-[#6e6153]" />
        </Link>

        {/* Products (Group) */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setProductsOpen(!productsOpen)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              pathname.startsWith('/admin/products') || pathname.startsWith('/admin/categories') || pathname.startsWith('/admin/inventory')
                ? 'bg-[#251e17] text-[#F8F3E9] font-bold border-l-2 border-[#E6AD35] shadow-xs'
                : 'text-[#A59A88] hover:bg-[#1a140f] hover:text-[#F8F3E9]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className={`w-[18px] h-[18px] ${pathname.startsWith('/admin/products') || pathname.startsWith('/admin/categories') || pathname.startsWith('/admin/inventory') ? 'text-[#E6AD35]' : 'text-[#A59A88]'}`} />
              <span>Products</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#6e6153] transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`} />
          </button>

          {productsOpen && (
            <div className="pl-9 pr-2 py-1 space-y-1 text-[13px]">
              {/* All Products */}
              <Link
                href="/admin/products"
                onClick={handleLinkClick}
                className={`block px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/admin/products'
                    ? 'text-[#F8F3E9] font-bold bg-[#1e1711] shadow-2xs'
                    : 'text-[#8c8071] hover:text-[#F8F3E9] hover:bg-[#1a140f]'
                }`}
              >
                All Products
              </Link>

              {/* Add Product */}
              <Link
                href="/admin/products/new"
                onClick={handleLinkClick}
                className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/admin/products/new'
                    ? 'text-[#F8F3E9] font-bold bg-[#1e1711] shadow-2xs'
                    : 'text-[#8c8071] hover:text-[#F8F3E9] hover:bg-[#1a140f]'
                }`}
              >
                <span>Add Product</span>
                <span className="text-xs text-[#E6AD35] font-bold">+</span>
              </Link>
              {/* Categories */}
              <Link
                href="/admin/categories"
                onClick={handleLinkClick}
                className={`block px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/admin/categories'
                    ? 'text-[#F8F3E9] font-bold bg-[#1e1711] shadow-2xs'
                    : 'text-[#8c8071] hover:text-[#F8F3E9] hover:bg-[#1a140f]'
                }`}
              >
                Categories
              </Link>

              {/* Inventory */}
              <Link
                href="/admin/inventory"
                onClick={handleLinkClick}
                className={`block px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/admin/inventory'
                    ? 'text-[#F8F3E9] font-bold bg-[#1e1711] shadow-2xs'
                    : 'text-[#8c8071] hover:text-[#F8F3E9] hover:bg-[#1a140f]'
                }`}
              >
                Inventory
              </Link>
            </div>
          )}
        </div>

        {/* Orders */}
        <Link
          href="/admin/orders"
          onClick={handleLinkClick}
          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
            pathname.startsWith('/admin/orders')
              ? 'bg-[#251e17] text-[#F8F3E9] font-bold border-l-2 border-[#E6AD35] shadow-xs'
              : 'text-[#A59A88] hover:bg-[#1a140f] hover:text-[#F8F3E9]'
          }`}
        >
          <div className="flex items-center gap-3">
            <ShoppingBag className={`w-[18px] h-[18px] ${pathname.startsWith('/admin/orders') ? 'text-[#E6AD35]' : 'text-[#A59A88]'}`} />
            <span>Orders</span>
          </div>
          <ChevronDown className="w-4 h-4 text-[#6e6153]" />
        </Link>

        {/* Customers */}
        <Link
          href="/admin/customers"
          onClick={handleLinkClick}
          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
            pathname.startsWith('/admin/customers')
              ? 'bg-[#251e17] text-[#F8F3E9] font-bold border-l-2 border-[#E6AD35] shadow-xs'
              : 'text-[#A59A88] hover:bg-[#1a140f] hover:text-[#F8F3E9]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Users className={`w-[18px] h-[18px] ${pathname.startsWith('/admin/customers') ? 'text-[#E6AD35]' : 'text-[#A59A88]'}`} />
            <span>Customers</span>
          </div>
          <ChevronDown className="w-4 h-4 text-[#6e6153]" />
        </Link>

        {/* Promotions */}
        <Link
          href="/admin/coupons"
          onClick={handleLinkClick}
          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
            pathname.startsWith('/admin/coupons')
              ? 'bg-[#251e17] text-[#F8F3E9] font-bold border-l-2 border-[#E6AD35] shadow-xs'
              : 'text-[#A59A88] hover:bg-[#1a140f] hover:text-[#F8F3E9]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Percent className={`w-[18px] h-[18px] ${pathname.startsWith('/admin/coupons') ? 'text-[#E6AD35]' : 'text-[#A59A88]'}`} />
            <span>Promotions</span>
          </div>
          <ChevronDown className="w-4 h-4 text-[#6e6153]" />
        </Link>

        {/* Settings */}
        <Link
          href="/admin/settings"
          onClick={handleLinkClick}
          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
            pathname.startsWith('/admin/settings')
              ? 'bg-[#251e17] text-[#F8F3E9] font-bold border-l-2 border-[#E6AD35] shadow-xs'
              : 'text-[#A59A88] hover:bg-[#1a140f] hover:text-[#F8F3E9]'
          }`}
        >
          <div className="flex items-center gap-3">
            <SlidersHorizontal className={`w-[18px] h-[18px] ${pathname.startsWith('/admin/settings') ? 'text-[#E6AD35]' : 'text-[#A59A88]'}`} />
            <span>Settings</span>
          </div>
          <ChevronDown className="w-4 h-4 text-[#6e6153]" />
        </Link>
      </nav>

      {/* Bottom User Profile & Storefront Link */}
      <div className="p-4 border-t border-[#403221]/50 space-y-2.5">
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-[13px] font-semibold bg-[#1c1611] border border-[#403221] text-[#F8F3E9] hover:bg-[#251e17] hover:border-[#E6AD35]/60 transition-all shadow-2xs"
        >
          <Store className="w-4 h-4 text-[#E6AD35]" />
          <span>View Storefront</span>
        </Link>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#16120e] border border-[#403221]/60 shadow-2xs">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-[#251e17] text-[#E6AD35] border border-[#403221] font-bold text-xs flex items-center justify-center shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="truncate text-left">
              <div className="font-bold text-xs text-[#F8F3E9] truncate">{user?.name || 'Admin'}</div>
              <div className="text-[10px] text-[#A59A88] truncate">{user?.email || 'admin@yahsabab.com'}</div>
            </div>
          </div>
          <button
            onClick={async () => {
              await logout();
              router.push('/auth/login');
            }}
            className="p-1.5 text-[#A59A88] hover:text-rose-400 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
