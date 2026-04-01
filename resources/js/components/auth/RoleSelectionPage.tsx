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
  const textSize = size === 'lg' ? '1' : '0.65';
  const svgSize = size === 'lg' ? 180 : 100;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size === 'lg' ? '0.5rem' : '0.2rem' }}>
      {/* Logo mark */}
      <svg width={svgSize} height={svgSize * 0.65} viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Globe circle */}
        <circle cx="70" cy="65" r="42" fill="none" stroke="#1a8080" strokeWidth="3" opacity="0.8"/>
        <ellipse cx="70" cy="65" rx="20" ry="42" fill="none" stroke="#1a8080" strokeWidth="2" opacity="0.6"/>
        <line x1="28" y1="65" x2="112" y2="65" stroke="#1a8080" strokeWidth="2" opacity="0.6"/>
        <line x1="35" y1="44" x2="105" y2="44" stroke="#1a8080" strokeWidth="1.5" opacity="0.4"/>
        <line x1="35" y1="86" x2="105" y2="86" stroke="#1a8080" strokeWidth="1.5" opacity="0.4"/>
        {/* Feather/leaf coming from globe */}
        <path
          d="M85 30 C110 10, 170 20, 175 55 C165 35, 130 30, 108 50 C120 38, 145 40, 150 62 C140 48, 118 48, 105 62 C113 55, 128 58, 130 70 C118 62, 108 65, 105 75 L95 90 L90 65 Z"
          fill="url(#featherGrad)"
        />
        {/* Orange accent stroke on feather */}
        <path
          d="M95 90 L105 30"
          stroke="#e07030"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.9"
        />
        <defs>
          <linearGradient id="featherGrad" x1="95" y1="90" x2="175" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1a8080"/>
            <stop offset="50%" stopColor="#2da89a"/>
            <stop offset="100%" stopColor="#4ece8e"/>
          </linearGradient>
        </defs>
      </svg>

      {/* Text */}
      <div style={{ textAlign: 'center', lineHeight: 1.1 }}>
        <div style={{
          fontSize: `${parseFloat(textSize) * 2.2}rem`,
          fontWeight: 900,
          color: '#1a8080',
          letterSpacing: '0.08em',
          fontFamily: 'Georgia, serif',
        }}>
          AKMAL
        </div>
        <div style={{
          fontSize: `${parseFloat(textSize) * 0.65}rem`,
          fontWeight: 600,
          color: '#2da89a',
          letterSpacing: '0.15em',
        }}>
          AKADEMI AL-QURAN
        </div>
        <div style={{
          fontSize: `${parseFloat(textSize) * 0.65}rem`,
          fontWeight: 600,
          color: '#2da89a',
          letterSpacing: '0.15em',
        }}>
          AMALILLAH
        </div>
      </div>
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
              background: '#2da89a',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              boxShadow: '0 2px 8px rgba(45,168,154,0.3)',
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
            color: '#1a8080',
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
        background: 'linear-gradient(160deg, #5bbf6e 0%, #3da862 40%, #8dd87a 100%)',
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
                    background: isSelected ? '#b8ddd8' : '#c8dede',
                    border: isSelected ? '2px solid #2da89a' : '2px solid transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(45,168,154,0.25)' : 'none',
                  }}
                >
                  {/* Radio circle */}
                  <div style={{
                    flexShrink: 0,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? '#2da89a' : '#999'}`,
                    background: isSelected ? '#2da89a' : '#fff',
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
                color: '#2da89a',
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
