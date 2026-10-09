'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Loader2, Info, Sparkles } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });

      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        router.push('/account');
      } else {
        setErrorMsg(data.error || 'Registration failed.');
      }
    } catch (err) {
      console.error('Registration error', err);
      setErrorMsg('Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-[#f7f3eb]">
      <div className="bg-[#14100c] p-8 sm:p-10 rounded-3xl border border-[#c9933a]/30 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c9933a] uppercase tracking-widest bg-[#221a12] px-3.5 py-1 rounded-full border border-[#c9933a]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXCLUSIVE PRIVILEGE</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#f7f3eb]">Create Account</h1>
          <p className="text-xs text-[#a89b88]">
            Join Yah SABAB to track orders, save delivery addresses, and receive festive previews.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#381419] border border-red-500/40 text-red-200 text-xs font-semibold rounded-xl flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#b8ab99] uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tanvir Hossain"
                className="w-full bg-[#1c1611] border border-[#c9933a]/30 rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm text-[#f7f3eb] placeholder:text-[#6e6153] focus:outline-hidden focus:border-[#c9933a]"
              />
              <User className="w-4 h-4 text-[#8c8071] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#b8ab99] uppercase tracking-wider mb-1.5">
              Email Address *
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
              Bangladesh Contact Number *
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01712345678"
                className="w-full bg-[#1c1611] border border-[#c9933a]/30 rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm text-[#f7f3eb] placeholder:text-[#6e6153] focus:outline-hidden focus:border-[#c9933a]"
              />
              <Phone className="w-4 h-4 text-[#8c8071] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#b8ab99] uppercase tracking-wider mb-1.5">
              Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register Account'}
          </button>
        </form>

        <div className="text-center text-xs text-[#a89b88] pt-2 border-t border-[#c9933a]/20">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-bold text-[#c9933a] hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
