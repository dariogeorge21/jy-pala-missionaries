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
    <main className="relative w-full min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[var(--bg)]">
      {/* Dynamic Animated Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] md:w-[50vw] md:h-[50vw] rounded-full opacity-30 mix-blend-screen"
          style={{ 
            background: 'radial-gradient(circle at center, rgba(99,102,241,0.4) 0%, transparent 60%)',
            filter: 'blur(60px)',
            animation: 'pulse 15s ease-in-out infinite alternate'
          }}
        />
        <div 
          className="absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] md:w-[50vw] md:h-[50vw] rounded-full opacity-20 mix-blend-screen"
          style={{ 
            background: 'radial-gradient(circle at center, rgba(139,92,246,0.3) 0%, transparent 60%)',
            filter: 'blur(60px)',
            animation: 'pulse 20s ease-in-out infinite alternate-reverse'
          }}
        />
      </div>

      <div className="relative w-full max-w-md z-10" style={{ animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center rounded-2xl mb-6 shadow-2xl relative group overflow-hidden">
            
              <img src="/jy.png" alt="JY Pala Logo" className="w-24 h-24"/>
            
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">Jesus Youth</h1>
          <p className="text-lg md:text-xl font-medium" style={{ color: 'rgba(224,231,255,0.9)' }}>
            Pala Missionaries
          </p>
          <p className="text-sm mt-3 uppercase tracking-widest font-semibold" style={{ color: 'rgba(165,180,252,0.6)' }}>
            Data Management Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-8 relative overflow-hidden">
          {/* Subtle noise texture over card */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
          
          <div className="relative">
            <h2 className="text-xl font-semibold text-white mb-6 tracking-wide">Enter Password</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="relative">
                  <input
                    id="password-input"
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Enter system access key"
                    autoComplete="current-password"
                    className="input w-full py-3.5 px-4 text-base"
                    style={{ borderColor: error ? 'var(--danger)' : undefined }}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                </div>
                
                {error && (
                  <div className="mt-3 text-sm flex items-start gap-2 animate-[fadeIn_0.2s_ease]" style={{ color: 'var(--danger)' }}>
                    <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-3.5 text-base shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </svg>
                    Authenticating...
                  </span>
                ) : 'Secure Login'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs mt-10 font-medium tracking-wide" style={{ color: 'rgba(148,163,184,0.4)' }}>
          © {new Date().getFullYear()} Jesus Youth Pala Missionaries
        </p>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.05) translate(2%, 2%); }
          100% { transform: scale(1) translate(-2%, -2%); }
        }
      `}} />
    </main>
  );
}
