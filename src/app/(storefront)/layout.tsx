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
      <div className="min-h-screen flex flex-col bg-[#0c0a09] text-[#f7f3eb] font-sans antialiased selection:bg-[#c9933a]/30">
        <Header />
        <main className="flex-1">{children}</main>
        <CartDrawer />
        <Footer />
      </div>
    </StoreProvider>
  );
}
