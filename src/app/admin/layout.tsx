'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminSearchBar from '@/components/admin/AdminSearchBar';
import AdminNotificationBell from '@/components/admin/AdminNotificationBell';
import AdminThemeSelector from '@/components/admin/AdminThemeSelector';
import { StoreProvider, useStore } from '@/context/StoreContext';
import { AdminThemeProvider, useAdminTheme } from '@/context/AdminThemeContext';

function getPageTitle(pathname: string): { title: string; subtitle: string } {
  if (pathname === '/admin') {
    return { title: 'Executive Dashboard', subtitle: 'Live sales, logistics, and store analytics' };
  }
  if (pathname.startsWith('/admin/users')) {
    return { title: 'Audience & Permissions', subtitle: 'MongoDB accounts, staff roles, and geo targeting' };
  }
  if (pathname.startsWith('/admin/products/new')) {
    return { title: 'Add New Product', subtitle: 'Create and list a luxury festive item' };
  }
  if (pathname.startsWith('/admin/products')) {
    return { title: 'Products Catalog', subtitle: 'Inventory, SKUs, and merchandising' };
  }
  if (pathname.startsWith('/admin/orders')) {
    return { title: 'Orders & Deliveries', subtitle: 'Order status, payment verification, and dispatch' };
  }
  if (pathname.startsWith('/admin/customers')) {
    return { title: 'Customer Directory', subtitle: 'VIP client profiles and purchase history' };
  }
  if (pathname.startsWith('/admin/inventory')) {
    return { title: 'Inventory Stock', subtitle: 'Real-time stock tracking and low-stock alerts' };
  }
  if (pathname.startsWith('/admin/categories')) {
    return { title: 'Product Categories', subtitle: 'Festive collections and luxury taxonomy' };
  }
  if (pathname.startsWith('/admin/coupons')) {
    return { title: 'Promotions & Coupons', subtitle: 'Discount vouchers and seasonal campaigns' };
  }
  if (pathname.startsWith('/admin/settings')) {
    return { title: 'Store Settings', subtitle: 'Brand details, payment numbers, and shipping rates' };
  }
  if (pathname.startsWith('/admin/messages')) {
    return { title: 'Customer Inquiries', subtitle: 'Storefront messages and support queries' };
  }
  return { title: 'Admin Workspace', subtitle: 'Yah SABAB Luxury E-Commerce Operations' };
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loadingUser } = useStore();
  const { theme, isDark } = useAdminTheme();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!loadingUser) {
      if (!user || user.role !== 'admin') {
        router.push('/auth/login');
      }
    }
  }, [user, loadingUser, router]);

  if (loadingUser || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0c0a09] flex flex-col items-center justify-center text-[#f7f3eb] text-sm font-semibold gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#1c1611] border border-[#c9933a]/30 flex items-center justify-center text-[#c9933a] font-bold shadow-lg animate-pulse">
          YS
        </div>
        <p className="text-xs text-[#a89b88]">Verifying administrative access...</p>
      </div>
    );
  }

  const { title, subtitle } = getPageTitle(pathname);

  return (
    <div
      data-theme={theme}
      className={`admin-theme theme-${theme} ${isDark ? 'dark' : ''} min-h-screen flex font-sans antialiased transition-colors duration-200`}
    >
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Slide-Over Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="relative z-10 w-64 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            <AdminSidebar
              isOpen={isMobileSidebarOpen}
              onClose={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Administrative Viewport */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden bg-[#FAF7F2]">
        {/* Top Header Bar */}
        <header className="h-16 bg-[#100D0A] border-b border-[#403221]/60 px-3.5 sm:px-6 lg:px-8 flex items-center justify-between gap-3 shrink-0">
          {/* Left: Mobile Hamburger & Dynamic Page Heading */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#A59A88] hover:text-[#F8F3E9] hover:bg-[#1c1611] transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:block truncate">
              <h1 className="text-base sm:text-lg font-bold text-[#F8F3E9] tracking-tight truncate leading-tight">
                {title}
              </h1>
              <p className="text-[11px] text-[#A59A88] truncate hidden md:block">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Center & Right: Search, Theme Toggle, Notification Bell, User Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end max-w-xl">
            {/* Functional Live Search Command Palette */}
            <AdminSearchBar />

            {/* Workspace Theme Palette Selector (Multi-Theme) */}
            <AdminThemeSelector />

            {/* Real-time Order & Operational Notification Bell */}
            <AdminNotificationBell />

            {/* Profile Avatar Pill */}
            <div
              onClick={() => router.push('/admin/users')}
              className="w-8 h-8 rounded-full overflow-hidden bg-[#251e17] border border-[#403221] flex items-center justify-center text-[#E6AD35] text-xs font-bold shrink-0 shadow-2xs cursor-pointer hover:border-[#E6AD35] transition-colors"
              title={`Logged in as ${user?.name}`}
            >
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 overflow-y-auto max-h-[calc(100vh-64px)] scrollbar-thin bg-[#FAF7F2]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AdminThemeProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </AdminThemeProvider>
    </StoreProvider>
  );
}
