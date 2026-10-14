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
  ArrowUpRight,
  CreditCard,
  CheckCircle2
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
import AdminRegionalMap from '@/components/admin/AdminRegionalMap';
import AdminRevenueTrend from '@/components/admin/AdminRevenueTrend';

// Custom Borderless Tooltip for AreaChart
const CustomAreaTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  const current = payload[0];
  return (
    <div
      className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-xl text-xs space-y-1 text-[#0f172a]"
      style={{ border: 'none', outline: 'none' }}
    >
      <p className="font-semibold text-[#64748b]">{label}</p>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#e6ad35]" />
        <span className="font-bold text-sm text-[#b0782e]">
          {formatPrice(current.value)}
        </span>
      </div>
      {current.payload?.orders !== undefined && (
        <p className="text-[11px] text-[#475569]">
          {current.payload.orders} orders processed
        </p>
      )}
    </div>
  );
};

// Custom Borderless Tooltip for Payment Breakdown
const CustomPaymentTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  return (
    <div
      className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-xl text-xs space-y-1 text-[#0f172a]"
      style={{ border: 'none', outline: 'none' }}
    >
      <p className="font-bold text-xs text-[#0f172a]">{item.name}</p>
      <p className="font-bold text-sm text-[#b0782e]">
        {formatPrice(item.value)}
      </p>
      {item.payload?.count !== undefined && (
        <p className="text-[11px] text-[#64748b]">{item.payload.count} orders</p>
      )}
    </div>
  );
};

// Custom Borderless Tooltip for Order Status
const CustomStatusTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  return (
    <div
      className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-xl text-xs space-y-1 text-[#0f172a]"
      style={{ border: 'none', outline: 'none' }}
    >
      <p className="font-bold text-xs text-[#0f172a]">{label}</p>
      <p className="font-bold text-sm text-[#b0782e]">
        {item.value} orders
      </p>
    </div>
  );
};

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

  const COLORS = ['#e6ad35', '#b0782e', '#302316', '#dfc78d', '#8c5b24'];

  const rangeLabels: Record<string, string> = {
    today: 'Today',
    yesterday: 'Yesterday',
    '7days': 'Last 7 Days',
    '30days': 'Last 30 Days',
    thisMonth: 'This Month',
    thisYear: 'This Year',
    allTime: 'All Time'
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto font-sans text-[#0f172a]">
      {loading ? (
        <div className="py-20 text-center text-[#e6ad35]">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-xs font-semibold text-[#64748b]">Calculating store analytics...</p>
        </div>
      ) : (
        <>
          {/* Unified Master Analytics Dashboard (Single-screen Zero-scroll View) */}
          <AdminRevenueTrend
            realData={analytics?.charts?.salesOverTime}
            todaySales={analytics?.summary?.todaySales}
            todayOrdersCount={analytics?.summary?.todayOrdersCount}
            totalRevenue={analytics?.summary?.totalRevenue}
            totalOrders={analytics?.summary?.totalOrders}
            pendingOrders={analytics?.summary?.pendingOrders}
            lowStockProducts={analytics?.summary?.lowStockProducts}
            totalProducts={analytics?.summary?.totalProducts}
            avgOrderValue={analytics?.summary?.avgOrderValue}
          />

          {/* DYNAMIC REGIONAL MAP: Interactive Bangladesh Sales & Logistics Breakdown */}
          <AdminRegionalMap
            data={analytics?.charts?.regionalBreakdown || []}
            rangeLabel={rangeLabels[range] || range}
          />

          {/* Payment Method & Order Workflow Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Payment Method Breakdown */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5DFD5] shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#E6AD35]" />
                  <h3 className="font-bold text-sm text-[#100D0A]">
                    Payment Methods Distribution
                  </h3>
                </div>
                <span className="text-[11px] text-[#796E5F]">bKash, Nagad, COD</span>
              </div>
              <div className="h-64 flex items-center justify-center">
                {analytics?.charts?.paymentBreakdown?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart accessibilityLayer={false}>
                      <Pie
                        data={analytics.charts.paymentBreakdown}
                        dataKey="amount"
                        nameKey="method"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={85}
                        paddingAngle={3}
                      >
                        {analytics.charts.paymentBreakdown.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPaymentTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-xs text-[#796E5F]">No payment data yet in this range.</div>
                )}
              </div>
            </div>

            {/* Order Status Breakdown */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5DFD5] shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E6AD35]" />
                  <h3 className="font-bold text-sm text-[#100D0A]">
                    Order Fulfillment Pipeline
                  </h3>
                </div>
                <span className="text-[11px] text-[#796E5F]">Status breakdown</span>
              </div>
              <div className="h-64 flex items-center justify-center">
                {analytics?.charts?.statusBreakdown?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      accessibilityLayer={false}
                      data={analytics.charts.statusBreakdown}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <XAxis dataKey="status" stroke="#A59A88" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#A59A88" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip
                        content={<CustomStatusTooltip />}
                        cursor={{ fill: 'rgba(230, 173, 53, 0.08)' }}
                      />
                      <Bar dataKey="count" fill="#E6AD35" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-xs text-[#796E5F]">No status breakdown yet in this range.</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
