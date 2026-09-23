'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Access denied');
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setPassword('');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className={`w-full max-w-md ${shake ? 'animate-shake' : ''}`}>
        {/* Brand */}
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.5em] text-white/80 uppercase mb-3">
            OB MOTORS
          </p>
          <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase">
            Admin Console
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className="h-px w-12 bg-white/10" />
          <span className="text-[9px] tracking-[0.4em] text-white/30 uppercase">
            Restricted Access
          </span>
          <span className="h-px w-12 bg-white/10" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label className="block text-[10px] tracking-[0.3em] text-white/40 uppercase mb-3">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              disabled={loading}
              className="w-full px-0 py-4 text-base bg-transparent border-0 border-b border-white/20 text-white focus:border-white/60 outline-none transition-colors tracking-[0.3em] disabled:opacity-50"
              placeholder="••••••••••"
            />
          </div>

          {error && (
            <p className="text-[10px] tracking-[0.3em] text-red-400 uppercase mb-6">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-white text-black text-[10px] font-semibold tracking-[0.5em] uppercase hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {loading ? '[ Verifying... ]' : 'Enter'}
          </button>
        </form>

        <p className="text-[9px] tracking-[0.3em] text-white/20 uppercase text-center mt-12">
          © {new Date().getFullYear()} OB Motors
        </p>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}