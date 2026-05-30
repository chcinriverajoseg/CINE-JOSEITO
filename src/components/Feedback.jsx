import React from 'react';

/* ── Spinner ─────────────────────────────────────────────────────── */
export const LoadingSpinner = ({ mensaje = 'Cargando...' }) => (
  <div style={{ padding: '60px 20px', textAlign: 'center', color: '#5a5a75' }}>
    <div style={{
      width: 36, height: 36, margin: '0 auto 16px',
      border: '3px solid #252535', borderTop: '3px solid #e63946',
      borderRadius: '50%', animation: 'spin .7s linear infinite',
    }} />
    <p style={{ fontSize: 14 }}>{mensaje}</p>
  </div>
);

/* ── Error ───────────────────────────────────────────────────────── */
export const ErrorMessage = ({ mensaje = 'Error al cargar el contenido.', onRetry }) => (
  <div style={{ padding: '60px 20px', textAlign: 'center', color: '#9898b0' }}>
    <p style={{ fontSize: 36, marginBottom: 12 }}>⚠️</p>
    <p style={{ fontSize: 14, marginBottom: 16 }}>{mensaje}</p>
    {onRetry && (
      <button onClick={onRetry} style={{
        background: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.4)',
        color: '#ff6b6b', fontFamily: "'Outfit', sans-serif", fontSize: 13,
        padding: '8px 20px', borderRadius: 8, cursor: 'pointer',
      }}>Reintentar</button>
    )}
  </div>
);

/* ── Skeleton card (140x200 poster) ─────────────────────────────── */
export const SkeletonCard = () => (
  <div style={{ flex: '0 0 140px', borderRadius: 10, overflow: 'hidden', background: '#1a1a26' }}>
    <div className="skeleton" style={{ width: 140, height: 200 }} />
    <div style={{ padding: '8px 10px 10px' }}>
      <div className="skeleton" style={{ height: 11, width: '85%', marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 9,  width: '55%' }} />
    </div>
  </div>
);

/* ── Skeleton row (7 cards) ──────────────────────────────────────── */
export const SkeletonRow = ({ count = 7 }) => (
  <div style={{ display: 'flex', gap: 12, overflow: 'hidden', paddingBottom: 8 }}>
    {Array.from({ length: count }, (_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

/* ── Skeleton grid ───────────────────────────────────────────────── */
export const SkeletonGrid = ({ count = 12 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 14 }}>
    {Array.from({ length: count }, (_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

/* ── Skeleton hero ───────────────────────────────────────────────── */
export const SkeletonHero = () => (
  <div style={{ height: 380, background: '#111118', position: 'relative', overflow: 'hidden', marginBottom: 32 }}>
    <div className="skeleton" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />
    <div style={{ position: 'absolute', bottom: 40, left: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="skeleton" style={{ height: 14, width: 120, borderRadius: 20 }} />
      <div className="skeleton" style={{ height: 52, width: 320 }} />
      <div className="skeleton" style={{ height: 12, width: 200 }} />
      <div className="skeleton" style={{ height: 12, width: 340 }} />
      <div className="skeleton" style={{ height: 12, width: 280 }} />
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <div className="skeleton" style={{ height: 40, width: 130, borderRadius: 8 }} />
        <div className="skeleton" style={{ height: 40, width: 100, borderRadius: 8 }} />
      </div>
    </div>
  </div>
);

/* ── Skeleton detail page ────────────────────────────────────────── */
export const SkeletonDetail = () => (
  <div style={{ padding: 24 }}>
    <div className="skeleton" style={{ height: 300, borderRadius: 0, marginBottom: 0, marginLeft: -24, marginRight: -24, width: 'calc(100% + 48px)' }} />
    <div style={{ display: 'flex', gap: 28, marginTop: -80, paddingTop: 0 }}>
      <div className="skeleton" style={{ width: 180, height: 270, borderRadius: 12, flexShrink: 0 }} />
      <div style={{ flex: 1, paddingTop: 80, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="skeleton" style={{ height: 44, width: '70%' }} />
        <div className="skeleton" style={{ height: 14, width: 200 }} />
        <div className="skeleton" style={{ height: 12, width: '90%' }} />
        <div className="skeleton" style={{ height: 12, width: '80%' }} />
        <div className="skeleton" style={{ height: 12, width: '60%' }} />
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <div className="skeleton" style={{ height: 42, width: 140, borderRadius: 8 }} />
          <div className="skeleton" style={{ height: 42, width: 170, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  </div>
);
