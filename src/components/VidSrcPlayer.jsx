import React, { useState } from 'react';
import { X, Maximize2, Globe } from 'lucide-react';

/**
 * VidSrcPlayer — Player multi-proveedor con soporte en español
 *
 * Proveedores ordenados por soporte de audio/subtítulos en español:
 * 1. multiembed  — subtítulos en español incluidos ✅
 * 2. vidapi      — múltiples audios incluyendo español ✅
 * 3. vidsrc.me   — inglés con subtítulos seleccionables
 * 4. vidsrc.xyz  — inglés principalmente
 * 5. vidsrc.to   — fallback
 */
const PROVIDERS = [
  {
    label: 'ES Sub',
    desc:  'Subtítulos español',
    movie: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    tv:    (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
  },
  {
    label: 'Multi Audio',
    desc:  'Varios idiomas',
    movie: (id) => `https://vidapi.xyz/embed/movie/${id}`,
    tv:    (id, s, e) => `https://vidapi.xyz/embed/tv/${id}/${s}/${e}`,
  },
  {
    label: 'VidSrc',
    desc:  'Servidor principal',
    movie: (id) => `https://vidsrc.me/embed/movie?tmdb=${id}`,
    tv:    (id, s, e) => `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    label: 'VidSrc 2',
    desc:  'Servidor alternativo',
    movie: (id) => `https://vidsrc.xyz/embed/movie/${id}`,
    tv:    (id, s, e) => `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}`,
  },
  {
    label: 'VidSrc 3',
    desc:  'Segundo alternativo',
    movie: (id) => `https://vidsrc.to/embed/movie/${id}`,
    tv:    (id, s, e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
  },
];

const VidSrcPlayer = ({ tmdbId, tipo = 'movie', season = 1, episode = 1, titulo, onClose }) => {
  const [provider,    setProvider]    = useState(0);
  const [fullscreen,  setFullscreen]  = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  if (!tmdbId) return null;

  const p   = PROVIDERS[provider];
  const src = tipo === 'tv'
    ? p.tv(tmdbId, season, episode)
    : p.movie(tmdbId);

  return (
    <div style={{
      position:     fullscreen ? 'fixed' : 'relative',
      inset:        fullscreen ? 0 : 'auto',
      zIndex:       fullscreen ? 300 : 1,
      background:   '#000',
      borderRadius: fullscreen ? 0 : 12,
      overflow:     'hidden',
      border:       fullscreen ? 'none' : '1px solid rgba(255,255,255,0.1)',
      boxShadow:    '0 16px 48px rgba(0,0,0,0.6)',
      animation:    'fadeInUp 0.3s ease',
      marginTop:    fullscreen ? 0 : 24,
    }}>
      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', gap: 8, flexWrap: 'wrap',
        background: 'linear-gradient(180deg,rgba(0,0,0,0.95) 0%,rgba(0,0,0,0.7) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Título + indicador */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#e63946', boxShadow: '0 0 6px #e63946', flexShrink: 0 }} />
          {titulo && (
            <span style={{ fontSize: 12, color: '#f0f0f5', fontFamily: "'Outfit', sans-serif", fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {titulo}
            </span>
          )}
        </div>

        {/* Selector de proveedor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
          {/* Hint español */}
          <div style={{ position: 'relative' }}>
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              style={{ background: 'rgba(39,174,96,0.15)', border: '1px solid rgba(39,174,96,0.3)', color: '#82e0aa', borderRadius: 5, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'help' }}
            >
              <Globe size={11} />
            </button>
            {showTooltip && (
              <div style={{ position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)', background: '#1a1a26', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', fontSize: 11, color: '#f0f0f5', whiteSpace: 'nowrap', zIndex: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
                <p style={{ fontWeight: 600, color: '#82e0aa', marginBottom: 4 }}>Consejos de idioma:</p>
                <p>• <strong>ES Sub</strong> — subtítulos en español</p>
                <p>• <strong>Multi Audio</strong> — busca el selector de audio</p>
                <p style={{ marginTop: 4, color: '#5a5a75' }}>Prueba distintos servidores</p>
              </div>
            )}
          </div>

          {PROVIDERS.map((prov, i) => (
            <button key={i} onClick={() => setProvider(i)} title={prov.desc} style={{
              background: provider === i ? 'rgba(230,57,70,0.25)' : 'rgba(255,255,255,0.07)',
              border: `1px solid ${provider === i ? 'rgba(230,57,70,0.5)' : 'rgba(255,255,255,0.1)'}`,
              color: provider === i ? '#ff6b6b' : '#9898b0',
              fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600,
              padding: '3px 8px', borderRadius: 5, cursor: 'pointer', transition: 'all .2s',
              whiteSpace: 'nowrap',
            }}>
              {prov.label}
              {i === 0 && <span style={{ marginLeft: 3, color: '#82e0aa' }}>🇪🇸</span>}
              {i === 1 && <span style={{ marginLeft: 3, color: '#ffd166' }}>🌐</span>}
            </button>
          ))}

          <button onClick={() => setFullscreen(v => !v)} title="Pantalla completa" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#9898b0', borderRadius: 5, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Maximize2 size={11} />
          </button>

          {onClose && (
            <button onClick={onClose} title="Cerrar" style={{ background: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.3)', color: '#ff6b6b', borderRadius: 5, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={11} />
            </button>
          )}
        </div>
      </div>

      {/* ── iframe ──────────────────────────────────────────────── */}
      <div style={{ position: 'relative', paddingBottom: fullscreen ? 0 : '56.25%', height: fullscreen ? 'calc(100vh - 41px)' : 0 }}>
        <iframe
          key={`${provider}-${tmdbId}-${season}-${episode}`}
          src={src}
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          title={titulo || 'Player'}
        />
      </div>

      {/* ── Footer info ──────────────────────────────────────────── */}
      <div style={{ padding: '6px 12px', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, color: '#5a5a75', fontFamily: "'Outfit', sans-serif" }}>
          Servidor: <strong style={{ color: '#9898b0' }}>{p.label}</strong> — {p.desc}
        </span>
        <span style={{ fontSize: 10, color: '#5a5a75' }}>·</span>
        <span style={{ fontSize: 10, color: '#5a5a75', fontFamily: "'Outfit', sans-serif" }}>
          Si no carga, prueba otro servidor ↑
        </span>
      </div>
    </div>
  );
};

export default VidSrcPlayer;
