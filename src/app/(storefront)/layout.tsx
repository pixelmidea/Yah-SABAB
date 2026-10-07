import React from 'react';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import CartDrawer from '@/components/storefront/CartDrawer';
import { StoreProvider } from '@/context/StoreContext';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-900 font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <CartDrawer />
        <Footer />
      </div>
    </StoreProvider>
  );
}
