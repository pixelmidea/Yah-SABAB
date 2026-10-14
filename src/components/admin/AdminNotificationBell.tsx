'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  ShoppingBag,
  Sparkles,
  ExternalLink,
  Check,
  X,
  Volume2,
  VolumeX,
  Package
} from 'lucide-react';

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'stock' | 'review' | 'system' | 'promo';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

// Gentle luxury synthesized chime using HTML5 Web Audio API
function playLuxuryOrderChime() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.18); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(523.25, now); // C5
    osc2.frequency.exponentialRampToValueAtTime(1046.5, now + 0.18); // C6

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.6);
    osc2.stop(now + 0.6);
  } catch {
    // Audio context may be restricted by browser until first user gesture
  }
}

export default function AdminNotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'order' | 'stock' | 'payment'>('all');
  const [newOrderToast, setNewOrderToast] = useState<NotificationItem | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const knownIdsRef = useRef<Set<string>>(new Set());
  const initialFetchRef = useRef(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?role=admin');
      const data = await res.json();
      if (data.success && Array.isArray(data.notifications)) {
        const list: NotificationItem[] = data.notifications;

        // Check if brand new order notifications arrived (after initial load)
        if (!initialFetchRef.current) {
          const freshOrder = list.find(
            (n) =>
              (n.type === 'order' || n.type === 'payment') &&
              !n.isRead &&
              !knownIdsRef.current.has(n._id)
          );

          if (freshOrder) {
            setNewOrderToast(freshOrder);
            if (soundEnabled) {
              playLuxuryOrderChime();
            }
            setTimeout(() => setNewOrderToast(null), 8000);
          }
        }

        // Store known IDs
        list.forEach((n) => knownIdsRef.current.add(n._id));
        setNotifications(list);
        initialFetchRef.current = false;
      }
    } catch (err) {
      console.warn('Failed to poll notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 12000); // Poll every 12 seconds
    return () => clearInterval(interval);
  }, [soundEnabled]);

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
        body: JSON.stringify({ action: 'mark_all_read', target: 'admin' })
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemClick = async (notif: NotificationItem) => {
    // Mark single as read
    if (!notif.isRead) {
      fetch(`/api/notifications/${notif._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true })
      }).catch(() => {});
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
      );
    }

    setIsOpen(false);
    if (notif.link) {
      router.push(notif.link);
    } else {
      router.push('/admin/orders');
    }
  };

  const filteredList = notifications.filter((n) => {
    if (filterTab === 'all') return true;
    return n.type === filterTab;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-[#e6ad35]" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'stock':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#c9933a]" />;
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
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-[#A59A88] hover:text-[#F8F3E9] hover:bg-[#1c1611] transition-colors cursor-pointer border border-[#403221]/50 hover:border-[#E6AD35]/60"
        title="Admin Notifications & Order Alerts"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 text-[#E6AD35]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-[#E6AD35] text-[#100D0A] font-extrabold text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-md">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Drawer */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#16120E] rounded-2xl border border-[#403221] shadow-2xl overflow-hidden z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 bg-[#1A140F] border-b border-[#403221]/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#F8F3E9]">
                Admin Notifications
              </span>
              {unreadCount > 0 && (
                <span className="bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold text-[10px] px-2 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Sound alert toggle */}
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1 text-[#64748b] dark:text-[#a89b88] hover:text-[#0f172a] dark:hover:text-white rounded cursor-pointer"
                title={soundEnabled ? 'Mute new order sound chime' : 'Enable new order sound chime'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
              </button>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-[11px] font-semibold text-[#e6ad35] dark:text-[#f5c451] hover:underline cursor-pointer ml-1"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-3 pt-2 pb-1 flex items-center gap-1 border-b border-[#f1f0eb] dark:border-[#c9933a]/15 text-[11px] font-semibold">
            {(['all', 'order', 'payment', 'stock'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={`px-2.5 py-1 rounded-lg capitalize cursor-pointer transition-colors ${
                  filterTab === tab
                    ? 'bg-[#0f172a] dark:bg-[#251e17] text-white dark:text-[#c9933a] font-bold'
                    : 'text-[#64748b] dark:text-[#a89b88] hover:bg-[#edece6] dark:hover:bg-[#1c1611]'
                }`}
              >
                {tab === 'all' ? 'All' : `${tab}s`}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="max-h-[340px] overflow-y-auto divide-y divide-[#f1f0eb] dark:divide-[#c9933a]/15">
            {filteredList.length === 0 ? (
              <div className="py-10 text-center text-[#64748b] dark:text-[#a89b88]">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                <p className="font-semibold text-xs text-[#0f172a] dark:text-[#f7f3eb]">
                  You're all caught up!
                </p>
                <p className="text-[11px] text-[#94a3b8] dark:text-[#6e6153] mt-0.5">
                  No new operational alerts in this tab.
                </p>
              </div>
            ) : (
              filteredList.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleItemClick(item)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group ${
                    item.isRead
                      ? 'hover:bg-[#fafaf8] dark:hover:bg-[#181512] opacity-80'
                      : 'bg-amber-50/40 dark:bg-[#1e1812] hover:bg-amber-50/80 dark:hover:bg-[#251e17]'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white dark:bg-[#14100c] border border-[#e2e0d8] dark:border-[#c9933a]/30 shrink-0 shadow-2xs">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className="font-bold text-[#0f172a] dark:text-[#f7f3eb] text-xs truncate">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-[#94a3b8] dark:text-[#6e6153] shrink-0">
                        {formatTimeAgo(item.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#475569] dark:text-[#a89b88] line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#e6ad35] dark:bg-[#f5c451] shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Action */}
          <div className="p-2.5 bg-[#fafaf8] dark:bg-[#181410] border-t border-[#ecebe5] dark:border-[#c9933a]/20 text-center">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push('/admin/orders');
              }}
              className="text-xs font-bold text-[#b0782e] dark:text-[#f5c451] hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>View Full Orders Pipeline</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Real-Time Floating Order Toast Banner */}
      {newOrderToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#0f172a] text-white p-4 rounded-2xl shadow-2xl border border-amber-500/40 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center shrink-0 font-bold shadow-md">
              <ShoppingBag className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-400 uppercase tracking-wider">
                  🎉 New Order Received!
                </span>
                <button
                  type="button"
                  onClick={() => setNewOrderToast(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="font-bold text-sm text-white mt-0.5 truncate">
                {newOrderToast.title}
              </p>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                {newOrderToast.message}
              </p>
              <button
                type="button"
                onClick={() => {
                  setNewOrderToast(null);
                  router.push(newOrderToast.link || '/admin/orders');
                }}
                className="mt-3 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                Inspect Order Details →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
