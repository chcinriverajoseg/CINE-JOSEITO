import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Clock, User, ExternalLink } from 'lucide-react';
import { archive, normalizeArchive, archiveThumb } from '../hooks/useArchive';
import { tmdb, posterUrl } from '../hooks/useTMDB';
import FavButton from '../components/FavButton';
import { SkeletonDetail } from '../components/Feedback';
import VideoPlayer from '../components/VideoPlayer';

const DetallesWikiflix = () => {
  const { id } = useParams();
  const [item,     setItem]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [playing,  setPlaying]  = useState(false);
  const [tmdbData, setTmdbData] = useState(null);

  useEffect(() => {
    setLoading(true);
    archive.detail(id)
      .then(async (meta) => {
        const norm = normalizeArchive(meta.metadata || meta);
        norm.streamUrl = meta.streamUrl;
        norm.videoFile = meta.videoFile;
        setItem(norm);

        // Buscar en TMDB para obtener poster y más info
        try {
          const search = await tmdb.search(norm.title);
          const match = search.results?.[0];
          if (match) setTmdbData(match);
        } catch { /* sin TMDB, no pasa nada */ }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <SkeletonDetail />;
  if (error || !item) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#9898b0' }}>
      <p style={{ fontSize: 36, marginBottom: 12 }}>⚠️</p>
      <p style={{ marginBottom: 16 }}>No se pudo cargar la película.</p>
      <Link to="/wikiflix" style={{ color: '#9b59b6', textDecoration: 'none' }}>← Volver a WikiFlix</Link>
    </div>
  );

  const poster = tmdbData?.poster_path ? posterUrl(tmdbData.poster_path, 'w500') : null;
  const backdrop = tmdbData?.backdrop_path ? `https://image.tmdb.org/t/p/w1280${tmdbData.backdrop_path}` : null;
  const thumb = archiveThumb(id);

  return (
    <div>
      {/* Backdrop */}
      <div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
        <img src={backdrop || thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} onError={e => e.target.style.display = 'none'} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,#0a0a0f 0%,rgba(10,10,15,0.3) 100%)' }} />
        {/* WikiFlix badge */}
        <div style={{ position: 'absolute', top: 20, right: 20, background: 'linear-gradient(90deg,#6c3483,#1a5276)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: '.5px' }}>
          WIKIFLIX · DOMINIO PÚBLICO
        </div>
      </div>

      <div style={{ padding: '0 24px 40px', marginTop: -100, position: 'relative' }}>
        <Link to="/wikiflix" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#9898b0', textDecoration: 'none', fontSize: 13, marginBottom: 24 }}
          onMouseEnter={e => e.currentTarget.style.color = '#f0f0f5'}
          onMouseLeave={e => e.currentTarget.style.color = '#9898b0'}
        ><ArrowLeft size={14} /> Volver a WikiFlix</Link>

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', marginBottom: 32 }}>
          {/* Poster */}
          <div style={{ flexShrink: 0 }}>
            <img
              src={poster || thumb}
              alt={item.title}
              style={{ width: 180, height: 270, objectFit: 'cover', borderRadius: 12, border: '1px solid rgba(155,89,182,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
              onError={e => { e.target.src = thumb; }}
            />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 260, paddingTop: 60 }}>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, letterSpacing: 1, lineHeight: 1, marginBottom: 12, color: '#fff' }}>
              {item.title}
            </h1>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
              {item.year && <span style={{ color: '#9898b0', fontSize: 13 }}>{item.year}</span>}
              {item.genre && <span style={{ background: 'rgba(108,52,131,0.2)', border: '1px solid rgba(155,89,182,0.3)', color: '#c39bd3', fontSize: 12, padding: '3px 10px', borderRadius: 10 }}>{item.genre}</span>}
              {item.runtime && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#9898b0', fontSize: 13 }}>
                  <Clock size={12} /> {item.runtime}
                </span>
              )}
              <span style={{ background: 'rgba(39,174,96,0.15)', border: '1px solid rgba(39,174,96,0.3)', color: '#82e0aa', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 10 }}>
                ✓ Gratis · Legal
              </span>
            </div>

            {item.creator && (
              <p style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#5a5a75', fontSize: 13, marginBottom: 14 }}>
                <User size={13} /> {item.creator}
              </p>
            )}

            <p style={{ color: '#9898b0', fontSize: 14, lineHeight: 1.7, maxWidth: 520, marginBottom: 24 }}>
              {item.desc}
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              {item.streamUrl ? (
                <button onClick={() => setPlaying(v => !v)} style={{ background: 'linear-gradient(90deg,#6c3483,#1a5276)', color: '#fff', border: 'none', padding: '11px 24px', borderRadius: 8, fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'opacity .2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <Play size={14} fill="#fff" strokeWidth={0} />
                  {playing ? 'Cerrar player' : 'Ver ahora · Gratis'}
                </button>
              ) : (
                <a href={`https://archive.org/details/${id}`} target="_blank" rel="noreferrer" style={{ background: 'linear-gradient(90deg,#6c3483,#1a5276)', color: '#fff', textDecoration: 'none', padding: '11px 24px', borderRadius: 8, fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ExternalLink size={14} /> Ver en Archive.org
                </a>
              )}
              <FavButton item={{ ...item, url: item.streamUrl || '' }} tipo="wikiflix" />
            </div>
          </div>
        </div>

        {/* Player */}
        {playing && item.streamUrl && (
          <div style={{ marginBottom: 32 }}>
            <VideoPlayer titulo={item.title} url={item.streamUrl} />
          </div>
        )}

        {/* Link a Archive.org */}
        <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#f0f0f5', marginBottom: 3 }}>Disponible en Archive.org</p>
            <p style={{ fontSize: 12, color: '#5a5a75' }}>Descarga gratuita, múltiples formatos, dominio público.</p>
          </div>
          <a href={`https://archive.org/details/${id}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9b59b6', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
            <ExternalLink size={14} /> Abrir
          </a>
        </div>
      </div>
    </div>
  );
};

export default DetallesWikiflix;
