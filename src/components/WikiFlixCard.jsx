import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Heart, Tv } from 'lucide-react';
import { useFavoritos } from '../context/FavoritosContext';

const WikiFlixCard = ({ item }) => {
  const { esFavorito, toggleFavorito } = useFavoritos();
  const [imgError, setImgError]        = useState(false);
  const fav  = esFavorito(item._id);
  const img  = !imgError ? (item.posterUrl || item.thumbUrl) : null;

  return (
    <div style={{ position: 'relative', flex: '0 0 140px' }}>
      <Link to={`/wikiflix/${item._id}`} style={{ borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'transform .2s', background: '#1a1a26', textDecoration: 'none', display: 'block' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {/* Poster / Thumb */}
        <div style={{ width: 140, height: 200, background: 'linear-gradient(135deg,#1a1a26,#252535)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {img
            ? <img src={img} alt={item.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => setImgError(true)} />
            : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <Tv size={32} color="#5a5a75" />
                <span style={{ fontSize: 10, color: '#5a5a75', textAlign: 'center', padding: '0 8px' }}>Sin imagen</span>
              </div>
          }
          {/* WikiFlix badge */}
          <div style={{ position: 'absolute', bottom: 6, left: 6, background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,209,102,0.4)', color: '#ffd166', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 4, letterSpacing: '.5px', backdropFilter: 'blur(4px)' }}>
            GRATIS
          </div>
        </div>

        {/* Rating */}
        {item.rating > 0 && (
          <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.78)', color: '#ffd166', fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 5, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Star size={8} fill="#ffd166" strokeWidth={0} />{item.rating}
          </div>
        )}

        <div style={{ padding: '8px 10px 10px' }}>
          <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#f0f0f5' }}>{item.title}</div>
          <div style={{ fontSize: 11, color: '#5a5a75', marginTop: 2 }}>
            {item.year}{item.genre ? ` • ${item.genre}` : ''}
          </div>
        </div>
      </Link>

      {/* Fav */}
      <button onClick={() => toggleFavorito({ ...item }, 'wikiflix')}
        style={{ position: 'absolute', bottom: 38, right: 6, background: fav ? 'rgba(230,57,70,0.9)' : 'rgba(0,0,0,0.65)', border: fav ? '1px solid #e63946' : '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s', backdropFilter: 'blur(4px)' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Heart size={12} fill={fav ? '#fff' : 'none'} color={fav ? '#fff' : '#9898b0'} strokeWidth={2} />
      </button>
    </div>
  );
};

export default WikiFlixCard;
