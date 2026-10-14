'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Package,
  ShoppingBag,
  Users,
  SlidersHorizontal,
  LayoutDashboard,
  Percent,
  Layers,
  ArrowRight,
  Loader2,
  Clock,
  Sparkles
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface QuickPage {
  name: string;
  href: string;
  category: 'Pages';
  icon: any;
  keywords: string;
}

const ADMIN_PAGES: QuickPage[] = [
  { name: 'Dashboard & Analytics', href: '/admin', category: 'Pages', icon: LayoutDashboard, keywords: 'dashboard analytics revenue sales home overview' },
  { name: 'All Products Catalog', href: '/admin/products', category: 'Pages', icon: Package, keywords: 'products items catalog stock panjabi shirt' },
  { name: 'Add New Product', href: '/admin/products/new', category: 'Pages', icon: Package, keywords: 'add new product create upload item' },
  { name: 'Orders & Deliveries', href: '/admin/orders', category: 'Pages', icon: ShoppingBag, keywords: 'orders deliveries fulfillment shipping purchases pipeline' },
  { name: 'User Management & Audience', href: '/admin/users', category: 'Pages', icon: Users, keywords: 'users customers members audience accounts staff permission' },
  { name: 'Customers Directory', href: '/admin/customers', category: 'Pages', icon: Users, keywords: 'customers buyers contacts clients vip' },
  { name: 'Inventory & Stock Tracking', href: '/admin/inventory', category: 'Pages', icon: Layers, keywords: 'inventory stock quantities low warehouse alert' },
  { name: 'Product Categories', href: '/admin/categories', category: 'Pages', icon: Layers, keywords: 'categories panjabi collection festive category' },
  { name: 'Coupons & Discounts', href: '/admin/coupons', category: 'Pages', icon: Percent, keywords: 'coupons discounts promotions promo vouchers code' },
  { name: 'Store Settings & Brand', href: '/admin/settings', category: 'Pages', icon: SlidersHorizontal, keywords: 'settings store delivery payment bKash fees brand configuration' }
];

