'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, Info } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/account');
        }
      } else {
        setErrorMsg(data.error || 'Invalid login credentials');
      }
    } catch (err) {
      console.error('Login error', err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-xs text-slate-500">
            Sign in to access your orders, track shipments, and manage profile settings.
          </p>
        </div>

        {/* Preset Quick Login Credentials for Testing */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
          <p className="font-bold">🔑 Quick Demo Login Credentials:</p>
          <div className="flex justify-between items-center text-[11px]">
            <span>Admin: <code>admin@yahsabab.com</code> / <code>Admin@123456</code></span>
            <button
              onClick={() => { setEmail('admin@yahsabab.com'); setPassword('Admin@123456'); }}
              className="text-amber-900 font-bold underline"
            >
              Fill
            </button>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span>Customer: <code>tanvir@gmail.com</code> / <code>Customer@123456</code></span>
            <button
              onClick={() => { setEmail('tanvir@gmail.com'); setPassword('Customer@123456'); }}
              className="text-amber-900 font-bold underline"
            >
              Fill
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-hidden focus:border-amber-800"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-hidden focus:border-amber-800"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-amber-900 text-white hover:bg-amber-950 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-bold text-amber-900 hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
