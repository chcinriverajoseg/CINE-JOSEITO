import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, ImageOff } from 'lucide-react';
import { useFavoritos } from '../context/FavoritosContext';
import { Heart } from 'lucide-react';

const WikiCard = ({ item }) => {
  const { esFavorito, toggleFavorito } = useFavoritos();
  const [imgError, setImgError] = useState(false);
  const fav = esFavorito(item._id);

  return (
    <div style={{ position: 'relative', flex: '0 0 140px' }}>
      <Link to={`/wikiflix/${item._id}`} style={{ display: 'block', borderRadius: 10, overflow: 'hidden', background: '#1a1a26', textDecoration: 'none', transition: 'transform .2s' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {/* Thumbnail */}
        <div style={{ width: 140, height: 200, background: 'linear-gradient(135deg,#1a1a26,#252535)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!imgError
            ? <img
                src={item.thumbUrl}
                alt={item.title}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => setImgError(true)}
              />
            : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 36 }}>🎬</span>
                <ImageOff size={14} color="#5a5a75" />
              </div>
          }
          {/* Overlay badge WikiFlix */}
          <div style={{ position: 'absolute', top: 8, left: 8, background: 'linear-gradient(90deg,#6c3483,#1a5276)', color: '#fff', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 5, letterSpacing: '.5px' }}>
            GRATIS
          </div>
        </div>

        <div style={{ padding: '8px 10px 10px' }}>
          <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#f0f0f5' }}>{item.title}</div>
          <div style={{ fontSize: 11, color: '#5a5a75', marginTop: 2 }}>
            {item.year}{item.genre ? ` • ${item.genre}` : ''}
          </div>
        </div>
      </Link>

      {/* Fav */}
      <button onClick={() => toggleFavorito({ ...item, url: '' }, 'wikiflix')}
        style={{ position: 'absolute', bottom: 38, right: 6, background: fav ? 'rgba(108,52,131,0.9)' : 'rgba(0,0,0,0.65)', border: fav ? '1px solid #9b59b6' : '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s', backdropFilter: 'blur(4px)' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Heart size={12} fill={fav ? '#fff' : 'none'} color={fav ? '#fff' : '#9898b0'} strokeWidth={2} />
      </button>
    </div>
  );
};

export default WikiCard;
