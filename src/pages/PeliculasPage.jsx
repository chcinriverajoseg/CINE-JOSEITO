import React, { useEffect, useState, useCallback } from "react";
import MovieCard from "../components/MovieCard";
import { SkeletonGrid, ErrorMessage } from "../components/Feedback";
import { tmdb, normalizeMovie, GENEROS_PELICULAS } from "../hooks/useTMDB";

const ORDENAR = [
  { value: "popularity.desc",   label: "Más populares" },
  { value: "vote_average.desc", label: "Mejor valoradas" },
  { value: "release_date.desc", label: "Más recientes" },
  { value: "release_date.asc",  label: "Más antiguas" },
  { value: "revenue.desc",      label: "Mayor taquilla" },
];

const DECADAS = [
  { value: "", label: "Todos los años" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  { value: "2021", label: "2021" },
  { value: "2020", label: "2020" },
  { value: "2019", label: "2019" },
  { value: "2018", label: "2018" },
  { value: "2015", label: "2015" },
  { value: "2010", label: "2010" },
  { value: "2000", label: "2000" },
  { value: "1990", label: "1990" },
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
      border: "1px solid rgba(255,255,255,0.1)", color: value ? "#f0f0f5" : "#5a5a75",
      fontFamily: "'Outfit', sans-serif", fontSize: 12,
      padding: "7px 28px 7px 12px", borderRadius: 8, cursor: "pointer", outline: "none",
    }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: "#5a5a75", pointerEvents: "none", fontSize: 10 }}>▼</span>
  </div>
);

const PeliculasPage = () => {
  const [peliculas,  setPelis]   = useState([]);
  const [loading,    setLoading] = useState(true);
  const [loadingMore,setLoadMore]= useState(false);
  const [error,      setError]   = useState(null);
  const [page,       setPage]    = useState(1);
  const [totalPages, setTotal]   = useState(1);
  const [genero,     setGenero]  = useState("");
  const [orden,      setOrden]   = useState("popularity.desc");
  const [year,       setYear]    = useState("");

  const cargar = useCallback((pg, reset = false) => {
    if (pg === 1) { setLoading(true); setError(null); }
    else setLoadMore(true);

    tmdb.discover(pg, genero, orden, year)
      .then(d => {
        const nuevas = d.results.map(normalizeMovie);
        setPelis(prev => reset || pg === 1 ? nuevas : [...prev, ...nuevas]);
        setTotal(Math.min(d.total_pages, 500)); // TMDB limita a 500 páginas
        setPage(pg);
      })
      .catch(() => setError("No se pudo cargar el contenido."))
      .finally(() => { setLoading(false); setLoadMore(false); });
  }, [genero, orden, year]);

  // Reset cuando cambian los filtros
  useEffect(() => {
    setPelis([]);
    setPage(1);
    cargar(1, true);
  }, [genero, orden, year]);

  const totalResultados = totalPages * 20;

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 1.5, color: "#f0f0f5" }}>
          CATÁLOGO <span style={{ color: "#e63946" }}>PELÍCULAS</span>
        </h1>
        {!loading && (
          <span style={{ fontSize: 12, color: "#5a5a75" }}>
            ~{totalResultados.toLocaleString()} títulos
          </span>
        )}
      </div>

      {/* Géneros */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
        {GENEROS_PELICULAS.map(g => (
          <Chip key={g.id} label={g.nombre} active={genero === g.id} onClick={() => setGenero(g.id)} />
        ))}
      </div>

      {/* Ordenar + Año */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24, alignItems: "center" }}>
        <Select value={orden} onChange={setOrden} options={ORDENAR} />
        <Select value={year}  onChange={setYear}  options={DECADAS} />
        {(genero || orden !== "popularity.desc" || year) && (
          <button onClick={() => { setGenero(""); setOrden("popularity.desc"); setYear(""); }}
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
            {peliculas.map((p, i) => (
              <div key={p._id} style={{ animation: "fadeIn 0.3s ease both", animationDelay: `${Math.min(i, 19) * 0.03}s` }}>
                <MovieCard item={p} tipo="pelicula" />
              </div>
            ))}
          </div>

          {/* Cargar más */}
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

export default PeliculasPage;
