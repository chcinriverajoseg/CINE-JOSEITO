import React, { useState } from 'react';
import { Search } from 'lucide-react';
import WikiCard from '../components/WikiCard';
import { SkeletonGrid } from '../components/Feedback';
import { useArchiveSearch, normalizeArchive } from '../hooks/useArchive';

const GENEROS = [
  { label: 'Todos',          value: '' },
  { label: 'Comedia',        value: 'comedy' },
  { label: 'Drama',          value: 'drama' },
  { label: 'Terror',         value: 'horror' },
  { label: 'Western',        value: 'western' },
  { label: 'Aventura',       value: 'adventure' },
  { label: 'Misterio',       value: 'mystery' },
  { label: 'Romance',        value: 'romance' },
  { label: 'Animación',      value: 'animation' },
  { label: 'Documental',     value: 'documentary' },
];

const DECADAS = [
  { label: 'Todas las épocas', value: null },
  { label: '1888 – 1899',      value: { from: 1888, to: 1899 } },
  { label: '1900 – 1909',      value: { from: 1900, to: 1909 } },
  { label: '1910 – 1919',      value: { from: 1910, to: 1919 } },
  { label: '1920 – 1929',      value: { from: 1920, to: 1929 } },
];

const FilterBtn = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    background: active ? 'rgba(108,52,131,0.2)' : '#1a1a26',
    border: `1px solid ${active ? 'rgba(155,89,182,0.5)' : 'rgba(255,255,255,0.08)'}`,
    color: active ? '#c39bd3' : '#9898b0',
    fontFamily: "'Outfit', sans-serif", fontSize: 12,
    padding: '6px 14px', borderRadius: 20, cursor: 'pointer', transition: 'all .2s',
  }}>{label}</button>
);

const WikiFlixPage = () => {
  const [genre,  setGenre]  = useState('');
  const [decade, setDecade] = useState(null);
  const [page,   setPage]   = useState(1);
  const [query,  setQuery]  = useState('');
  const [inputVal, setInputVal] = useState('');

  const { data, loading, error } = useArchiveSearch({ genre, decade, page, query });
  const items = (data?.docs || []).map(normalizeArchive);
  const total = data?.numFound || 0;
  const totalPages = Math.ceil(Math.min(total, 10000) / 24);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(inputVal);
    setPage(1);
  };

  const handleGenre = (g) => {
    setGenre(g); setQuery(''); setInputVal(''); setPage(1);
  };

  const handleDecade = (d) => {
    setDecade(d); setPage(1);
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 2, background: 'linear-gradient(90deg,#9b59b6,#3498db)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            WIKIFLIX
          </h1>
          <span style={{ background: 'linear-gradient(90deg,#6c3483,#1a5276)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, letterSpacing: '.5px' }}>
            GRATIS · DOMINIO PÚBLICO
          </span>
        </div>
        <p style={{ color: '#5a5a75', fontSize: 13 }}>
          Miles de películas clásicas de Archive.org — reproducción libre y legal, sin registro.
        </p>
      </div>

      {/* Buscador */}
      <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#5a5a75', pointerEvents: 'none' }} />
        <input
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="Buscar por título..."
          style={{ width: '100%', background: '#1a1a26', border: '1px solid rgba(255,255,255,0.1)', color: '#f0f0f5', fontFamily: "'Outfit', sans-serif", fontSize: 14, padding: '10px 50px 10px 40px', borderRadius: 10, outline: 'none' }}
          onFocus={e => e.target.style.borderColor = 'rgba(155,89,182,0.5)'}
          onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />
        <button type="submit" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'linear-gradient(90deg,#6c3483,#1a5276)', border: 'none', color: '#fff', fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 7, cursor: 'pointer' }}>
          Buscar
        </button>
      </form>

      {/* Filtros género */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {GENEROS.map(g => (
          <FilterBtn key={g.value} label={g.label} active={genre === g.value && !query} onClick={() => handleGenre(g.value)} />
        ))}
      </div>

      {/* Filtros década */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {DECADAS.map((d, i) => (
          <FilterBtn key={i} label={d.label}
            active={JSON.stringify(decade) === JSON.stringify(d.value) && !query}
            onClick={() => handleDecade(d.value)}
          />
        ))}
      </div>

      {/* Resultados */}
      {!loading && !error && total > 0 && (
        <p style={{ fontSize: 12, color: '#5a5a75', marginBottom: 16 }}>
          {total.toLocaleString()} películas encontradas · Página {page} de {totalPages}
        </p>
      )}

      {loading && <SkeletonGrid count={24} />}

      {error && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9898b0' }}>
          <p style={{ fontSize: 36, marginBottom: 12 }}>⚠️</p>
          <p style={{ fontSize: 14 }}>No se pudo conectar con Archive.org. Intenta de nuevo.</p>
          <button onClick={() => setPage(p => p)} style={{ marginTop: 16, background: 'rgba(155,89,182,0.15)', border: '1px solid rgba(155,89,182,0.4)', color: '#c39bd3', fontFamily: "'Outfit', sans-serif", fontSize: 13, padding: '8px 20px', borderRadius: 8, cursor: 'pointer' }}>
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#5a5a75' }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>🎞️</p>
          <p style={{ fontSize: 14 }}>Sin resultados. Prueba otro término o categoría.</p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 14 }}>
          {items.map((item, i) => (
            <div key={item._id} style={{ animation: 'fadeIn 0.3s ease both', animationDelay: `${i * 0.02}s` }}>
              <WikiCard item={item} />
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32, flexWrap: 'wrap' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: page === 1 ? '#1a1a26' : 'rgba(108,52,131,0.2)', border: '1px solid rgba(155,89,182,0.3)', color: page === 1 ? '#5a5a75' : '#c39bd3', fontFamily: "'Outfit', sans-serif", fontSize: 13, padding: '8px 18px', borderRadius: 8, cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
            ← Anterior
          </button>
          {/* Páginas cercanas */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const p = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i));
            return p;
          }).filter((p, i, arr) => arr.indexOf(p) === i && p >= 1 && p <= totalPages).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{ background: page === p ? 'linear-gradient(90deg,#6c3483,#1a5276)' : '#1a1a26', border: '1px solid rgba(155,89,182,0.3)', color: '#f0f0f5', fontFamily: "'Outfit', sans-serif", fontSize: 13, padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: page === p ? 700 : 400 }}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ background: page >= totalPages ? '#1a1a26' : 'rgba(108,52,131,0.2)', border: '1px solid rgba(155,89,182,0.3)', color: page >= totalPages ? '#5a5a75' : '#c39bd3', fontFamily: "'Outfit', sans-serif", fontSize: 13, padding: '8px 18px', borderRadius: 8, cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}>
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

export default WikiFlixPage;
