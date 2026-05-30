import React, { useState } from 'react';
import { X, Radio, ExternalLink } from 'lucide-react';

/**
 * YouTubeLivePlayer
 *
 * Estrategia de embed:
 * 1. Intenta con youtubeVideoId (video/stream específico)
 * 2. Fallback a youtubeChannelId (live_stream del canal)
 * 3. Si ambos fallan, muestra botón para abrir en YouTube
 *
 * YouTube bloquea algunos embeds por política del canal.
 * En ese caso mostramos un fallback con link directo.
 */
const YouTubeLivePlayer = ({ youtubeVideoId, youtubeChannelId, nombre, onClose }) => {
  const [modo, setModo] = useState('video'); // 'video' | 'channel' | 'fallback'

  if (!youtubeVideoId && !youtubeChannelId) return null;

  const srcVideo   = youtubeVideoId   ? `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0` : null;
  const srcChannel = youtubeChannelId ? `https://www.youtube.com/embed/live_stream?channel=${youtubeChannelId}&autoplay=1&rel=0` : null;

  const src = modo === 'video' ? srcVideo : modo === 'channel' ? srcChannel : null;

  const urlYT = youtubeVideoId
    ? `https://www.youtube.com/watch?v=${youtubeVideoId}`
    : `https://www.youtube.com/channel/${youtubeChannelId}/live`;

  return (
    <div style={{
      borderRadius: 12, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.1)',
      background: '#000', marginTop: 24,
      animation: 'fadeInUp 0.3s ease',
      boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', background: '#111',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexWrap: 'wrap', gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e63946', boxShadow: '0 0 6px #e63946' }} />
          <span style={{ fontSize: 13, color: '#f0f0f5', fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>
            {nombre || 'Canal en vivo'}
          </span>
          <span style={{ background: '#e63946', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>EN VIVO</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Cambiar modo si el embed no carga */}
          {srcVideo && (
            <button onClick={() => setModo('video')} style={{ background: modo === 'video' ? 'rgba(230,57,70,0.2)' : 'rgba(255,255,255,0.06)', border: `1px solid ${modo === 'video' ? 'rgba(230,57,70,0.4)' : 'rgba(255,255,255,0.1)'}`, color: modo === 'video' ? '#ff6b6b' : '#9898b0', fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 5, cursor: 'pointer' }}>
              Stream
            </button>
          )}
          {srcChannel && (
            <button onClick={() => setModo('channel')} style={{ background: modo === 'channel' ? 'rgba(230,57,70,0.2)' : 'rgba(255,255,255,0.06)', border: `1px solid ${modo === 'channel' ? 'rgba(230,57,70,0.4)' : 'rgba(255,255,255,0.1)'}`, color: modo === 'channel' ? '#ff6b6b' : '#9898b0', fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 5, cursor: 'pointer' }}>
              Canal
            </button>
          )}
          <a href={urlYT} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#9898b0', fontSize: 10, padding: '3px 8px', borderRadius: 5, textDecoration: 'none', fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>
            <ExternalLink size={10} /> YouTube
          </a>
          {onClose && (
            <button onClick={onClose} style={{ background: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.3)', color: '#ff6b6b', borderRadius: 5, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* iframe */}
      {src ? (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            key={src}
            src={src}
            allowFullScreen
            allow="autoplay; fullscreen; encrypted-media"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            title={nombre || 'YouTube Live'}
          />
        </div>
      ) : (
        /* Fallback si YouTube bloquea el embed */
        <div style={{ padding: '40px 20px', textAlign: 'center', background: '#0a0a0f' }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>📺</p>
          <p style={{ fontSize: 14, color: '#9898b0', marginBottom: 6 }}>Este canal no permite embed externo.</p>
          <p style={{ fontSize: 13, color: '#5a5a75', marginBottom: 20 }}>Puedes verlo directamente en YouTube.</p>
          <a href={urlYT} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#e63946', color: '#fff', textDecoration: 'none', padding: '10px 22px', borderRadius: 8, fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600 }}>
            <ExternalLink size={14} /> Ver en YouTube
          </a>
        </div>
      )}
    </div>
  );
};

export default YouTubeLivePlayer;
