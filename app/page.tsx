'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Initialize DB on first load
  useEffect(() => {
    fetch('/api/init').catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) { setError('Please enter the password.'); return; }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/dashboard');
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative w-full min-h-screen flex items-center justify-center p-4 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-16 -left-16 md:-top-32 md:-left-32 w-64 h-64 md:w-96 md:h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }}
        />
        <div
          className="absolute -bottom-16 -right-16 md:-bottom-32 md:-right-32 w-64 h-64 md:w-96 md:h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-4 md:mb-8">
          <div
            className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl mb-4"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Jesus Youth</h1>
          <p className="text-base md:text-lg font-medium mt-1" style={{ color: 'rgba(199,214,254,0.9)' }}>
            Pala Missionaries
          </p>
          <p className="text-sm mt-1" style={{ color: 'rgba(165,180,252,0.7)' }}>
            Data Management Portal
          </p>
        </div>

        {/* Login Card */}
        <div
          className="rounded-2xl p-4 md:p-8"
          style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          }}
        >
          <h2 className="text-lg font-semibold text-white mb-6 text-center">Welcome back</h2>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(199,214,254,0.9)' }}>
                Password
              </label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter access password"
                autoComplete="current-password"
                className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl text-white placeholder-white/50 outline-none text-sm font-medium transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: error ? '1px solid rgba(252,165,165,0.8)' : '1px solid rgba(255,255,255,0.2)',
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid rgba(165,180,252,0.8)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                  e.target.style.border = error ? '1px solid rgba(252,165,165,0.8)' : '1px solid rgba(255,255,255,0.2)';
                }}
              />
              {error && (
                <p className="mt-2 text-sm flex items-center gap-2" style={{ color: 'rgba(252,165,165,0.95)' }}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  {error}
                </p>
              )}
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 mt-2"
              style={{
                background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(99,102,241,0.4)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Verifying...
                </span>
              ) : 'Access Dashboard →'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'rgba(148,163,184,0.6)' }}>
          © {new Date().getFullYear()} Jesus Youth Pala Missionaries
        </p>
      </div>
    </main>
  );
}
