'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Tag,
  CreditCard
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface StorefrontNotification {
  _id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export default function StorefrontNotificationBell() {
  const router = useRouter();
  const { user } = useStore();
  const [notifications, setNotifications] = useState<StorefrontNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchCustomerNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      // Quiet fail in background
    }
  };

  useEffect(() => {
    fetchCustomerNotifications();
    const timer = setInterval(fetchCustomerNotifications, 18000); // 18s poll
    return () => clearInterval(timer);
  }, [user]);

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

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_all_read', target: 'customer' })
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  const handleItemClick = (item: StorefrontNotification) => {
    if (!item.isRead) {
      fetch(`/api/notifications/${item._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true })
      }).catch(() => {});
      setNotifications((prev) =>
        prev.map((n) => (n._id === item._id ? { ...n, isRead: true } : n))
      );
    }

    setIsOpen(false);
    if (item.link) {
      router.push(item.link);
    } else {
      router.push('/account');
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-[#d6cdbf] hover:text-[#c9933a] hover:bg-[#1c1813] border border-transparent hover:border-[#c9933a]/30 rounded-full transition-all cursor-pointer"
        aria-label="Order Tracking & Notifications"
        title="Privilege & Order Alerts"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-[#c9933a] to-[#b0782e] text-[#0e0c0a] font-black text-[10px] w-4.5 h-4.5 min-w-[18px] min-h-[18px] px-0.5 rounded-full flex items-center justify-center shadow-md shadow-[#c9933a]/40 border border-[#f5eedb]/30 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-84 bg-[#14100c] border border-[#c9933a]/30 rounded-2xl shadow-2xl overflow-hidden z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 bg-[#1a140f] border-b border-[#c9933a]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#c9933a]" />
              <span className="font-bold text-xs text-[#f7f3eb] uppercase tracking-wider">
                Privilege Alerts
              </span>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[10px] font-bold text-[#c9933a] hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[300px] overflow-y-auto divide-y divide-[#c9933a]/10">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-[#a89b88]">
                <CheckCircle2 className="w-6 h-6 text-[#c9933a] mx-auto mb-2 opacity-70" />
                <p className="font-semibold text-xs text-[#f7f3eb]">You're all caught up!</p>
                <p className="text-[10px] text-[#6e6153] mt-0.5">
                  Order updates and festive previews will appear here.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleItemClick(item)}
                  className={`p-3 flex items-start gap-2.5 transition-colors cursor-pointer ${
                    item.isRead
                      ? 'hover:bg-[#1a1510] opacity-75'
                      : 'bg-[#221a12] hover:bg-[#281f15]'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-[#2d2217] text-[#c9933a] border border-[#c9933a]/30 shrink-0 mt-0.5">
                    {item.type === 'order' ? (
                      <ShoppingBag className="w-3.5 h-3.5" />
                    ) : item.type === 'payment' ? (
                      <CreditCard className="w-3.5 h-3.5" />
                    ) : (
                      <Tag className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className="font-bold text-[#f7f3eb] text-xs truncate">
                        {item.title}
                      </p>
                      <span className="text-[9px] text-[#8c8071] shrink-0">
                        {formatTimeAgo(item.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#c7bcab] line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                  {!item.isRead && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9933a] shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-[#1a140f] border-t border-[#c9933a]/20 text-center">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push('/account');
              }}
              className="text-[11px] font-bold text-[#c9933a] hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>View All Order Receipts</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
