import React, { useEffect, useState, useCallback } from "react";
import MovieCard from "../components/MovieCard";
import { SkeletonGrid, ErrorMessage } from "../components/Feedback";
import { tmdb, normalizeSerie, GENEROS_SERIES } from "../hooks/useTMDB";

const ORDENAR = [
  { value: "popularity.desc",   label: "Más populares" },
  { value: "vote_average.desc", label: "Mejor valoradas" },
  { value: "first_air_date.desc", label: "Más recientes" },
  { value: "first_air_date.asc",  label: "Más antiguas" },
];

const Chip = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    background: active ? "rgba(230,57,70,0.15)" : "#1a1a26",
    border: `1px solid ${active ? "rgba(230,57,70,0.4)" : "rgba(255,255,255,0.08)"}`,
    color: active ? "#ff6b6b" : "#9898b0",
    fontFamily: "'Outfit', sans-serif", fontSize: 12,
    padding: "6px 14px", borderRadius: 20, cursor: "pointer",
    transition: "all .2s", whiteSpace: "nowrap",
  }}>{label}</button>
);

const Select = ({ value, onChange, options }) => (
  <div style={{ position: "relative" }}>
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      appearance: "none", background: "#1a1a26",
      border: "1px solid rgba(255,255,255,0.1)", color: "#f0f0f5",
      fontFamily: "'Outfit', sans-serif", fontSize: 12,
      padding: "7px 28px 7px 12px", borderRadius: 8, cursor: "pointer", outline: "none",
    }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: "#5a5a75", pointerEvents: "none", fontSize: 10 }}>▼</span>
  </div>
);

const SeriesPage = () => {
  const [series,     setSeries]  = useState([]);
  const [loading,    setLoading] = useState(true);
  const [loadingMore,setLoadMore]= useState(false);
  const [error,      setError]   = useState(null);
  const [page,       setPage]    = useState(1);
  const [totalPages, setTotal]   = useState(1);
  const [genero,     setGenero]  = useState("");
  const [orden,      setOrden]   = useState("popularity.desc");

  const cargar = useCallback((pg, reset = false) => {
    if (pg === 1) { setLoading(true); setError(null); }
    else setLoadMore(true);

    tmdb.discoverTV(pg, genero, orden)
      .then(d => {
        const nuevas = d.results.map(normalizeSerie);
        setSeries(prev => reset || pg === 1 ? nuevas : [...prev, ...nuevas]);
        setTotal(Math.min(d.total_pages, 500));
        setPage(pg);
      })
      .catch(() => setError("No se pudo cargar el contenido."))
      .finally(() => { setLoading(false); setLoadMore(false); });
  }, [genero, orden]);

  useEffect(() => {
    setSeries([]);
    setPage(1);
    cargar(1, true);
  }, [genero, orden]);

  const totalResultados = totalPages * 20;

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 1.5, color: "#f0f0f5" }}>
          CATÁLOGO <span style={{ color: "#e63946" }}>SERIES</span>
        </h1>
        {!loading && (
          <span style={{ fontSize: 12, color: "#5a5a75" }}>~{totalResultados.toLocaleString()} títulos</span>
        )}
      </div>

      {/* Géneros */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14, scrollbarWidth: "none", paddingBottom: 4 }}>
        {GENEROS_SERIES.map(g => (
          <Chip key={g.id} label={g.nombre} active={genero === g.id} onClick={() => setGenero(g.id)} />
        ))}
      </div>

      {/* Ordenar */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24, alignItems: "center" }}>
        <Select value={orden} onChange={setOrden} options={ORDENAR} />
        {(genero || orden !== "popularity.desc") && (
          <button onClick={() => { setGenero(""); setOrden("popularity.desc"); }}
            style={{ background: "none", border: "none", color: "#5a5a75", fontFamily: "'Outfit', sans-serif", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
            Limpiar filtros
          </button>
        )}
      </div>

      {loading && <SkeletonGrid count={20} />}
      {error   && <ErrorMessage mensaje={error} onRetry={() => cargar(1, true)} />}

      {!loading && !error && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 14 }}>
            {series.map((s, i) => (
              <div key={s._id} style={{ animation: "fadeIn 0.3s ease both", animationDelay: `${Math.min(i, 19) * 0.03}s` }}>
                <MovieCard item={s} tipo="serie" />
              </div>
            ))}
          </div>

          {page < totalPages && (
            <div style={{ textAlign: "center", marginTop: 32 }}>
              {loadingMore
                ? <div style={{ display: "inline-block", width: 28, height: 28, border: "3px solid #252535", borderTop: "3px solid #e63946", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                : (
                  <button onClick={() => cargar(page + 1)} style={{
                    background: "rgba(230,57,70,0.12)", border: "1px solid rgba(230,57,70,0.3)",
                    color: "#ff6b6b", fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600,
                    padding: "11px 32px", borderRadius: 8, cursor: "pointer", transition: "all .2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(230,57,70,0.2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(230,57,70,0.12)"}
                  >
                    Cargar más · Página {page + 1} de {totalPages}
                  </button>
                )
              }
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SeriesPage;
