import React, { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import MovieCard from "../components/MovieCard";
import WikiCard from "../components/WikiCard";
import { SkeletonGrid, LoadingSpinner } from "../components/Feedback";
import { useApi } from "../hooks/useApi";
import { tmdb, normalizeMovie, normalizeSerie } from "../hooks/useTMDB";
import { archive, normalizeArchive } from "../hooks/useArchive";
import { Link } from "react-router-dom";

/* ── Constantes de filtros ─────────────────────────────────────────── */
const TIPOS = [
  { value: "todo",      label: "Todo" },
  { value: "pelicula",  label: "Películas" },
  { value: "serie",     label: "Series" },
  { value: "canal",     label: "Canales IPTV" },
  { value: "wikiflix",  label: "WikiFlix" },
];

const GENEROS_TMDB = [
  { value: "",          label: "Cualquier género" },
  { value: "28",        label: "Acción" },
  { value: "35",        label: "Comedia" },
  { value: "18",        label: "Drama" },
  { value: "27",        label: "Terror" },
  { value: "878",       label: "Ciencia Ficción" },
  { value: "53",        label: "Thriller" },
  { value: "10749",     label: "Romance" },
  { value: "12",        label: "Aventura" },
  { value: "16",        label: "Animación" },
  { value: "80",        label: "Crimen" },
  { value: "99",        label: "Documental" },
  { value: "14",        label: "Fantasía" },
  { value: "36",        label: "Historia" },
  { value: "10752",     label: "Guerra" },
];

const DECADAS = [
  { value: "",          label: "Cualquier año" },
  { value: "2020,2029", label: "2020s" },
  { value: "2010,2019", label: "2010s" },
  { value: "2000,2009", label: "2000s" },
  { value: "1990,1999", label: "1990s" },
  { value: "1980,1989", label: "1980s" },
  { value: "1970,1979", label: "1970s" },
  { value: "1960,1969", label: "1960s" },
];

const ORDEN = [
  { value: "popularity.desc",    label: "Más populares" },
  { value: "vote_average.desc",  label: "Mejor calificadas" },
  { value: "release_date.desc",  label: "Más recientes" },
  { value: "release_date.asc",   label: "Más antiguas" },
];

/* ── Sub-componentes ───────────────────────────────────────────────── */
const Chip = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    background: active ? "rgba(230,57,70,0.15)" : "#1a1a26",
    border: `1px solid ${active ? "rgba(230,57,70,0.4)" : "rgba(255,255,255,0.08)"}`,
    color: active ? "#ff6b6b" : "#9898b0",
    fontFamily: "'Outfit', sans-serif", fontSize: 12,
    padding: "6px 16px", borderRadius: 20, cursor: "pointer", transition: "all .2s",
    whiteSpace: "nowrap",
  }}>{label}</button>
);

const Select = ({ value, onChange, options, style = {} }) => (
  <div style={{ position: "relative", ...style }}>
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      appearance: "none", WebkitAppearance: "none",
      background: "#1a1a26", border: "1px solid rgba(255,255,255,0.1)",
      color: value ? "#f0f0f5" : "#5a5a75",
      fontFamily: "'Outfit', sans-serif", fontSize: 12,
      padding: "7px 32px 7px 12px", borderRadius: 8, cursor: "pointer",
      outline: "none", width: "100%",
    }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <ChevronDown size={13} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", color: "#5a5a75", pointerEvents: "none" }} />
  </div>
);

