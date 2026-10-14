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
  Sparkles,
  ChevronDown,
  Truck,
  ShieldCheck,
  RotateCcw,
  Phone,
  Headphones
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import SearchModal from './SearchModal';
import StorefrontNotificationBell from './StorefrontNotificationBell';

export default function Header() {
  const pathname = usePathname();
  const { user, cartItemCount, setIsCartOpen, settings } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const primaryNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop All', href: '/shop' },
    { name: 'D-Tex Panjabi', href: '/shop?category=d-tex-micro-stitch' },
    { name: 'China Popcorn', href: '/shop?category=china-popcorn' },
    { name: 'Arabian Thobe', href: '/shop?category=arabian-thobe-kanduri' },
  ];

  const secondaryNavLinks = [
    { name: 'Jeddah & Pepsi Cotton', href: '/shop?category=jeddah-pepsi-cotton' },
    { name: 'Luxury Cotton', href: '/shop?category=luxury-cotton' },
    { name: 'New Drops', href: '/shop?isNewArrival=true' },
    { name: 'WhatsApp & Contact', href: '/contact' },
  ];

  const announcement = settings?.announcementBarText || 'Free Shipping Across Bangladesh';

  return (
    <header className="sticky top-0 z-40 bg-[#0a0908]/95 backdrop-blur-xl border-b border-[#c9933a]/20 transition-all duration-300">
      {/* Top Editorial Announcement Bar Matching Reference Image */}
      {(settings?.showAnnouncementBar !== false) && (
        <div className="bg-[#070605] border-b border-[#c9933a]/20 text-[#d6cdbf] text-[11px] sm:text-xs py-2 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left Perks */}
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap text-[11px]">
              <div className="flex items-center gap-1.5 text-[#e5dec9]">
                <Truck className="w-3.5 h-3.5 text-[#c9933a] shrink-0" />
                <span>Free Shipping Across Bangladesh</span>
              </div>
              <span className="text-[#c9933a]/30 hidden sm:inline">|</span>
              <div className="hidden sm:flex items-center gap-1.5 text-[#e5dec9]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c9933a] shrink-0" />
                <span>100% Original Products</span>
              </div>
              <span className="text-[#c9933a]/30 hidden md:inline">|</span>
              <div className="hidden md:flex items-center gap-1.5 text-[#e5dec9]">
                <RotateCcw className="w-3.5 h-3.5 text-[#c9933a] shrink-0" />
                <span>Easy Returns</span>
              </div>
            </div>

            {/* Right Contact & Support */}
            <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
              <a
                href="https://wa.me/8801234567890"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[#f5eedb] hover:text-[#c9933a] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#c9933a] shrink-0" />
                <span>{settings?.phone || '+880 1234 567890'}</span>
              </a>
              <span className="text-[#c9933a]/30">|</span>
              <Link
                href="/contact"
                className="flex items-center gap-1.5 text-[#f5eedb] hover:text-[#c9933a] transition-colors"
              >
                <Headphones className="w-3.5 h-3.5 text-[#c9933a] shrink-0" />
                <span>Help & Support</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#f5eedb] hover:text-[#c9933a] hover:bg-[#1f1b16] border border-transparent hover:border-[#c9933a]/30 transition-all cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo & Royal Monogram */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#2a2218] via-[#1c1712] to-[#0f0c09] p-0.5 border border-[#c9933a]/40 shadow-lg shadow-[#0a0806]/80 group-hover:border-[#c9933a] transition-all">
                <img
                  src="/logo.png"
                  alt="Yah SABAB Logo"
                  className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="absolute inset-0 flex items-center justify-center font-serif font-black text-sm text-[#c9933a] tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                  YS
                </span>
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#f5eedb] group-hover:text-[#c9933a] transition-colors">
                    Yah SABAB
                  </span>
                  <span className="text-[#c9933a] font-bangla text-sm sm:text-base font-semibold tracking-normal opacity-90">
                    ইয়াহ সাবাব
                  </span>
                </div>
                <span className="text-[9px] tracking-[0.25em] text-[#a89b88] uppercase font-sans font-medium -mt-0.5">
                  Arabic Kanduri & Panjabi
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {primaryNavLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === '/shop' && pathname.startsWith('/shop'));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all relative py-1.5 ${
                    isActive
                      ? 'text-[#c9933a] font-semibold'
                      : 'text-[#d6cdbf] hover:text-[#f5eedb]'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c9933a] rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* "More" Dropdown Menu */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium text-[#d6cdbf] hover:text-[#f5eedb] py-1.5 transition-colors cursor-pointer">
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 text-[#c9933a]" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-52 bg-[#171410] border border-[#c9933a]/30 rounded-2xl shadow-2xl p-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                {secondaryNavLinks.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className="block px-3.5 py-2 rounded-xl text-xs font-medium text-[#d6cdbf] hover:text-[#f5eedb] hover:bg-[#26201a] hover:border-l-2 hover:border-[#c9933a] transition-all"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Action Icons (Search, User, Cart, Admin) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 text-[#d6cdbf] hover:text-[#c9933a] hover:bg-[#1c1813] border border-transparent hover:border-[#c9933a]/30 rounded-full transition-all cursor-pointer"
              aria-label="Search Products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Privilege & Order Notification Bell */}
            <StorefrontNotificationBell />

            {/* Customer Account / Admin Icon */}
            <Link
              href={user ? (user.role === 'admin' ? '/admin' : '/account') : '/auth/login'}
              className="p-2.5 text-[#d6cdbf] hover:text-[#c9933a] hover:bg-[#1c1813] border border-transparent hover:border-[#c9933a]/30 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
              aria-label="Account"
            >
              <UserIcon className="w-5 h-5" />
              {user && (
                <span className="hidden md:inline-block text-xs font-semibold text-[#f5eedb] bg-[#2d2419] border border-[#c9933a]/40 px-2.5 py-0.5 rounded-full">
                  {user.role === 'admin' ? 'Admin' : user.name.split(' ')[0]}
                </span>
              )}
            </Link>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-[#d6cdbf] hover:text-[#c9933a] hover:bg-[#1c1813] border border-transparent hover:border-[#c9933a]/30 rounded-full transition-all group cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {cartItemCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-[#c9933a] to-[#b0782e] text-[#0e0c0a] font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-[#c9933a]/40 border border-[#f5eedb]/30">
                  {cartItemCount}
                </span>
              ) : (
                <span className="absolute -top-0.5 -right-0.5 bg-[#c9933a] text-[#0e0c0a] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  0
                </span>
              )}
            </button>

            {/* Prominent Gold Admin Button from Reference Image */}
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-[#e6ad35] hover:bg-[#f5c451] text-[#0e0c0a] shadow-sm transition-all cursor-pointer font-sans"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#c9933a]/20 bg-[#120f0c] shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="px-5 pt-4 pb-7 space-y-1.5">
            {[...primaryNavLinks, ...secondaryNavLinks].map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#292118] text-[#c9933a] font-semibold border-l-3 border-[#c9933a]'
                      : 'text-[#d6cdbf] hover:bg-[#1d1813] hover:text-[#f5eedb]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-4 mt-3 border-t border-[#c9933a]/20 space-y-2">
              {user ? (
                <Link
                  href={user.role === 'admin' ? '/admin' : '/account'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#2a2218] to-[#1c1712] text-[#f5eedb] border border-[#c9933a]/40 shadow-md"
                >
                  <span>My Account ({user.name})</span>
                  <span className="text-xs bg-[#c9933a] text-[#0e0c0a] font-bold px-2 py-0.5 rounded-full">
                    {user.role.toUpperCase()}
                  </span>
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center py-2.5 rounded-xl text-sm font-semibold border border-[#c9933a]/40 text-[#f5eedb] hover:bg-[#1f1b16] transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#c9933a] to-[#b0782e] text-[#0e0c0a] hover:opacity-90 transition-opacity font-bold shadow-md"
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
