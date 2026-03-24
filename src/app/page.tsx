'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsName, setNeedsName] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phone.toLowerCase().trim() !== 'admin') {
      const digitCount = phone.replace(/\D/g, '').length;
      if (digitCount !== 10) {
        setError('Phone number is not correct.');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setNeedsName(true);
          setError('');
        } else {
          setError(data.error || 'Something went wrong');
        }
        setLoading(false);
        return;
      }

      if (data.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Network error');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh', marginTop: '-10vh' }}>
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, background: 'var(--text-primary)', borderRadius: 'var(--radius-lg)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--bg-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
        </div>
        <h1 className="mb-4" style={{ fontSize: '28px' }}>Social Share</h1>
        <p className="text-secondary mb-8">Login to receive your unique comment for today's reel.</p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          {needsName && (
            <div className="mb-8" style={{ background: 'var(--surface-color)', border: '1px solid var(--border)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <p className="mb-4" style={{ fontSize: '15px', fontWeight: 500 }}>
                You are not registered yet. Please enter your name below to register instantly!
              </p>
              <label className="label">Full Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-8">
            <label className="label">Phone Number (WhatsApp)</label>
            <input
              type="tel"
              className="input-field"
              placeholder="+91 123456..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-danger mb-4" style={{ fontSize: '14px', background: 'rgba(239,68,68,0.1)', padding: '12px', borderRadius: '8px' }}>{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <div className="loader" style={{ width: 20, height: 20 }}></div> : (needsName ? 'Sign Up & Continue' : 'Login')}
          </button>
        </form>
      </div>
    </div>
  );
}
