'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Menu,
  X,
  Phone,
  ShieldCheck,
  Truck,
  Sparkles
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import SearchModal from './SearchModal';

export default function Header() {
  const pathname = usePathname();
  const { user, cartItemCount, setIsCartOpen, settings } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop All', href: '/shop' },
    { name: 'Panjabi', href: '/shop?category=panjabi' },
    { name: 'Kabli Suit', href: '/shop?category=kabli-suit' },
    { name: 'Combos', href: '/shop?category=combo' },
    { name: 'New Arrivals', href: '/shop?isNewArrival=true' },
    { name: 'Offers', href: '/shop?isFeatured=true' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-950/10 shadow-xs">
      {/* Announcement Bar */}
      {settings?.showAnnouncementBar && (
        <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>{settings.announcementBarText}</span>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-amber-950 hover:bg-amber-50 focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Yah SABAB Logo"
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-amber-900 transition-colors">
                  Yah SABAB <span className="text-amber-800 font-sans font-normal text-base sm:text-lg">| ইয়াহ সাবাব</span>
                </span>
                <span className="text-[9px] tracking-widest text-slate-500 uppercase font-sans font-medium -mt-0.5">
                  Heritage & Modern Elegance
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-amber-700 ${
                    isActive ? 'text-amber-900 border-b-2 border-amber-700 pb-1 font-semibold' : 'text-slate-700'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-slate-700 hover:text-amber-800 hover:bg-amber-50 rounded-full transition-colors"
              aria-label="Search Products"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Customer Account / Admin Icon */}
            <Link
              href={user ? (user.role === 'admin' ? '/admin' : '/account') : '/auth/login'}
              className="p-2 text-slate-700 hover:text-amber-800 hover:bg-amber-50 rounded-full transition-colors flex items-center gap-1.5"
              aria-label="Account"
            >
              <UserIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              {user && (
                <span className="hidden md:inline-block text-xs font-semibold text-amber-950 bg-amber-100 px-2 py-0.5 rounded-full">
                  {user.role === 'admin' ? 'Admin' : user.name.split(' ')[0]}
                </span>
              )}
            </Link>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-700 hover:text-amber-800 hover:bg-amber-50 rounded-full transition-colors"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-700 text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-950/10 bg-white shadow-xl animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-amber-50 hover:text-amber-900 transition-colors"
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-slate-100 space-y-2">
              {user ? (
                <Link
                  href={user.role === 'admin' ? '/admin' : '/account'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-semibold bg-amber-900 text-white"
                >
                  <span>My Account ({user.name})</span>
                  <span className="text-xs bg-amber-700 px-2 py-0.5 rounded-full">
                    {user.role.toUpperCase()}
                  </span>
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center py-2.5 rounded-lg text-sm font-semibold border border-amber-900 text-amber-900 hover:bg-amber-50"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center py-2.5 rounded-lg text-sm font-semibold bg-amber-900 text-white hover:bg-amber-950"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {isSearchOpen && <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
    </header>
  );
}