export default function AdminSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    pages: QuickPage[];
    products: any[];
    orders: any[];
    users: any[];
  }>({
    pages: [],
    products: [],
    orders: [],
    users: []
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();

    // 1. Filter matching pages
    const matchedPages = trimmed
      ? ADMIN_PAGES.filter(
          (p) =>
            p.name.toLowerCase().includes(trimmed) ||
            p.keywords.toLowerCase().includes(trimmed)
        )
      : ADMIN_PAGES.slice(0, 5);

    if (!trimmed) {
      setResults({
        pages: matchedPages,
        products: [],
        orders: [],
        users: []
      });
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        // Fetch products & users in parallel
        const [prodRes, userRes, orderRes] = await Promise.allSettled([
          fetch(`/api/products?search=${encodeURIComponent(trimmed)}`).then((r) => r.json()),
          fetch('/api/users').then((r) => r.json()),
          fetch('/api/orders').then((r) => r.json())
        ]);

        let prods: any[] = [];
        if (prodRes.status === 'fulfilled' && prodRes.value.success) {
          prods = (prodRes.value.products || []).slice(0, 4);
        }

        let usrs: any[] = [];
        if (userRes.status === 'fulfilled' && userRes.value.success) {
          usrs = (userRes.value.users || [])
            .filter(
              (u: any) =>
                u.name?.toLowerCase().includes(trimmed) ||
                u.email?.toLowerCase().includes(trimmed) ||
                u.phone?.toLowerCase().includes(trimmed) ||
                u.division?.toLowerCase().includes(trimmed)
            )
            .slice(0, 3);
        }

        let ords: any[] = [];
        if (orderRes.status === 'fulfilled' && orderRes.value.success) {
          ords = (orderRes.value.orders || [])
            .filter(
              (o: any) =>
                o.orderNumber?.toLowerCase().includes(trimmed) ||
                o.shippingAddress?.fullName?.toLowerCase().includes(trimmed) ||
                o.shippingAddress?.phone?.toLowerCase().includes(trimmed)
            )
            .slice(0, 3);
        }

        setResults({
          pages: matchedPages,
          products: prods,
          orders: ords,
          users: usrs
        });
      } catch (err) {
        console.error('Error in search:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(href);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Check if first result exists
    if (results.pages.length > 0) {
      handleSelect(results.pages[0].href);
    } else if (results.products.length > 0) {
      handleSelect(`/admin/products?search=${encodeURIComponent(query.trim())}`);
    } else if (results.orders.length > 0) {
      handleSelect(`/admin/orders?search=${encodeURIComponent(query.trim())}`);
    } else if (results.users.length > 0) {
      handleSelect('/admin/users');
    } else {
      handleSelect(`/admin/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const totalResultsCount =
    results.pages.length +
    results.products.length +
    results.orders.length +
    results.users.length;

  return (
    <div ref={containerRef} className="relative w-full max-w-xs sm:max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products, orders, users..."
          className="w-full bg-[#19140F] border border-[#403221] rounded-full px-4 py-2 pl-9 pr-14 text-xs font-medium text-[#F8F3E9] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35] focus:ring-1 focus:ring-[#E6AD35] transition-all"
        />
        <Search className="w-3.5 h-3.5 text-[#E6AD35] absolute left-3.5 top-2.5 pointer-events-none" />

        {/* Clear Button or Keyboard Shortcut */}
        <div className="absolute right-3 top-2 flex items-center gap-1">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="text-[#A59A88] hover:text-[#F8F3E9] p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="hidden sm:inline-block text-[10px] font-mono text-[#A59A88] bg-[#14100c] px-1.5 py-0.5 rounded border border-[#403221]/50 select-none">
              ⌘K
            </span>
          )}
        </div>
      </form>

      {/* Search Dropdown Palette */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#16120E] rounded-2xl border border-[#403221] shadow-2xl overflow-hidden z-50 text-xs animate-in fade-in zoom-in-95 duration-150 max-h-[460px] overflow-y-auto">
          {/* Header indicator */}
          <div className="p-3 bg-[#1A140F] border-b border-[#403221]/50 flex items-center justify-between text-[11px] text-[#A59A88]">
            <span className="font-semibold text-[#F8F3E9]">
              {query.trim() ? `Search results for "${query}"` : 'Quick Navigation'}
            </span>
            {loading ? (
              <span className="flex items-center gap-1 text-[#c9933a]">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Searching...</span>
              </span>
            ) : (
              <span>{totalResultsCount} items</span>
            )}
          </div>

          <div className="p-2 space-y-3">
            {/* Pages Section */}
            {results.pages.length > 0 && (
              <div>
                <div className="px-2.5 py-1 text-[10px] font-bold text-[#94a3b8] dark:text-[#6e6153] uppercase tracking-wider">
                  Admin Navigation
                </div>
                <div className="space-y-0.5">
                  {results.pages.map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.href}
                        type="button"
                        onClick={() => handleSelect(p.href)}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#fafaf8] dark:hover:bg-[#1c1611] text-left transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-lg bg-[#edece6] dark:bg-[#221a12] flex items-center justify-center text-[#0f172a] dark:text-[#c9933a] group-hover:bg-[#c9933a] group-hover:text-white transition-colors">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-semibold text-[#0f172a] dark:text-[#f7f3eb]">
                            {p.name}
                          </span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-300 dark:text-stone-700 group-hover:text-[#c9933a] transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Products Section */}
            {results.products.length > 0 && (
              <div>
                <div className="px-2.5 py-1 text-[10px] font-bold text-[#94a3b8] dark:text-[#6e6153] uppercase tracking-wider">
                  Products ({results.products.length})
                </div>
                <div className="space-y-0.5">
                  {results.products.map((prod) => (
                    <button
                      key={prod._id}
                      type="button"
                      onClick={() => handleSelect(`/admin/products?search=${encodeURIComponent(prod.title)}`)}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#fafaf8] dark:hover:bg-[#1c1611] text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <Package className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-[#0f172a] dark:text-[#f7f3eb] truncate">
                            {prod.title}
                          </p>
                          <p className="text-[10px] text-[#64748b] dark:text-[#a89b88]">
                            {prod.category} • SKU: {prod.sku || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-[#0f172a] dark:text-[#c9933a] shrink-0 ml-2">
                        {formatPrice(prod.discountPrice || prod.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Orders Section */}
            {results.orders.length > 0 && (
              <div>
                <div className="px-2.5 py-1 text-[10px] font-bold text-[#94a3b8] dark:text-[#6e6153] uppercase tracking-wider">
                  Orders ({results.orders.length})
                </div>
                <div className="space-y-0.5">
                  {results.orders.map((ord) => (
                    <button
                      key={ord._id}
                      type="button"
                      onClick={() => handleSelect('/admin/orders')}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#fafaf8] dark:hover:bg-[#1c1611] text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="w-6 h-6 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 text-[#e6ad35] dark:text-[#f5c451] flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-[#0f172a] dark:text-[#f7f3eb] truncate">
                            Order #{ord.orderNumber}
                          </p>
                          <p className="text-[10px] text-[#64748b] dark:text-[#a89b88]">
                            {ord.shippingAddress?.fullName} • {ord.orderStatus}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-[#0f172a] dark:text-[#f7f3eb] shrink-0 ml-2">
                        {formatPrice(ord.totalAmount)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Users Section */}
            {results.users.length > 0 && (
              <div>
                <div className="px-2.5 py-1 text-[10px] font-bold text-[#94a3b8] dark:text-[#6e6153] uppercase tracking-wider">
                  Users & Audience ({results.users.length})
                </div>
                <div className="space-y-0.5">
                  {results.users.map((u) => (
                    <button
                      key={u._id}
                      type="button"
                      onClick={() => handleSelect('/admin/users')}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#fafaf8] dark:hover:bg-[#1c1611] text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                          <Users className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-[#0f172a] dark:text-[#f7f3eb] truncate">
                            {u.name}
                          </p>
                          <p className="text-[10px] text-[#64748b] dark:text-[#a89b88]">
                            {u.phone} • {u.division || 'Dhaka'} ({u.role})
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#edece6] dark:bg-[#251e17] text-[#0f172a] dark:text-[#f7f3eb]">
                        {u.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {totalResultsCount === 0 && query.trim() && !loading && (
              <div className="py-8 text-center text-[#64748b] dark:text-[#a89b88]">
                <Search className="w-8 h-8 text-slate-300 dark:text-stone-700 mx-auto mb-2" />
                <p className="font-semibold text-xs text-[#0f172a] dark:text-[#f7f3eb]">
                  No matches found for "{query}"
                </p>
                <p className="text-[11px] text-[#94a3b8] dark:text-[#6e6153] mt-0.5">
                  Press Enter to search in All Products catalog
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
