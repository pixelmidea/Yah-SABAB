'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-sm font-semibold">
        Verifying admin security session...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans antialiased text-slate-900">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-screen">{children}</main>
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
