'use client';

import React, { useState, useEffect } from 'react';
import {
  Banknote,
  ShoppingBag,
  Clock,
  Package,
  AlertTriangle,
  Users,
  TrendingUp,
  Calendar,
  Loader2,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [range, setRange] = useState('30days');
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?range=${range}`);
      const data = await res.json();
      if (data.success) {
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Fetch analytics error', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#1a56db', '#06b6d4', '#0f172a', '#38bdf8', '#10b981'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-[#0f172a]">
      {/* Page Header & Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-[#e8e7e1] shadow-2xs">
        <div>
          <h1 className="font-bold text-xl text-[#0f172a] tracking-tight">
            Store Performance & Revenue Analytics
          </h1>
          <p className="text-xs text-[#64748b] mt-0.5">
            Real-time business insights from customer orders, payments, and product stock levels.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 bg-[#edece6] border-none rounded-xl px-3 py-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#64748b] shrink-0" />
          <span className="text-xs font-semibold text-[#475569]">Range:</span>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-transparent font-bold text-xs text-[#0f172a] focus:outline-hidden cursor-pointer"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="thisYear">This Year</option>
            <option value="allTime">All Time</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[#1a56db]">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-xs font-semibold text-[#64748b]">Calculating store analytics...</p>
        </div>
      ) : (
        <>
          {/* Top Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Today's Sales */}
            <div className="bg-white p-5 rounded-2xl border border-[#e8e7e1] shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-[#64748b]">
                <span className="text-xs font-medium">Today&apos;s Sales</span>
                <div className="p-1.5 bg-[#dcfce7] text-[#15803d] rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="font-bold text-2xl text-[#0f172a]">
                {formatPrice(analytics?.summary?.todaySales || 0)}
              </div>
              <p className="text-[11px] text-[#64748b]">
                {analytics?.summary?.todayOrdersCount || 0} orders received today
              </p>
            </div>

            {/* Total Revenue */}
            <div className="bg-white p-5 rounded-2xl border border-[#e8e7e1] shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-[#64748b]">
                <span className="text-xs font-medium">Total Revenue ({range})</span>
                <div className="p-1.5 bg-[#dbeafe] text-[#1a56db] rounded-lg">
                  <Banknote className="w-4 h-4" />
                </div>
              </div>
              <div className="font-bold text-2xl text-[#0f172a]">
                {formatPrice(analytics?.summary?.totalRevenue || 0)}
              </div>
              <p className="text-[11px] text-[#64748b]">
                Avg order value: {formatPrice(analytics?.summary?.avgOrderValue || 0)}
              </p>
            </div>

            {/* Pending Orders */}
            <div className="bg-white p-5 rounded-2xl border border-[#e8e7e1] shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-[#64748b]">
                <span className="text-xs font-medium">Pending Orders</span>
                <div className="p-1.5 bg-[#fee2e2] text-[#991b1b] rounded-lg">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="font-bold text-2xl text-[#0f172a]">
                {analytics?.summary?.pendingOrders || 0}
              </div>
              <p className="text-[11px] text-[#64748b]">
                Requires verification or dispatch
              </p>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white p-5 rounded-2xl border border-[#e8e7e1] shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-[#64748b]">
                <span className="text-xs font-medium">Low Stock Products</span>
                <div className="p-1.5 bg-[#fef3c7] text-[#92400e] rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="font-bold text-2xl text-[#0f172a]">
                {analytics?.summary?.lowStockProducts || 0}
              </div>
              <p className="text-[11px] text-[#64748b]">
                Out of {analytics?.summary?.totalProducts || 0} active products
              </p>
            </div>
          </div>

          {/* Revenue & Sales Chart */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e8e7e1] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#ecebe5] pb-3">
              <h2 className="font-bold text-base text-[#0f172a]">
                Revenue & Sales Trend Over Time
              </h2>
            </div>
            <div className="h-72 w-full pt-2">
              {analytics?.charts?.salesOverTime?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.charts.salesOverTime}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1a56db" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#1a56db" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      formatter={(val: any) => [formatPrice(val), 'Revenue']}
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e0d8', fontSize: '12px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#1a56db"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorSales)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-[#94a3b8]">
                  No sales recorded yet in this range.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
