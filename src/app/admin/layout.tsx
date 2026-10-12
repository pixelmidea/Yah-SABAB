'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, Sun, Sparkles } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { StoreProvider, useStore } from '@/context/StoreContext';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loadingUser } = useStore();

  useEffect(() => {
    if (!loadingUser) {
      if (!user || user.role !== 'admin') {
        router.push('/auth/login');
      }
    }
  }, [user, loadingUser, router]);

  if (loadingUser || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#f5f4ef] flex items-center justify-center text-[#475569] text-sm font-semibold">
        Verifying admin session...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f5f4ef] font-sans antialiased text-[#0f172a]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header Bar matching Screenshot */}
        <header className="h-16 bg-[#fafaf8] border-b border-[#e8e7e1] px-6 sm:px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="font-serif text-lg font-bold text-[#0f172a] tracking-tight">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Pill */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-48 sm:w-64 bg-[#edece6] border-none rounded-full px-4 py-1.5 text-xs text-[#0f172a] placeholder-[#94a3b8] focus:outline-hidden focus:ring-1 focus:ring-slate-400"
              />
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              className="p-1.5 rounded-full text-[#64748b] hover:text-[#0f172a] hover:bg-[#edece6] transition-colors"
              title="Toggle Theme"
            >
              <Sun className="w-4 h-4" />
            </button>

            {/* Notification Bell with red dot */}
            <button
              type="button"
              className="relative p-1.5 rounded-full text-[#64748b] hover:text-[#0f172a] hover:bg-[#edece6] transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {/* Profile Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900 border border-[#e2e0d8] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </StoreProvider>
  );
}
