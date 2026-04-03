import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

type UserRole = 'admin' | 'teacher' | 'parent' | 'student';

const roleDashboards: Record<UserRole, string> = {
  admin: '/admin/dashboard',
  teacher: '/teacher/dashboard',
  parent: '/parent/dashboard',
  student: '/student/dashboard',
};

/** Forgot-password modal (inline, no extra route needed) */
function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would call POST /api/forgot-password
    // For now, simulate sending reset instructions
    setSent(true);
  };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', maxWidth: '380px', width: '100%', margin: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: 700 }}>Reset Password</h3>
        {sent ? (
          <>
            <p style={{ color: '#16a34a', fontWeight: 600 }}>✅ Password reset instructions sent!</p>
            <p style={{ color: '#555', fontSize: '0.9rem' }}>Check your inbox at <strong>{email}</strong>.<br/>Demo credentials: see your role's default password (e.g. admin123, teacher123, parent123, student123).</p>
            <button onClick={onClose} style={{ marginTop: '1rem', width: '100%', padding: '0.6rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>Close</button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ color: '#555', fontSize: '0.88rem', margin: '0 0 1rem' }}>Enter your registered email address and we'll send you reset instructions.</p>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
              style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '1rem', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" style={{ flex: 1, padding: '0.6rem', background: '#14532d', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>Send Instructions</button>
              <button type="button" onClick={onClose} style={{ padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/** AKMAL Logo — compact version for the auth card */
function AkmalLogoCard() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
      {/* Logo mark */}
      <svg width="64" height="46" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="70" cy="65" r="42" fill="none" stroke="#1a8080" strokeWidth="3" opacity="0.8"/>
        <ellipse cx="70" cy="65" rx="20" ry="42" fill="none" stroke="#1a8080" strokeWidth="2" opacity="0.6"/>
        <line x1="28" y1="65" x2="112" y2="65" stroke="#1a8080" strokeWidth="2" opacity="0.6"/>
        <line x1="35" y1="44" x2="105" y2="44" stroke="#1a8080" strokeWidth="1.5" opacity="0.4"/>
        <line x1="35" y1="86" x2="105" y2="86" stroke="#1a8080" strokeWidth="1.5" opacity="0.4"/>
        <path
          d="M85 30 C110 10, 170 20, 175 55 C165 35, 130 30, 108 50 C120 38, 145 40, 150 62 C140 48, 118 48, 105 62 C113 55, 128 58, 130 70 C118 62, 108 65, 105 75 L95 90 L90 65 Z"
          fill="url(#featherGradCard)"
        />
        <path d="M95 90 L105 30" stroke="#e07030" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
        <defs>
          <linearGradient id="featherGradCard" x1="95" y1="90" x2="175" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1a8080"/>
            <stop offset="50%" stopColor="#2da89a"/>
            <stop offset="100%" stopColor="#4ece8e"/>
          </linearGradient>
        </defs>
      </svg>

      {/* Text group */}
      <div style={{ lineHeight: 1.15 }}>
        <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#1a8080', letterSpacing: '0.06em', fontFamily: 'Georgia, serif' }}>
          AKMAL
        </div>
        <div style={{ fontSize: '0.52rem', fontWeight: 600, color: '#5a5a5a', letterSpacing: '0.12em' }}>
          AKADEMI AL-QURAN
        </div>
        <div style={{ fontSize: '0.52rem', fontWeight: 600, color: '#5a5a5a', letterSpacing: '0.12em' }}>
          AMALILLAH
        </div>
      </div>
    </div>
  );
}

export function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') as UserRole | null;
  const actionParam = searchParams.get('action') || 'login';

  const [mode, setMode] = useState<'login' | 'register'>(
    actionParam === 'register' ? 'register' : 'login'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const selectedRole = roleParam && roleDashboards[roleParam] ? roleParam : null;

  const handleBack = () => navigate('/role-selection');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!selectedRole) {
      setError('Tiada peranan dipilih. Sila kembali dan pilih peranan.');
      return;
    }
    setIsLoading(true);

    try {
      // 1. Get CSRF token from Laravel
      const csrfRes = await fetch('/api/csrf-cookie');
      const csrfJson = await csrfRes.json();
      const csrfToken = csrfJson.token as string;

      // 2. POST login credentials
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
          role: selectedRole,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.message || json.errors?.email?.[0] || 'Log masuk gagal. Sila semak kelayakan anda.');
        setIsLoading(false);
        return;
      }

      // 3. Save authenticated user to storage (same shape as before)
      const authPayload = JSON.stringify({
        role: json.user.role,
        name: json.user.name,
        userId: json.user.id,
        email: json.user.email,
      });
      if (rememberMe) {
        localStorage.setItem('authUser', authPayload);
      } else {
        sessionStorage.setItem('authUser', authPayload);
      }

      navigate(roleDashboards[json.user.role as UserRole]);
    } catch (err) {
      setError('Ralat sambungan. Pastikan pelayan berjalan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!selectedRole) { setError('Tiada peranan dipilih. Sila kembali.'); return; }
    if (registerData.password !== registerData.confirmPassword) { setError('Kata laluan tidak sepadan.'); return; }
    if (registerData.password.length < 8) { setError('Kata laluan mestilah sekurang-kurangnya 8 aksara.'); return; }
    setIsLoading(true);

    try {
      // 1. Get CSRF token
      const csrfRes = await fetch('/api/csrf-cookie');
      const csrfJson = await csrfRes.json();
      const csrfToken = csrfJson.token as string;

      // 2. POST register
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
          name: registerData.fullName,
          email: registerData.email,
          password: registerData.password,
          password_confirmation: registerData.confirmPassword,
          role: selectedRole,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        // Show first validation error
        const firstError = json.errors
          ? Object.values(json.errors as Record<string, string[]>)[0]?.[0]
          : json.message;
        setError(firstError || 'Pendaftaran gagal. Sila semak maklumat anda.');
        setIsLoading(false);
        return;
      }

      // 3. Save user to sessionStorage
      sessionStorage.setItem('authUser', JSON.stringify({
        role: json.user.role,
        name: json.user.name,
        userId: json.user.id,
        email: json.user.email,
      }));

      navigate(roleDashboards[json.user.role as UserRole]);
    } catch (err) {
      setError('Ralat sambungan. Pastikan pelayan berjalan.');
    } finally {
      setIsLoading(false);
    }
  };

  /* ─── Shared input style ─── */
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.7rem 0.9rem 0.7rem 2.5rem',
    border: '1px solid #d0d0d0',
    borderRadius: '8px',
    fontSize: '0.88rem',
    outline: 'none',
    background: '#fafafa',
    boxSizing: 'border-box',
    color: '#333',
    transition: 'border-color 0.15s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#444',
    marginBottom: '0.35rem',
  };

  const iconWrap: React.CSSProperties = {
    position: 'absolute',
    left: '0.7rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#999',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {showForgotPassword && <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />}
      {/* ─── Blurred background: mimic the role selection page ─── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        filter: 'blur(6px)',
        transform: 'scale(1.05)',
      }}>
        {/* Left white side */}
        <div style={{ flex: '0 0 44%', background: '#ffffff' }} />
        {/* Right green side */}
        <div style={{ flex: 1, background: 'linear-gradient(160deg, #5bbf6e 0%, #3da862 40%, #8dd87a 100%)' }} />
      </div>
      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.18)' }} />

      {/* ─── Floating Card ─── */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '2rem 2rem 1.5rem',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.22)',
          border: '1px solid rgba(255,255,255,0.8)',
        }}>
          {/* Logo */}
          <div style={{ marginBottom: '1.1rem' }}>
            <AkmalLogoCard />
          </div>

          {/* Subtitle */}
          <p style={{
            textAlign: 'center',
            color: '#666',
            fontSize: '0.85rem',
            margin: '0 0 1.25rem',
          }}>
            {mode === 'login' ? 'Sign in to your account' : 'Register for an account'}
          </p>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: '0.9rem',
              padding: '0.6rem 0.8rem',
              background: '#fff0f0',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: '#dc2626',
            }}>
              {error}
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {mode === 'login' && (
            <form onSubmit={handleLogin}>
              {/* Email */}
              <div style={{ marginBottom: '0.9rem' }}>
                <label style={labelStyle}>Email / Username</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrap}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    style={inputStyle}
                    required
                    onFocus={(e) => { e.target.style.borderColor = '#2da89a'; e.target.style.background = '#fff'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#d0d0d0'; e.target.style.background = '#fafafa'; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '0.7rem' }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrap}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    style={{ ...inputStyle, paddingRight: '2.5rem' }}
                    required
                    onFocus={(e) => { e.target.style.borderColor = '#2da89a'; e.target.style.background = '#fff'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#d0d0d0'; e.target.style.background = '#fafafa'; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 0 }}
                  >
                    {showPassword
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#444', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: '14px', height: '14px', accentColor: '#16a34a' }}
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  style={{ background: 'none', border: 'none', color: '#16a34a', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', padding: 0 }}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.78rem',
                  background: isLoading ? '#4ade80' : '#16a34a',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = '#15803d'; }}
                onMouseLeave={(e) => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = '#16a34a'; }}
              >
                {isLoading ? (
                  <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                      <polyline points="10 17 15 12 10 7"/>
                      <line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                    Login
                  </>
                )}
              </button>

              {/* Toggle */}
              <p style={{ textAlign: 'center', marginTop: '0.9rem', fontSize: '0.82rem', color: '#666' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  style={{ background: 'none', border: 'none', color: '#16a34a', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: '0.82rem' }}
                >
                  Register
                </button>
              </p>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {mode === 'register' && (
            <form onSubmit={handleRegister}>
              {/* Full Name */}
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={labelStyle}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrap}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={registerData.fullName}
                    onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                    style={inputStyle}
                    required
                    onFocus={(e) => { e.target.style.borderColor = '#2da89a'; e.target.style.background = '#fff'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#d0d0d0'; e.target.style.background = '#fafafa'; }}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={labelStyle}>Email</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrap}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </span>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    style={inputStyle}
                    required
                    onFocus={(e) => { e.target.style.borderColor = '#2da89a'; e.target.style.background = '#fff'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#d0d0d0'; e.target.style.background = '#fafafa'; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrap}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    style={{ ...inputStyle, paddingRight: '2.5rem' }}
                    required
                    onFocus={(e) => { e.target.style.borderColor = '#2da89a'; e.target.style.background = '#fff'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#d0d0d0'; e.target.style.background = '#fafafa'; }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 0 }}>
                    {showPassword
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrap}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    style={{ ...inputStyle, paddingRight: '2.5rem' }}
                    required
                    onFocus={(e) => { e.target.style.borderColor = '#2da89a'; e.target.style.background = '#fff'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#d0d0d0'; e.target.style.background = '#fafafa'; }}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 0 }}>
                    {showConfirmPassword
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.78rem',
                  background: isLoading ? '#4ade80' : '#16a34a',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
                onMouseEnter={(e) => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = '#15803d'; }}
                onMouseLeave={(e) => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = '#16a34a'; }}
              >
                {isLoading
                  ? <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  : 'Create Account'
                }
              </button>

              {/* Toggle */}
              <p style={{ textAlign: 'center', marginTop: '0.9rem', fontSize: '0.82rem', color: '#666' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  style={{ background: 'none', border: 'none', color: '#16a34a', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: '0.82rem' }}
                >
                  Login
                </button>
              </p>
            </form>
          )}

          {/* Back link */}
          <div style={{ textAlign: 'center', marginTop: '0.6rem', borderTop: '1px solid #f0f0f0', paddingTop: '0.8rem' }}>
            <button
              onClick={handleBack}
              style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}
            >
              ← Back to role selection
            </button>
          </div>
        </div>
      </div>

      {/* Spin animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