const CanalCard = ({ canal }) => (
  <Link to={`/canales/${canal._id}`} style={{ textDecoration: "none" }}>
    <div style={{ background: "#1a1a26", borderRadius: 10, padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, border: "1px solid rgba(255,255,255,0.06)", transition: "all .2s" }}
      onMouseEnter={e => { e.currentTarget.style.background = "#252535"; e.currentTarget.style.borderColor = "rgba(230,57,70,0.25)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "#1a1a26"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
    >
      <span style={{ fontSize: 24 }}>{canal.emoji}</span>
      <div>
        <p style={{ fontSize: 13, fontWeight: 500, color: "#f0f0f5" }}>{canal.name}</p>
        <p style={{ fontSize: 11, color: "#5a5a75", marginTop: 2 }}>{canal.categoria}</p>
        {canal.live && <p style={{ fontSize: 10, color: "#e63946", fontWeight: 600, marginTop: 2 }}>EN VIVO</p>}
      </div>
    </div>
  </Link>
);

/* ── Página principal ──────────────────────────────────────────────── */
const BuscarPage = () => {
  // Búsqueda
  const [inputVal, setInputVal] = useState("");
  const [query,    setQuery]    = useState("");
  const timerRef = useRef(null);

  // Filtros
  const [tipo,     setTipo]     = useState("todo");
  const [genero,   setGenero]   = useState("");
  const [decada,   setDecada]   = useState("");
  const [orden,    setOrden]    = useState("popularity.desc");
  const [ratingMin, setRating]  = useState(0);
  const [filtrosOpen, setFiltrosOpen] = useState(false);

  // Resultados
  const [peliculas, setPeliculas] = useState([]);
  const [series,    setSeries]    = useState([]);
  const [wikis,     setWikis]     = useState([]);
  const [loading,   setLoading]   = useState(false);

  const { data: canalesData } = useApi('/canales');

  // Filtros activos
  const filtrosActivos = genero || decada || ratingMin > 0 || orden !== "popularity.desc";
  const resetFiltros = () => { setGenero(""); setDecada(""); setRating(0); setOrden("popularity.desc"); };

  // Canales filtrados localmente
  const q = query.trim().toLowerCase();
  const canales = (canalesData || []).filter(c =>
    (tipo === "todo" || tipo === "canal") &&
    q && (c.name.toLowerCase().includes(q) || c.categoria.toLowerCase().includes(q))
  );

  // Búsqueda principal
  useEffect(() => {
    if (!query.trim()) {
      setPeliculas([]); setSeries([]); setWikis([]);
      return;
    }

    setLoading(true);
    const promises = [];

    // TMDB — películas
    if (tipo === "todo" || tipo === "pelicula" || tipo === "serie") {
      promises.push(
        tmdb.search(query).then(data => {
          let pelis = data.results.filter(r => r.media_type === "movie").map(normalizeMovie);
          let srs   = data.results.filter(r => r.media_type === "tv").map(normalizeSerie);

          // Filtrar por género
          if (genero) {
            pelis = pelis.filter(p => p.genreIds?.includes(Number(genero)));
            srs   = srs.filter(s => s.genreIds?.includes(Number(genero)));
          }
          // Filtrar por rating mínimo
          if (ratingMin > 0) {
            pelis = pelis.filter(p => p.rating >= ratingMin);
            srs   = srs.filter(s => s.rating >= ratingMin);
          }
          // Filtrar por década
          if (decada) {
            const [from, to] = decada.split(",").map(Number);
            pelis = pelis.filter(p => { const y = Number(p.year); return y >= from && y <= to; });
            srs   = srs.filter(s => { const y = Number(s.year); return y >= from && y <= to; });
          }
          // Ordenar
          const sortFn = orden === "vote_average.desc"
            ? (a, b) => b.rating - a.rating
            : orden === "release_date.desc"
            ? (a, b) => b.year - a.year
            : orden === "release_date.asc"
            ? (a, b) => a.year - b.year
            : null;
          if (sortFn) { pelis.sort(sortFn); srs.sort(sortFn); }

          if (tipo !== "serie") setPeliculas(pelis.slice(0, 12));
          if (tipo !== "pelicula") setSeries(srs.slice(0, 12));
        })
      );
    }

    // WikiFlix
    if (tipo === "todo" || tipo === "wikiflix") {
      promises.push(
        archive.searchTitle(query)
          .then(res => setWikis((res.docs || []).slice(0, 8).map(normalizeArchive)))
          .catch(() => setWikis([]))
      );
    } else {
      setWikis([]);
    }

    if (tipo === "pelicula")  { setSeries([]); setWikis([]); }
    if (tipo === "serie")     { setPeliculas([]); setWikis([]); }
    if (tipo === "canal")     { setPeliculas([]); setSeries([]); setWikis([]); }
    if (tipo === "wikiflix")  { setPeliculas([]); setSeries([]); }

    Promise.allSettled(promises).finally(() => setLoading(false));
  }, [query, tipo, genero, decada, ratingMin, orden]);

  const handleInput = (val) => {
    setInputVal(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setQuery(val), 400);
  };

  const total = peliculas.length + series.length + wikis.length + canales.length;
  const sinResultados = query && !loading && total === 0;

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 1.5, marginBottom: 20, color: "#f0f0f5" }}>
        BÚSQUEDA <span style={{ color: "#e63946" }}>AVANZADA</span>
      </h1>

      {/* Input */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#5a5a75", pointerEvents: "none" }} />
        <input
          type="text" value={inputVal} onChange={e => handleInput(e.target.value)}
          placeholder="Buscar en TMDB, WikiFlix, canales..." autoFocus
          style={{ width: "100%", background: "#1a1a26", border: "1px solid rgba(255,255,255,0.1)", color: "#f0f0f5", fontFamily: "'Outfit', sans-serif", fontSize: 14, padding: "13px 48px 13px 46px", borderRadius: 10, outline: "none", transition: "border-color .2s" }}
          onFocus={e => e.target.style.borderColor = "rgba(230,57,70,0.4)"}
          onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
        />
        {inputVal && (
          <button onClick={() => { setInputVal(""); setQuery(""); }} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#5a5a75", cursor: "pointer" }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Tipo tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {TIPOS.map(t => <Chip key={t.value} label={t.label} active={tipo === t.value} onClick={() => setTipo(t.value)} />)}
      </div>

      {/* Filtros avanzados toggle */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setFiltrosOpen(v => !v)} style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: filtrosActivos ? "rgba(230,57,70,0.12)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${filtrosActivos ? "rgba(230,57,70,0.35)" : "rgba(255,255,255,0.08)"}`,
          color: filtrosActivos ? "#ff6b6b" : "#9898b0",
          fontFamily: "'Outfit', sans-serif", fontSize: 12,
          padding: "7px 14px", borderRadius: 8, cursor: "pointer", transition: "all .2s",
        }}>
          <SlidersHorizontal size={13} />
          Filtros avanzados
          {filtrosActivos && <span style={{ background: "#e63946", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {[genero, decada, ratingMin > 0, orden !== "popularity.desc"].filter(Boolean).length}
          </span>}
          <ChevronDown size={12} style={{ transform: filtrosOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
        </button>
        {filtrosActivos && (
          <button onClick={resetFiltros} style={{ marginLeft: 8, background: "none", border: "none", color: "#5a5a75", fontFamily: "'Outfit', sans-serif", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
            Limpiar filtros
          </button>
        )}

        {/* Panel filtros */}
        {filtrosOpen && (
          <div style={{ marginTop: 12, background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, animation: "fadeInUp 0.2s ease" }}>

            <div>
              <label style={{ fontSize: 11, color: "#5a5a75", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".5px" }}>Género</label>
              <Select value={genero} onChange={setGenero} options={GENEROS_TMDB} />
            </div>

            <div>
              <label style={{ fontSize: 11, color: "#5a5a75", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".5px" }}>Década</label>
              <Select value={decada} onChange={setDecada} options={DECADAS} />
            </div>

            <div>
              <label style={{ fontSize: 11, color: "#5a5a75", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".5px" }}>Ordenar por</label>
              <Select value={orden} onChange={setOrden} options={ORDEN} />
            </div>

            <div>
              <label style={{ fontSize: 11, color: "#5a5a75", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".5px" }}>
                Calificación mínima: <span style={{ color: ratingMin > 0 ? "#ffd166" : "#5a5a75" }}>{ratingMin > 0 ? `★ ${ratingMin}+` : "Cualquiera"}</span>
              </label>
              <input type="range" min={0} max={9} step={1} value={ratingMin} onChange={e => setRating(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#e63946", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#5a5a75", marginTop: 2 }}>
                <span>0</span><span>3</span><span>5</span><span>7</span><span>9</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Estado vacío */}
      {!query && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#5a5a75" }}>
          <p style={{ fontSize: 52, marginBottom: 12 }}>🔍</p>
          <p style={{ fontSize: 15, color: "#9898b0", marginBottom: 8 }}>Busca en todo el catálogo</p>
          <p style={{ fontSize: 13 }}>TMDB · WikiFlix · Canales IPTV</p>
        </div>
      )}

      {loading && (
        <div style={{ marginTop: 8 }}>
          <SkeletonGrid count={12} />
        </div>
      )}

      {sinResultados && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#5a5a75" }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>😕</p>
          <p style={{ fontSize: 14, color: "#9898b0" }}>Sin resultados para <strong>"{query}"</strong></p>
          <p style={{ fontSize: 13, marginTop: 8 }}>Prueba con otro término o ajusta los filtros.</p>
        </div>
      )}

      {/* Resultados */}
      {!loading && (
        <>
          {peliculas.length > 0 && (
            <Section titulo="PELÍCULAS" acento="#e63946" count={peliculas.length}>
              <Grid items={peliculas} render={p => <MovieCard key={p._id} item={p} tipo="pelicula" />} />
            </Section>
          )}

          {series.length > 0 && (
            <Section titulo="SERIES" acento="#e63946" count={series.length}>
              <Grid items={series} render={s => <MovieCard key={s._id} item={s} tipo="serie" />} />
            </Section>
          )}

          {wikis.length > 0 && (
            <Section titulo="WIKIFLIX" acento="#9b59b6" count={wikis.length} badge="GRATIS">
              <Grid items={wikis} render={w => <WikiCard key={w._id} item={w} />} />
            </Section>
          )}

          {canales.length > 0 && (
            <Section titulo="CANALES IPTV" acento="#e63946" count={canales.length}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {canales.map(c => <CanalCard key={c._id} canal={c} />)}
              </div>
            </Section>
          )}
        </>
      )}
    </div>
  );
};

/* ── Helpers de layout ─────────────────────────────────────────────── */
const Section = ({ titulo, acento, count, badge, children }) => (
  <div style={{ marginBottom: 36 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 1.5, color: acento }}>
        {titulo}
      </h2>
      <span style={{ color: "#5a5a75", fontSize: 12 }}>({count})</span>
      {badge && <span style={{ background: "linear-gradient(90deg,#6c3483,#1a5276)", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>{badge}</span>}
    </div>
    {children}
  </div>
);

const Grid = ({ items, render }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 14 }}>
    {items.map((item, i) => (
      <div key={item._id} style={{ animation: "fadeIn 0.3s ease both", animationDelay: `${i * 0.03}s` }}>
        {render(item)}
      </div>
    ))}
  </div>
);

export default BuscarPage;
