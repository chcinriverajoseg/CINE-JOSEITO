import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Star, Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "../components/MovieCard";
import WikiCard from "../components/WikiCard";
import { SkeletonRow, SkeletonHero } from "../components/Feedback";
import { useApi } from "../hooks/useApi";
import { tmdb, normalizeMovie, normalizeSerie, backdropUrl, posterUrl } from "../hooks/useTMDB";
import { archive, normalizeArchive } from "../hooks/useArchive";

/* ── Section header ─────────────────────────────────────────────── */
const SectionHeader = ({ accent, title, linkTo, accentColor = "#e63946" }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 3, height: 20, background: accentColor, borderRadius: 2 }} />
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 1.5, color: "#f0f0f5" }}>
        <span style={{ color: accentColor }}>{accent} </span>{title}
      </h2>
    </div>
    <Link to={linkTo} style={{ color: "#5a5a75", fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 4, transition: "color .2s" }}
      onMouseEnter={e => e.currentTarget.style.color = "#9898b0"}
      onMouseLeave={e => e.currentTarget.style.color = "#5a5a75"}
    >Ver todo <ChevronRight size={12} /></Link>
  </div>
);

/* ── Scroll row con botones de navegación ────────────────────────── */
const ScrollRow = ({ items, tipo }) => {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 300, behavior: "smooth" });

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => scroll(-1)} style={{ position: "absolute", left: -12, top: "50%", transform: "translateY(-50%)", zIndex: 10, background: "rgba(10,10,15,0.9)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0f0f5", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(8px)" }} className="hide-mobile">
        <ChevronLeft size={16} />
      </button>
      <div ref={ref} style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none", scrollSnapType: "x mandatory" }}>
        {items.map((item, i) => (
          <div key={item._id} style={{ animation: "fadeIn 0.3s ease both", animationDelay: `${i * 0.04}s`, scrollSnapAlign: "start", flexShrink: 0 }}>
            <MovieCard item={item} tipo={tipo} />
          </div>
        ))}
      </div>
      <button onClick={() => scroll(1)} style={{ position: "absolute", right: -12, top: "50%", transform: "translateY(-50%)", zIndex: 10, background: "rgba(10,10,15,0.9)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0f0f5", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(8px)" }} className="hide-mobile">
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

const WikiRow = ({ items }) => {
  const ref = useRef(null);
  return (
    <div ref={ref} style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none" }}>
      {items.map((item, i) => (
        <div key={item._id} style={{ animation: "fadeIn 0.3s ease both", animationDelay: `${i * 0.04}s`, flexShrink: 0 }}>
          <WikiCard item={item} />
        </div>
      ))}
    </div>
  );
};

/* ── Canal card ──────────────────────────────────────────────────── */
const CanalCard = ({ canal }) => (
  <Link to={`/canales/${canal._id}`} style={{ textDecoration: "none", flexShrink: 0 }}>
    <div style={{ width: 150, background: "#1a1a26", borderRadius: 12, padding: "14px 12px", cursor: "pointer", transition: "all .2s", border: "1px solid transparent", position: "relative" }}
      onMouseEnter={e => { e.currentTarget.style.background = "#252535"; e.currentTarget.style.borderColor = "rgba(230,57,70,0.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "#1a1a26"; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {canal.live && (
        <span style={{ position: "absolute", top: 8, right: 8, background: "#e63946", color: "#fff", fontSize: 7, fontWeight: 700, padding: "2px 5px", borderRadius: 4, letterSpacing: ".5px", display: "flex", alignItems: "center", gap: 2 }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#fff", animation: "pulse 1.5s infinite" }} />EN VIVO
        </span>
      )}
      <div style={{ width: 44, height: 44, borderRadius: 10, background: "#252535", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, fontSize: 22 }}>{canal.emoji}</div>
      <p style={{ fontSize: 13, fontWeight: 600, color: "#f0f0f5", marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{canal.name}</p>
      <p style={{ fontSize: 11, color: "#5a5a75" }}>{canal.categoria}</p>
    </div>
  </Link>
);

/* ── Hero carousel ───────────────────────────────────────────────── */
const Hero = ({ items }) => {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (!items.length) return;
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % Math.min(items.length, 5)); setFade(true); }, 300);
    }, 7000);
    return () => clearInterval(t);
  }, [items.length]);

  if (!items.length) return null;
  const item = items[idx];
  const backdrop = backdropUrl(item.backdropPath);
  const poster   = posterUrl(item.posterPath, "w342");

  return (
    <div style={{ position: "relative", height: "clamp(280px, 55vw, 480px)", overflow: "hidden", marginBottom: 32 }}>
      {/* Backdrop con Ken Burns */}
      {backdrop && (
        <img key={backdrop} src={backdrop} alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: fade ? 0.4 : 0, transition: "opacity .4s ease", animation: "heroKen 12s ease-out both" }}
        />
      )}
      {/* Gradientes */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(10,10,15,1) 30%,rgba(10,10,15,0.5) 65%,rgba(10,10,15,0.1) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,rgba(10,10,15,1) 0%,transparent 50%)" }} />

      {/* Contenido */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 24px", maxWidth: 700, opacity: fade ? 1 : 0, transition: "opacity .4s ease" }}>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-end" }}>
          {/* Poster */}
          {poster && (
            <img src={poster} alt={item.title} className="hide-mobile"
              style={{ width: 100, height: 150, objectFit: "cover", borderRadius: 8, flexShrink: 0, boxShadow: "0 8px 32px rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          )}
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(230,57,70,0.2)", border: "1px solid rgba(230,57,70,0.4)", color: "#ff6b6b", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, marginBottom: 10, textTransform: "uppercase", letterSpacing: ".6px" }}>
              <Star size={9} fill="#ff6b6b" strokeWidth={0} /> Tendencia
            </span>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px, 6vw, 54px)", lineHeight: 1, letterSpacing: 1, marginBottom: 8, color: "#fff", textShadow: "0 2px 16px rgba(0,0,0,0.6)" }}>
              {item.title}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              <span style={{ color: "#9898b0", fontSize: 13 }}>{item.year}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 3, color: "#ffd166", fontSize: 13, fontWeight: 600 }}>
                <Star size={11} fill="#ffd166" strokeWidth={0} /> {item.rating}
              </span>
            </div>
            <p style={{ color: "#9898b0", fontSize: "clamp(11px, 2vw, 13px)", lineHeight: 1.6, maxWidth: 420, marginBottom: 18, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {item.desc}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <Link to={`/peliculas/${item._id}`} style={{ textDecoration: "none" }}>
                <button style={{ background: "#e63946", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#ff6b6b"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#e63946"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <Play size={12} fill="#fff" strokeWidth={0} /> Reproducir
                </button>
              </Link>
              <Link to={`/peliculas/${item._id}`} style={{ textDecoration: "none" }}>
                <button style={{ background: "rgba(255,255,255,0.1)", color: "#f0f0f5", border: "1px solid rgba(255,255,255,0.2)", padding: "10px 18px", borderRadius: 8, fontFamily: "'Outfit', sans-serif", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all .2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                >
                  <Info size={12} /> Más info
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores */}
      <div style={{ position: "absolute", bottom: 16, right: 24, display: "flex", gap: 6 }}>
        {Array.from({ length: Math.min(items.length, 5) }, (_, i) => (
          <button key={i} onClick={() => { setFade(false); setTimeout(() => { setIdx(i); setFade(true); }, 200); }}
            style={{ width: i === idx ? 20 : 6, height: 6, borderRadius: 3, background: i === idx ? "#e63946" : "rgba(255,255,255,0.25)", border: "none", cursor: "pointer", transition: "all .3s", padding: 0 }}
          />
        ))}
      </div>
    </div>
  );
};

/* ── Page ─────────────────────────────────────────────────────────── */
const HomePage = () => {
  const [trending,  setTrending]  = useState([]);
  const [series,    setSeries]    = useState([]);
  const [topRated,  setTopRated]  = useState([]);
  const [clasicos,  setClasicos]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [loadingWF, setLoadingWF] = useState(true);
  const { data: canales } = useApi('/canales');

  useEffect(() => {
    Promise.all([tmdb.trending(), tmdb.popularSeries(), tmdb.topRated()])
      .then(([tr, sr, top]) => {
        setTrending(tr.results.slice(0, 12).map(normalizeMovie));
        setSeries(sr.results.slice(0, 12).map(normalizeSerie));
        setTopRated(top.results.slice(0, 12).map(normalizeMovie));
      })
      .finally(() => setLoading(false));

    archive.popular(1)
      .then(res => setClasicos((res.docs || []).slice(0, 10).map(normalizeArchive)))
      .finally(() => setLoadingWF(false));
  }, []);

  return (
    <div>
      {/* Hero carousel */}
      {loading ? <SkeletonHero /> : <Hero items={trending} />}

      {/* Secciones */}
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 32, paddingBottom: 40 }}>

        <div>
          <SectionHeader accent="TENDENCIAS" title="ESTA SEMANA" linkTo="/peliculas" />
          {loading ? <SkeletonRow /> : <ScrollRow items={trending} tipo="pelicula" />}
        </div>

        <div>
          <SectionHeader accent="SERIES" title="POPULARES" linkTo="/series" />
          {loading ? <SkeletonRow /> : <ScrollRow items={series} tipo="serie" />}
        </div>

        <div>
          <SectionHeader accent="MEJOR" title="VALORADAS" linkTo="/peliculas" />
          {loading ? <SkeletonRow /> : <ScrollRow items={topRated} tipo="pelicula" />}
        </div>

        {/* WikiFlix */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 3, height: 20, background: "#9b59b6", borderRadius: 2 }} />
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 1.5, background: "linear-gradient(90deg,#9b59b6,#3498db)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                WIKIFLIX
              </h2>
              <span style={{ background: "linear-gradient(90deg,#6c3483,#1a5276)", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>GRATIS</span>
            </div>
            <Link to="/wikiflix" style={{ color: "#5a5a75", fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
              onMouseEnter={e => e.currentTarget.style.color = "#9898b0"}
              onMouseLeave={e => e.currentTarget.style.color = "#5a5a75"}
            >Ver catálogo <ChevronRight size={12} /></Link>
          </div>
          {loadingWF ? <SkeletonRow /> : <WikiRow items={clasicos} />}
        </div>

        {/* Canales */}
        <div>
          <SectionHeader accent="CANALES" title="EN VIVO" linkTo="/canales" />
          {!canales
            ? <div style={{ display: "flex", gap: 10 }}>{Array.from({ length: 5 }, (_, i) => <div key={i} className="skeleton" style={{ width: 150, height: 110, borderRadius: 12 }} />)}</div>
            : (
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none" }}>
                {canales.map((c, i) => (
                  <div key={c._id} style={{ animation: "fadeIn 0.3s ease both", animationDelay: `${i * 0.05}s` }}>
                    <CanalCard canal={c} />
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default HomePage;
