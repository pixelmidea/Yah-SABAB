'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Shield,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  Loader2,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  ExternalLink,
  Edit3,
  Trash2,
  X,
  TrendingUp,
  ShoppingBag,
  Sparkles,
  Copy,
  Check,
  Filter,
  RefreshCw,
  Send,
  AlertCircle
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'staff';
  isActive: boolean;
  division: string;
  district?: string;
  city?: string;
  notes?: string;
  totalOrders: number;
  totalSpent: number;
  latestOrderDate?: string | null;
  lastLogin?: string | null;
  createdAt: string;
}

const DIVISIONS = [
  'All',
  'Dhaka',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Rangpur',
  'Mymensingh'
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [divisionFilter, setDivisionFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'spent' | 'orders'>('newest');

  // Modals & Drawers
  const [manageUser, setManageUser] = useState<UserRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Form states for Add User
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer' as 'customer' | 'staff' | 'admin',
    division: 'Dhaka',
    district: '',
    city: '',
    notes: ''
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // Form states for Edit / Manage User
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer' as 'customer' | 'staff' | 'admin',
    isActive: true,
    division: 'Dhaka',
    district: '',
    city: '',
    notes: '',
    newPassword: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Fetch real users from MongoDB
  const fetchUsers = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        console.error('Failed to load users from DB:', data.error);
      }
    } catch (err) {
      console.error('Network error fetching users:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Sync edit form whenever manageUser opens
  useEffect(() => {
    if (manageUser) {
      setEditForm({
        name: manageUser.name || '',
        email: manageUser.email || '',
        phone: manageUser.phone || '',
        role: manageUser.role || 'customer',
        isActive: manageUser.isActive !== false,
        division: manageUser.division || 'Dhaka',
        district: manageUser.district || '',
        city: manageUser.city || '',
        notes: manageUser.notes || '',
        newPassword: ''
      });
      setDeleteConfirm(false);
    }
  }, [manageUser]);

  // Toast / notice helper
  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Demographic stats calculation
  const stats = useMemo(() => {
    const total = users.length;
    const customers = users.filter((u) => u.role === 'customer').length;
    const buyers = users.filter((u) => u.totalOrders > 0).length;

    // Division breakdown
    const divCounts: Record<string, number> = {};
    users.forEach((u) => {
      const div = u.division || 'Dhaka';
      divCounts[div] = (divCounts[div] || 0) + 1;
    });

    let topDiv = 'Dhaka';
    let topCount = 0;
    Object.entries(divCounts).forEach(([div, count]) => {
      if (count > topCount) {
        topCount = count;
        topDiv = div;
      }
    });

    const topDivPct = total > 0 ? Math.round((topCount / total) * 100) : 0;

    return {
      total,
      customers,
      buyers,
      topDiv,
      topDivPct,
      divCounts
    };
  }, [users]);

  // Filtering and sorting
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        if (roleFilter !== 'all' && u.role !== roleFilter) return false;
        if (divisionFilter !== 'All' && u.division !== divisionFilter) return false;

        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = u.name?.toLowerCase().includes(q);
          const matchEmail = u.email?.toLowerCase().includes(q);
          const matchPhone = u.phone?.toLowerCase().includes(q);
          const matchDistrict = u.district?.toLowerCase().includes(q);
          const matchDivision = u.division?.toLowerCase().includes(q);
          return matchName || matchEmail || matchPhone || matchDistrict || matchDivision;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'spent') return (b.totalSpent || 0) - (a.totalSpent || 0);
        if (sortBy === 'orders') return (b.totalOrders || 0) - (a.totalOrders || 0);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [users, roleFilter, divisionFilter, search, sortBy]);

  // Handle Add User Submit
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddLoading(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm)
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUsers((prev) => [data.user, ...prev]);
        setIsAddModalOpen(false);
        setAddForm({
          name: '',
          email: '',
          phone: '',
          password: '',
          role: 'customer',
          division: 'Dhaka',
          district: '',
          city: '',
          notes: ''
        });
        showNotice(`Account for ${data.user.name} created successfully in MongoDB.`);
      } else {
        setAddError(data.error || 'Failed to create user account.');
      }
    } catch (err: any) {
      setAddError(err.message || 'Network error occurred while saving user.');
    } finally {
      setAddLoading(false);
    }
  };

  // Handle Update User Submit
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manageUser) return;
    setEditLoading(true);

    try {
      const payload: any = {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        role: editForm.role,
        isActive: editForm.isActive,
        division: editForm.division,
        district: editForm.district,
        city: editForm.city,
        notes: editForm.notes
      };
      if (editForm.newPassword.trim()) {
        payload.password = editForm.newPassword.trim();
      }

      const res = await fetch(`/api/users/${manageUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUsers((prev) =>
          prev.map((u) => (u._id === manageUser._id ? { ...u, ...data.user } : u))
        );
        setManageUser(null);
        showNotice(`User "${data.user.name}" updated successfully.`);
      } else {
        alert(data.error || 'Failed to update user.');
      }
    } catch (err: any) {
      alert('Error updating user: ' + err.message);
    } finally {
      setEditLoading(false);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async () => {
    if (!manageUser) return;
    setEditLoading(true);

    try {
      const res = await fetch(`/api/users/${manageUser._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== manageUser._id));
        setManageUser(null);
        showNotice('User permanently deleted from database.');
      } else {
        alert(data.error || 'Failed to delete user.');
      }
    } catch (err: any) {
      alert('Error deleting user: ' + err.message);
    } finally {
      setEditLoading(false);
    }
  };

  // Copy helpers for Campaign Targeting
  const copyCampaignList = (type: 'phone' | 'email') => {
    const list = filteredUsers
      .map((u) => (type === 'phone' ? u.phone : u.email))
      .filter(Boolean);
    const text = list.join(', ');
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
    showNotice(`Copied ${list.length} ${type === 'phone' ? 'phone numbers' : 'emails'} to clipboard!`);
  };

  // WhatsApp Link Helper
  const getWhatsAppLink = (phone: string, name: string) => {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) clean = '880' + clean.slice(1);
    if (!clean.startsWith('880')) clean = '880' + clean;
    const msg = encodeURIComponent(
      `Assalamu Alaikum ${name}, warm greetings from Yah SABAB! We are contacting you regarding your account and orders.`
    );
    return `https://wa.me/${clean}?text=${msg}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-[#100D0A]">
      {/* Toast Notification */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#100D0A] text-[#F8F3E9] px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200 border border-[#403221]">
          <CheckCircle2 className="w-4 h-4 text-[#E6AD35] shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#796E5F] mb-1">
            <span>Workspace</span>
            <span>&gt;</span>
            <span className="font-semibold text-[#100D0A]">Audience & Access</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#100D0A] tracking-tight">
              User Management & Regional Targeting
            </h1>
            <button
              type="button"
              onClick={() => fetchUsers(true)}
              disabled={refreshing}
              title="Refresh from MongoDB"
              className="p-1.5 rounded-lg text-[#796E5F] hover:text-[#100D0A] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-xs text-[#796E5F] mt-0.5">
            Real MongoDB audience sync: manage store admins, staff, and registered customers with division logistics targeting.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Campaign Export List Actions */}
          <button
            type="button"
            onClick={() => copyCampaignList('phone')}
            className="bg-white border border-[#DDD7CD] hover:bg-[#FAF7F2] text-[#302316] font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            title="Copy phone numbers for SMS campaigns"
          >
            {copiedType === 'phone' ? (
              <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
            ) : (
              <Phone className="w-3.5 h-3.5 text-[#796E5F]" />
            )}
            <span>SMS Target ({filteredUsers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => copyCampaignList('email')}
            className="bg-white border border-[#DDD7CD] hover:bg-[#FAF7F2] text-[#302316] font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            title="Copy emails for newsletter campaign"
          >
            {copiedType === 'email' ? (
              <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
            ) : (
              <Mail className="w-3.5 h-3.5 text-[#796E5F]" />
            )}
            <span>Email List</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#E6AD35] hover:bg-[#D49B24] text-[#100D0A] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add User</span>
          </button>
        </div>
      </div>

      {/* Top Geographic & Audience KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4.5 rounded-2xl border border-[#E5DFD5] shadow-xs">
          <div className="flex items-center justify-between text-[#796E5F] text-xs font-semibold mb-1.5">
            <span>Total Audience</span>
            <Users className="w-4 h-4 text-[#E6AD35]" />
          </div>
          <div className="text-xl font-bold text-[#100D0A]">{stats.total}</div>
          <div className="text-[11px] text-[#796E5F] mt-1 flex items-center gap-1 font-medium">
            <span className="text-[#2E7D32] font-bold">{stats.customers} Customers</span>
            <span>• Live in MongoDB</span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#E5DFD5] shadow-xs">
          <div className="flex items-center justify-between text-[#796E5F] text-xs font-semibold mb-1.5">
            <span>Top Division Audience</span>
            <MapPin className="w-4 h-4 text-[#E6AD35]" />
          </div>
          <div className="text-xl font-bold text-[#100D0A]">{stats.topDiv}</div>
          <div className="text-[11px] text-[#796E5F] mt-1 font-medium">
            <span className="text-[#7A5310] font-bold">{stats.topDivPct}%</span> of total store users
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#E5DFD5] shadow-xs">
          <div className="flex items-center justify-between text-[#796E5F] text-xs font-semibold mb-1.5">
            <span>Active Shoppers</span>
            <ShoppingBag className="w-4 h-4 text-[#7A5310]" />
          </div>
          <div className="text-xl font-bold text-[#100D0A]">{stats.buyers}</div>
          <div className="text-[11px] text-[#796E5F] mt-1 font-medium">
            Placed 1+ orders with fulfillment
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#E5DFD5] shadow-xs">
          <div className="flex items-center justify-between text-[#796E5F] text-xs font-semibold mb-1.5">
            <span>Direct WhatsApp Reach</span>
            <MessageCircle className="w-4 h-4 text-[#2E7D32]" />
          </div>
          <div className="text-xl font-bold text-[#100D0A]">{stats.total}</div>
          <div className="text-[11px] text-[#796E5F] mt-1 font-medium">
            100% verified BD contact numbers
          </div>
        </div>
      </div>

      {/* Regional Division Targeting Selector Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#E5DFD5] shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#100D0A]">
            <MapPin className="w-3.5 h-3.5 text-[#E6AD35]" />
            <span>Filter By Bangladesh Division (Geo Targeting):</span>
          </div>
          <span className="text-[11px] text-[#796E5F]">
            Showing {filteredUsers.length} user{filteredUsers.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {DIVISIONS.map((div) => {
            const count = div === 'All' ? users.length : stats.divCounts[div] || 0;
            const isSelected = divisionFilter === div;

            return (
              <button
                key={div}
                type="button"
                onClick={() => setDivisionFilter(div)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#100D0A] text-[#F8F3E9] border border-[#403221] shadow-xs'
                    : 'bg-[#FAF7F2] text-[#796E5F] hover:text-[#100D0A] hover:bg-[#EFECE6] border border-[#DDD7CD]'
                }`}
              >
                <span>{div}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-[#E6AD35] text-[#100D0A]' : 'bg-[#E5DFD5] text-[#302316]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, district, division..."
            className="w-full bg-white border border-[#DDD7CD] rounded-xl px-3.5 py-2 pl-9 text-xs font-medium text-[#100D0A] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35] transition-colors"
          />
          <Search className="w-4 h-4 text-[#A59A88] absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2.5">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border border-[#DDD7CD] text-[#302316] font-semibold text-xs px-3.5 py-2 rounded-xl focus:outline-hidden shadow-2xs cursor-pointer focus:border-[#E6AD35] transition-colors"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="staff">Staff / Managers</option>
            <option value="customer">Customers</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-[#DDD7CD] text-[#302316] font-semibold text-xs px-3.5 py-2 rounded-xl focus:outline-hidden shadow-2xs cursor-pointer focus:border-[#E6AD35] transition-colors"
          >
            <option value="newest">Joined: Newest First</option>
            <option value="spent">Highest Lifetime Spent</option>
            <option value="orders">Most Orders Placed</option>
          </select>
        </div>
      </div>

      {/* Main Users Table */}
      <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 text-center text-[#E6AD35]">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-xs text-[#796E5F] font-medium">Loading MongoDB audience records...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center text-[#796E5F]">
            <Users className="w-10 h-10 text-[#DDD7CD] mx-auto mb-2.5" />
            <p className="text-sm font-bold text-[#100D0A]">No users match your filter</p>
            <p className="text-xs text-[#A59A88] mt-1">
              Try adjusting your search query or reset division filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setRoleFilter('all');
                setDivisionFilter('All');
              }}
              className="mt-3 text-xs text-[#7A5310] font-semibold hover:underline cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E5DFD5] text-[#796E5F] font-semibold bg-[#FAF7F2]">
                  <th className="p-4 font-semibold">User Profile</th>
                  <th className="p-4 font-semibold">Direct Contact</th>
                  <th className="p-4 font-semibold">Location / Geo</th>
                  <th className="p-4 font-semibold">Lifetime Orders</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6] font-medium text-[#100D0A]">
                {filteredUsers.map((u) => {
                  const initials = u.name
                    ? u.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()
                    : 'YS';

                  return (
                    <tr key={u._id} className="hover:bg-[#FAF7F2] transition-colors">
                      {/* User Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#100D0A] text-[#E6AD35] border border-[#403221] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-[#100D0A] hover:text-[#7A5310] transition-colors">
                              {u.name}
                            </p>
                            <p className="text-[11px] text-[#796E5F] flex items-center gap-1">
                              <span>{u.email}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact + Instant WhatsApp / Call Action Icons */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="text-[#302316] font-semibold flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-[#A59A88]" />
                            <span>{u.phone}</span>
                          </p>
                          <div className="flex items-center gap-2">
                            <a
                              href={getWhatsAppLink(u.phone, u.name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-[#2E7D32] hover:text-[#1B5E20] font-bold inline-flex items-center gap-0.5 bg-[#E8F5E9] px-1.5 py-0.5 rounded-md border border-[#C8E6C9]"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-2.5 h-2.5" />
                              <span>WhatsApp</span>
                            </a>
                            <a
                              href={`tel:${u.phone}`}
                              className="text-[10px] text-[#7A5310] hover:text-[#52370B] font-bold inline-flex items-center gap-0.5 bg-[#FAF3E0] px-1.5 py-0.5 rounded-md border border-[#EADBBD]"
                              title="Direct Voice Call"
                            >
                              <Phone className="w-2.5 h-2.5" />
                              <span>Call</span>
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Location & Division */}
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#EFECE6] text-[#100D0A] border border-[#DDD7CD]">
                            <MapPin className="w-2.5 h-2.5 text-[#E6AD35]" />
                            <span>{u.division || 'Dhaka'}</span>
                          </span>
                          {u.district && (
                            <p className="text-[11px] text-[#796E5F] pl-1 font-medium truncate max-w-[150px]">
                              {u.district}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Orders & Total Spent */}
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-[#100D0A]">
                            {u.totalSpent ? formatPrice(u.totalSpent) : '৳0'}
                          </p>
                          <p className="text-[11px] text-[#796E5F]">
                            {u.totalOrders} order{u.totalOrders === 1 ? '' : 's'}
                          </p>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wide ${
                            u.role === 'admin'
                              ? 'bg-[#FAF3E0] text-[#7A5310] border border-[#EADBBD]'
                              : u.role === 'staff'
                              ? 'bg-[#FFF8E1] text-[#B78103] border border-[#FFE082]'
                              : 'bg-[#FAF7F2] text-[#302316] border border-[#DDD7CD]'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-semibold text-[11px] bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-semibold text-[11px] bg-[#FDF2F2] text-[#991B1B] border border-[#F8D7DA]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D9383A]" />
                            <span>Suspended</span>
                          </span>
                        )}
                      </td>

                      {/* Action: Manage */}
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => setManageUser(u)}
                          className="bg-white hover:bg-[#FAF7F2] text-[#100D0A] border border-[#DDD7CD] hover:border-[#E6AD35] font-semibold text-xs px-3 py-1.5 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#E6AD35]" />
                          <span>Manage</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MANAGE USER MODAL / DRAWER */}
      {manageUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-[#E5DFD5] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-[#FAF7F2] border-b border-[#E5DFD5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#100D0A] text-[#E6AD35] border border-[#403221] flex items-center justify-center font-bold text-sm shadow-xs">
                  {manageUser.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#100D0A] leading-tight">
                    {manageUser.name}
                  </h3>
                  <p className="text-xs text-[#796E5F]">{manageUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setManageUser(null)}
                className="w-8 h-8 rounded-full bg-white border border-[#DDD7CD] flex items-center justify-center text-[#796E5F] hover:text-[#100D0A] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Communication Hub */}
            <div className="bg-[#FAF7F2] px-6 py-3 border-b border-[#E5DFD5] flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="font-semibold text-[#796E5F]">Direct Reach Out:</span>
              <div className="flex items-center gap-2">
                <a
                  href={getWhatsAppLink(manageUser.phone, manageUser.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-[#C8E6C9] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>
                <a
                  href={`tel:${manageUser.phone}`}
                  className="px-3 py-1.5 rounded-xl bg-[#100D0A] text-[#E6AD35] border border-[#403221] font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-[#251e17] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Voice Call</span>
                </a>
                <a
                  href={`mailto:${manageUser.email}`}
                  className="px-3 py-1.5 rounded-xl bg-white text-[#302316] border border-[#DDD7CD] font-semibold flex items-center gap-1.5 hover:bg-[#FAF7F2] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#796E5F]" />
                  <span>Email</span>
                </a>
              </div>
            </div>

            {/* Modal Body / Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              {/* Lifetime Stats Spotlight */}
              <div className="grid grid-cols-3 gap-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E5DFD5]">
                <div>
                  <span className="text-[10px] text-[#796E5F] font-bold uppercase tracking-wider block">
                    Total Spent
                  </span>
                  <span className="text-sm font-bold text-[#7A5310] block mt-0.5">
                    {formatPrice(manageUser.totalSpent || 0)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#796E5F] font-bold uppercase tracking-wider block">
                    Orders Placed
                  </span>
                  <span className="text-sm font-bold text-[#100D0A] block mt-0.5">
                    {manageUser.totalOrders || 0}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#796E5F] font-bold uppercase tracking-wider block">
                    Registered
                  </span>
                  <span className="text-sm font-bold text-[#100D0A] block mt-0.5">
                    {new Date(manageUser.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Edit Details Form */}
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#302316] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3 py-2 text-xs font-medium text-[#100D0A] focus:outline-hidden focus:border-[#E6AD35] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#302316] mb-1">
                      Bangladesh Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3 py-2 text-xs font-medium text-[#100D0A] focus:outline-hidden focus:border-[#E6AD35] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#302316] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3 py-2 text-xs font-medium text-[#100D0A] focus:outline-hidden focus:border-[#E6AD35] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#302316] mb-1">
                      Account Role & Access
                    </label>
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                      className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3 py-2 text-xs font-semibold text-[#100D0A] focus:outline-hidden focus:border-[#E6AD35] cursor-pointer"
                    >
                      <option value="customer">Customer (Storefront Member)</option>
                      <option value="staff">Staff / Manager (Order Processing)</option>
                      <option value="admin">Administrator (Full Access)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#302316] mb-1">
                      Geographic Division
                    </label>
                    <select
                      value={editForm.division}
                      onChange={(e) => setEditForm({ ...editForm, division: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3 py-2 text-xs font-semibold text-[#100D0A] focus:outline-hidden focus:border-[#E6AD35] cursor-pointer"
                    >
                      {DIVISIONS.filter((d) => d !== 'All').map((d) => (
                        <option key={d} value={d}>
                          {d} Division
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#302316] mb-1">
                      District / City Area
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Banani, Dhaka Metro"
                      value={editForm.district}
                      onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3 py-2 text-xs font-medium text-[#100D0A] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#302316] mb-1">
                    Internal Campaign & Customer Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. VIP Panjabi customer. Prefers express Banani hub pickup. Target in upcoming Eid campaign."
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3 py-2 text-xs font-medium text-[#100D0A] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35] transition-colors"
                  />
                </div>

                {/* Account Status Toggle */}
                <div className="flex items-center justify-between p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E5DFD5]">
                  <div>
                    <span className="font-bold text-[#100D0A] block text-xs">Account Status</span>
                    <span className="text-[11px] text-[#796E5F]">
                      {editForm.isActive ? 'User can log in and place orders' : 'User is suspended'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, isActive: !editForm.isActive })}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                      editForm.isActive
                        ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
                        : 'bg-[#FDF2F2] text-[#991B1B] border border-[#F8D7DA]'
                    }`}
                  >
                    {editForm.isActive ? 'Active' : 'Suspended'}
                  </button>
                </div>

                {/* Reset Password */}
                <div>
                  <label className="block text-[11px] font-bold text-[#302316] mb-1">
                    Reset Password (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Leave empty to keep unchanged"
                    value={editForm.newPassword}
                    onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3 py-2 text-xs font-medium text-[#100D0A] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35] transition-colors"
                  />
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-3 border-t border-[#E5DFD5] flex items-center justify-between gap-3">
                  <div>
                    {!deleteConfirm ? (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(true)}
                        className="text-[#D9383A] hover:text-[#991B1B] font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete User</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleDeleteUser}
                          disabled={editLoading}
                          className="bg-[#D9383A] hover:bg-[#991B1B] text-white font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                        >
                          Confirm Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(false)}
                          className="text-[#796E5F] hover:text-[#100D0A] text-xs font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setManageUser(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-[#796E5F] hover:text-[#100D0A] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      disabled={editLoading}
                      className="bg-[#E6AD35] hover:bg-[#D49B24] text-[#100D0A] font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {editLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#100D0A]" /> : null}
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E5DFD5] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 bg-[#FAF7F2] border-b border-[#E5DFD5] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#100D0A]">Create New User Account</h3>
                <p className="text-xs text-[#796E5F]">
                  Add a new storefront customer, staff member, or admin into MongoDB.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#DDD7CD] flex items-center justify-center text-[#796E5F] hover:text-[#100D0A] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleAddUser} className="p-6 overflow-y-auto space-y-4 text-xs">
              {addError && (
                <div className="p-3 bg-[#FDF2F2] border border-[#F8D7DA] text-[#991B1B] text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{addError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#302316] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nasir Yousuf"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3 py-2 text-xs font-medium text-[#100D0A] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#302316] mb-1">
                    Bangladesh Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01712345678"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3 py-2 text-xs font-medium text-[#100D0A] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#302316] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3 py-2 text-xs font-medium text-[#100D0A] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#302316] mb-1">
                    Initial Role
                  </label>
                  <select
                    value={addForm.role}
                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value as any })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3 py-2 text-xs font-semibold text-[#100D0A] focus:outline-hidden focus:border-[#E6AD35] cursor-pointer"
                  >
                    <option value="customer">Customer (Storefront Member)</option>
                    <option value="staff">Staff / Manager (Logistics)</option>
                    <option value="admin">Administrator (Full Control)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#302316] mb-1">
                    Division (Geo Campaign)
                  </label>
                  <select
                    value={addForm.division}
                    onChange={(e) => setAddForm({ ...addForm, division: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3 py-2 text-xs font-semibold text-[#100D0A] focus:outline-hidden focus:border-[#E6AD35] cursor-pointer"
                  >
                    {DIVISIONS.filter((d) => d !== 'All').map((d) => (
                      <option key={d} value={d}>
                        {d} Division
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#302316] mb-1">
                    District / Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Banani, Dhanmondi, Agrabad"
                    value={addForm.district}
                    onChange={(e) => setAddForm({ ...addForm, district: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3 py-2 text-xs font-medium text-[#100D0A] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#302316] mb-1">
                  Password (Optional, default: YahSabab@2026)
                </label>
                <input
                  type="password"
                  placeholder="Leave empty for auto-generated temporary password"
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3 py-2 text-xs font-medium text-[#100D0A] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#302316] mb-1">
                  Customer Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Add any logistics or VIP tags..."
                  value={addForm.notes}
                  onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3 py-2 text-xs font-medium text-[#100D0A] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35] transition-colors"
                />
              </div>

              <div className="pt-3 border-t border-[#E5DFD5] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#796E5F] hover:text-[#100D0A] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="bg-[#E6AD35] hover:bg-[#D49B24] text-[#100D0A] font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {addLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#100D0A]" /> : null}
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
