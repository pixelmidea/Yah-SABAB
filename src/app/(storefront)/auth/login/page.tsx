'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, Info, Sparkles } from 'lucide-react';
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

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPass })
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
        setErrorMsg(data.error || 'User not found. Try initializing demo data below.');
      }
    } catch (err) {
      console.error('Demo login error', err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState('');

  const handleSeedData = async () => {
    setSeeding(true);
    setSeedSuccess('');
    setErrorMsg('');
    try {
      const res = await fetch('/api/seed');
      const data = await res.json();
      if (data.success) {
        setSeedSuccess('Database populated with Panjabi collection & Admin user!');
      } else {
        setErrorMsg(data.error || 'Failed to seed database');
      }
    } catch {
      setErrorMsg('Error connecting to database');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-[#f7f3eb]">
      <div className="bg-[#14100c] p-8 sm:p-10 rounded-3xl border border-[#c9933a]/30 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c9933a] uppercase tracking-widest bg-[#221a12] px-3.5 py-1 rounded-full border border-[#c9933a]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>YAH SABAB ACCOUNT</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#f7f3eb]">Welcome Back</h1>
          <p className="text-xs text-[#a89b88]">
            Sign in to access your orders, track shipments, and receive member privileges.
          </p>
        </div>

        {/* 1-Click Fast Admin & Customer Testing Buttons */}
        <div className="p-4 bg-[#1f1913] rounded-2xl border border-[#c9933a]/30 text-xs text-[#d6cdbf] space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-bold text-[#c9933a] flex items-center gap-1.5">
              <span>⚡ One-Click Demo Login</span>
            </p>
            <button
              type="button"
              onClick={handleSeedData}
              disabled={seeding}
              className="text-[10px] text-[#c9933a] hover:underline bg-[#2b2116] px-2 py-0.5 rounded border border-[#c9933a]/30 disabled:opacity-50"
            >
              {seeding ? 'Seeding...' : 'Reset/Seed Atlas DB'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('admin@yahsabab.com', 'Admin@123456')}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] font-bold text-[11px] shadow hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-1"
            >
              <span>🔑 Login as Admin</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('tanvir@gmail.com', 'Customer@123456')}
              className="py-2.5 px-3 rounded-xl bg-[#2a2117] text-[#f5eedb] hover:bg-[#382b1d] font-semibold text-[11px] border border-[#c9933a]/40 shadow transition-all disabled:opacity-50 flex items-center justify-center gap-1"
            >
              <span>👤 Login as Customer</span>
            </button>
          </div>

          <div className="text-[10px] text-[#a89b88] flex justify-between pt-1 border-t border-[#c9933a]/15">
            <span>Admin: <code>admin@yahsabab.com</code></span>
            <span>Pass: <code>Admin@123456</code></span>
          </div>

          {seedSuccess && (
            <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-[11px] rounded-lg">
              ✓ {seedSuccess}
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#381419] border border-red-500/40 text-red-200 text-xs font-semibold rounded-xl flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#b8ab99] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#1c1611] border border-[#c9933a]/30 rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm text-[#f7f3eb] placeholder:text-[#6e6153] focus:outline-hidden focus:border-[#c9933a]"
              />
              <Mail className="w-4 h-4 text-[#8c8071] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#b8ab99] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1c1611] border border-[#c9933a]/30 rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm text-[#f7f3eb] placeholder:text-[#6e6153] focus:outline-hidden focus:border-[#c9933a]"
              />
              <Lock className="w-4 h-4 text-[#8c8071] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] hover:opacity-95 transition-opacity shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-[#a89b88] pt-2 border-t border-[#c9933a]/20">
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-bold text-[#c9933a] hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
