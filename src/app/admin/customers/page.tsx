'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  Loader2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Populate customer data
    setTimeout(() => {
      setCustomers([
        {
          id: '1',
          name: 'Tanvir Hossain',
          email: 'tanvir@gmail.com',
          phone: '01799887766',
          district: 'Dhaka (Dhanmondi)',
          totalOrders: 3,
          totalSpent: 9850,
          lastOrder: 'Yesterday',
          status: 'VIP Customer'
        },
        {
          id: '2',
          name: 'Rahim Chowdhury',
          email: 'rahim.ctg@gmail.com',
          phone: '01811223344',
          district: 'Chittagong (Agrabad)',
          totalOrders: 2,
          totalSpent: 6700,
          lastOrder: '3 days ago',
          status: 'Active'
        },
        {
          id: '3',
          name: 'Sayed Ahmed',
          email: 'sayed.sylhet@yahoo.com',
          phone: '01733445566',
          district: 'Sylhet (Zindabazar)',
          totalOrders: 4,
          totalSpent: 14200,
          lastOrder: '1 week ago',
          status: 'VIP Customer'
        },
        {
          id: '4',
          name: 'Farhan Kabir',
          email: 'farhan.k@gmail.com',
          phone: '01922334455',
          district: 'Rajshahi',
          totalOrders: 1,
          totalSpent: 3450,
          lastOrder: '2 weeks ago',
          status: 'New'
        }
      ]);
      setLoading(false);
    }, 200);
  }, []);

  const filtered = customers.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-[#100D0A]">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5DFD5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#7A6E5D] mb-1">
            <span>Store</span>
            <span>&gt;</span>
            <span className="font-bold text-[#100D0A]">Customers</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#100D0A]">Customer CRM & Profiles</h1>
          <p className="text-xs text-[#7A6E5D]">
            Manage shopper history, lifetime spend, delivery districts, and contact details.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, phone, district..."
            className="w-full bg-[#FAF7F2] border border-[#DDD6CA] rounded-xl px-3.5 py-2 pl-9 text-xs font-medium text-[#100D0A] placeholder-[#9C9181] focus:outline-hidden focus:border-[#E6AD35] focus:ring-1 focus:ring-[#E6AD35]"
          />
          <Search className="w-4 h-4 text-[#9C9181] absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-[#E6AD35]">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#7A6E5D]">Loading customer profiles...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F1EA] border-b border-[#E5DFD5] text-[#6E6355] font-semibold uppercase tracking-wider text-[11px]">
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Contact & Phone</th>
                  <th className="p-4 font-semibold">Location / District</th>
                  <th className="p-4 font-semibold">Total Orders</th>
                  <th className="p-4 font-semibold">Lifetime Spend</th>
                  <th className="p-4 font-semibold">Tier</th>
                  <th className="p-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE6DC] font-medium text-[#1E1812]">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1e1812] text-[#E6AD35] border border-[#403221] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[#100D0A]">{c.name}</p>
                          <p className="text-[11px] text-[#7A6E5D]">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#100D0A] font-mono">{c.phone}</td>
                    <td className="p-4 text-[#7A6E5D]">{c.district}</td>
                    <td className="p-4 font-bold text-[#100D0A]">{c.totalOrders} orders</td>
                    <td className="p-4 font-bold text-[#b0782e]">{formatPrice(c.totalSpent)}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                        c.status === 'VIP Customer'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="bg-[#E6AD35] hover:bg-[#F5C451] text-[#100D0A] font-bold text-xs px-3 py-1.5 rounded-xl cursor-pointer transition-all shadow-2xs">
                        View Orders
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
