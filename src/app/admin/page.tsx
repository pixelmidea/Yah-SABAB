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
  Loader2
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

  const COLORS = ['#831843', '#c2410c', '#6b21a8', '#047857', '#0369a1'];

  return (
    <div className="space-y-8">
      {/* Page Header & Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Store Performance & Revenue Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time business insights from customer orders, payment verifications, and stock levels.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <Calendar className="w-4 h-4 text-amber-900 shrink-0" />
          <span className="text-xs font-semibold text-slate-600">Range:</span>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-transparent font-bold text-xs text-slate-900 focus:outline-hidden"
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
        <div className="py-20 text-center text-amber-900">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold">Calculating business analytics...</p>
        </div>
      ) : (
        <>
          {/* Top Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Today's Sales */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Today's Sales</span>
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="font-serif text-2xl font-bold text-slate-900">
                {formatPrice(analytics?.summary?.todaySales || 0)}
              </div>
              <p className="text-xs text-slate-500">
                {analytics?.summary?.todayOrdersCount || 0} orders received today
              </p>
            </div>

            {/* Total Revenue */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Total Revenue ({range})</span>
                <div className="p-2 bg-amber-50 text-amber-900 rounded-xl">
                  <Banknote className="w-5 h-5" />
                </div>
              </div>
              <div className="font-serif text-2xl font-bold text-amber-950">
                {formatPrice(analytics?.summary?.totalRevenue || 0)}
              </div>
              <p className="text-xs text-slate-500">
                Avg order value: {formatPrice(analytics?.summary?.avgOrderValue || 0)}
              </p>
            </div>

            {/* Pending Orders */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Pending Orders</span>
                <div className="p-2 bg-rose-50 text-rose-700 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="font-serif text-2xl font-bold text-slate-900">
                {analytics?.summary?.pendingOrders || 0}
              </div>
              <p className="text-xs text-slate-500">
                Requires payment verification or dispatch
              </p>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Low Stock Products</span>
                <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <div className="font-serif text-2xl font-bold text-slate-900">
                {analytics?.summary?.lowStockProducts || 0}
              </div>
              <p className="text-xs text-slate-500">
                Out of {analytics?.summary?.totalProducts || 0} total active products
              </p>
            </div>
          </div>

          {/* Revenue & Sales Chart */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="font-serif text-xl font-bold text-slate-900">
                Revenue & Sales Trend Over Time
              </h2>
            </div>
            <div className="h-72 w-full pt-2">
              {analytics?.charts?.salesOverTime?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.charts.salesOverTime}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#78350f" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#78350f" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      formatter={(val: any) => [`৳${val.toLocaleString('en-BD')}`, 'Sales']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#78350f" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  No sales recorded in this selected timeframe.
                </div>
              )}
            </div>
          </div>

          {/* Payment Method & Order Status Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Payment Method Breakdown
              </h3>
              <div className="h-64 flex items-center justify-center">
                {analytics?.charts?.paymentBreakdown?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.charts.paymentBreakdown}
                        dataKey="amount"
                        nameKey="method"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry: any) => `${entry.method}: ৳${(entry.amount || 0).toLocaleString('en-BD')}`}
                      >
                        {analytics.charts.paymentBreakdown.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: any) => [`৳${val.toLocaleString('en-BD')}`, 'Total Revenue']} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-slate-400 text-xs">No payment data yet</div>
                )}
              </div>
            </div>

            {/* Order Status Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Order Workflow Status
              </h3>
              <div className="h-64 flex items-center justify-center">
                {analytics?.charts?.statusBreakdown?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.charts.statusBreakdown}>
                      <XAxis dataKey="status" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#78350f" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-slate-400 text-xs">No status breakdown yet</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
