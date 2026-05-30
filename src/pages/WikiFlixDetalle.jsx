import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Play, Download, ExternalLink, Film } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import FavButton from '../components/FavButton';
import { SkeletonDetail, ErrorMessage } from '../components/Feedback';
import { fetchArchiveItem, archivePage } from '../hooks/useArchive';

const WikiFlixDetalle = () => {
  const { id } = useParams();
  const [item, setItem]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [reproduciendo, setRep]     = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchArchiveItem(id)
      .then(setItem)
      .catch(() => setError('No se pudo cargar la película.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <SkeletonDetail />;
  if (error)   return <div style={{ padding: 24 }}><ErrorMessage mensaje={error} /></div>;
  if (!item)   return null;

  const img = item.posterUrl || item.thumbUrl;

  return (
    <div>
      {/* Backdrop con thumb */}
      <div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
        {img && <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2, filter: 'blur(4px)', transform: 'scale(1.05)' }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, #0a0a0f 0%, rgba(10,10,15,0.5) 100%)' }} />
      </div>

      <div style={{ padding: '0 24px 40px', marginTop: -100, position: 'relative' }}>
        <Link to="/wikiflix" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#9898b0', textDecoration: 'none', fontSize: 13, marginBottom: 24 }}
          onMouseEnter={e => e.currentTarget.style.color = '#f0f0f5'}
          onMouseLeave={e => e.currentTarget.style.color = '#9898b0'}
        ><ArrowLeft size={14} /> Volver a WikiFlix</Link>

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', marginBottom: 32 }}>
          {/* Poster */}
          <div style={{ flexShrink: 0 }}>
            {img
              ? <img src={img} alt={item.title} style={{ width: 180, height: 270, objectFit: 'cover', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }} />
              : <div style={{ width: 180, height: 270, borderRadius: 12, background: '#1a1a26', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Film size={48} color="#5a5a75" />
                </div>
            }
            {/* Badge gratis */}
            <div style={{ marginTop: 10, background: 'rgba(255,209,102,0.12)', border: '1px solid rgba(255,209,102,0.3)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
              <p style={{ color: '#ffd166', fontSize: 12, fontWeight: 700 }}>DOMINIO PÚBLICO</p>
              <p style={{ color: '#5a5a75', fontSize: 10, marginTop: 2 }}>Gratis · Sin registro</p>
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 260, paddingTop: 60 }}>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, letterSpacing: 1, lineHeight: 1, marginBottom: 12, color: '#fff' }}>
              {item.title}
            </h1>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
              {item.year && item.year !== '?' && (
                <span style={{ color: '#9898b0', fontSize: 13 }}>{item.year}</span>
              )}
              {item.rating > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#ffd166', fontSize: 13, fontWeight: 600 }}>
                  <Star size={12} fill="#ffd166" strokeWidth={0} /> {item.rating}
                </span>
              )}
              {item.genre && (
                <span style={{ background: 'rgba(255,255,255,0.08)', color: '#9898b0', fontSize: 12, padding: '3px 10px', borderRadius: 10 }}>
                  {item.genre}
                </span>
              )}
              {item.downloads > 0 && (
                <span style={{ color: '#5a5a75', fontSize: 12 }}>
                  {item.downloads.toLocaleString()} descargas
                </span>
              )}
            </div>

            <p style={{ color: '#9898b0', fontSize: 14, lineHeight: 1.7, maxWidth: 520, marginBottom: 24 }}>
              {typeof item.desc === 'string'
                ? item.desc.replace(/<[^>]*>/g, '').slice(0, 400) + (item.desc.length > 400 ? '...' : '')
                : 'Película clásica de dominio público disponible gratuitamente en Archive.org.'
              }
            </p>

            {/* Subjects / tags */}
            {item.subjects?.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
                {item.subjects.slice(0, 6).map((s, i) => (
                  <span key={i} style={{ background: 'rgba(255,255,255,0.05)', color: '#5a5a75', fontSize: 11, padding: '2px 8px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                    {s}
                  </span>
                ))}
              </div>
            )}

            {/* Botones */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={() => setRep(v => !v)} style={{
                background: '#e63946', color: '#fff', border: 'none',
                padding: '11px 24px', borderRadius: 8,
                fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all .2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#ff6b6b'}
                onMouseLeave={e => e.currentTarget.style.background = '#e63946'}
              >
                <Play size={14} fill="#fff" strokeWidth={0} />
                {reproduciendo ? 'Cerrar player' : 'Ver ahora'}
              </button>

              <FavButton item={item} tipo="wikiflix" />

              <a href={archivePage(item._id)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'rgba(255,255,255,0.06)', color: '#9898b0',
                  border: '1px solid rgba(255,255,255,0.12)',
                  padding: '11px 18px', borderRadius: 8,
                  fontFamily: "'Outfit', sans-serif", fontSize: 13,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, transition: 'all .2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#f0f0f5'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#9898b0'; }}
                >
                  <ExternalLink size={13} /> Ver en Archive.org
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* Player */}
        {reproduciendo && (
          <div style={{ marginBottom: 32 }}>
            <VideoPlayer titulo={item.title} url={item.streamUrl} />
            <p style={{ fontSize: 12, color: '#5a5a75', marginTop: 10, textAlign: 'center' }}>
              Stream vía Archive.org · Dominio público · Reproducción gratuita y legal
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WikiFlixDetalle;
