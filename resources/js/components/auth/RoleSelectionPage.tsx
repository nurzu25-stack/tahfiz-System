import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

type UserRole = 'admin' | 'teacher' | 'parent' | 'student';

interface RoleOption {
  id: UserRole;
  label: string;
  subtitle: string;
  emoji: string;
}

const roles: RoleOption[] = [
  {
    id: 'admin',
    label: 'Pentadbir',
    subtitle: 'Akses penuh ke semua modul sistem',
    emoji: '👑',
  },
  {
    id: 'teacher',
    label: 'Ustaz / Ustazah',
    subtitle: 'Urus rekod pelajar dan kemajuan hafazan',
    emoji: '🧑‍🏫',
  },
  {
    id: 'parent',
    label: 'Ibu Bapa / Penjaga',
    subtitle: 'Pantau kemajuan dan maklumat anak',
    emoji: '🐻',
  },
  {
    id: 'student',
    label: 'Pelajar',
    subtitle: 'Lihat jadual dan kemajuan hafazan sendiri',
    emoji: '🎓',
  },
];

/** AKMAL Logo SVG — matches the leaf/globe design style */
function AkmalLogo({ size = 'lg' }: { size?: 'sm' | 'lg' }) {
  const width = size === 'lg' ? 240 : 120;
  return (
    <div className="flex flex-col items-center gap-2">
      <img 
        src="/images/logo.png" 
        alt="AKMAL Logo" 
        style={{ width: `${width}px`, height: 'auto' }}
        className="drop-shadow-md"
      />
    </div>
  );
}

export function RoleSelectionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action') || 'login';
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleProceed = () => {
    if (!selectedRole) return;
    navigate(`/auth?role=${selectedRole}&action=${action}`);
  };

  const handleBack = () => {
    window.location.href = '/';
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* ─── LEFT PANEL ─── White with logo */}
      <div style={{
        flex: '0 0 44%',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        padding: '2rem',
      }}>
        {/* BACK button */}
        <div>
          <button
            onClick={handleBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 1.1rem',
              borderRadius: '999px',
              background: '#6FC7CB',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              boxShadow: '0 2px 8px rgba(111,199,203,0.3)',
            }}
          >
            ← KEMBALI
          </button>
        </div>

        {/* Logo centered */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
        }}>
          <AkmalLogo size="lg" />

          <h2 style={{
            fontSize: '1.9rem',
            fontWeight: 800,
            color: '#5FB3B7',
            textAlign: 'center',
            margin: 0,
            lineHeight: 1.2,
          }}>
            Sistem Pengurusan<br />Tahfiz AKMAL
          </h2>
        </div>
      </div>

      {/* ─── RIGHT PANEL ─── Green gradient */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(160deg, #6FC7CB 0%, #5FB3B7 40%, #A8DEE0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}>
        {/* White card */}
        <div style={{
          background: '#fff',
          borderRadius: '24px',
          padding: '2rem 2rem 1.5rem',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}>
          {/* Card Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <h1 style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: '#1a1a1a',
              margin: 0,
              letterSpacing: '0.05em',
            }}>
              {action === 'register' ? 'DAFTAR AKAUN' : 'SELAMAT KEMBALI'}
            </h1>
            <p style={{ color: '#888', fontSize: '0.85rem', margin: '0.3rem 0 0' }}>
              {action === 'register'
                ? 'Sila pilih peranan anda untuk mendaftar'
                : 'Sila log masuk ke akaun anda'}
            </p>
          </div>

          {/* Role Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
            {roles.map((role) => {
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '14px',
                    background: isSelected ? '#D1EEF0' : '#E8F6F7',
                    border: isSelected ? '2px solid #6FC7CB' : '2px solid transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(111,199,203,0.25)' : 'none',
                  }}
                >
                  {/* Radio circle */}
                  <div style={{
                    flexShrink: 0,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? '#6FC7CB' : '#999'}`,
                    background: isSelected ? '#6FC7CB' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {isSelected && (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />
                    )}
                  </div>

                  {/* Emoji */}
                  <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{role.emoji}</span>

                  {/* Text */}
                  <div>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: '#1a1a1a',
                    }}>
                      {role.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '1px' }}>
                      {role.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #e8e8e8', margin: '0 -2rem 1rem' }} />

          {/* LOGIN Button */}
          <button
            onClick={handleProceed}
            disabled={!selectedRole}
            style={{
              width: '100%',
              padding: '0.9rem',
              borderRadius: '12px',
              background: selectedRole ? '#1a1a1a' : '#ccc',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1rem',
              letterSpacing: '0.12em',
              border: 'none',
              cursor: selectedRole ? 'pointer' : 'not-allowed',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => { if (selectedRole) (e.currentTarget as HTMLButtonElement).style.background = '#333'; }}
            onMouseLeave={(e) => { if (selectedRole) (e.currentTarget as HTMLButtonElement).style.background = '#1a1a1a'; }}
          >
            {action === 'register' ? 'DAFTAR' : 'LOG MASUK'}
          </button>

          {/* Forgot Password */}
          <div style={{ textAlign: 'center', marginTop: '0.9rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#777' }}>Lupa Kata Laluan? </span>
            <button
              onClick={() => navigate('/auth?action=forgot')}
              style={{
                background: 'none',
                border: 'none',
                color: '#6FC7CB',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Klik di sini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
