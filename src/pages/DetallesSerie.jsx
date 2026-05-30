import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Play } from "lucide-react";
import VidSrcPlayer from "../components/VidSrcPlayer";
import FavButton from "../components/FavButton";
import MovieCard from "../components/MovieCard";
import { SkeletonDetail, ErrorMessage, LoadingSpinner } from "../components/Feedback";
import { tmdb, normalizeSerie, posterUrl, backdropUrl } from "../hooks/useTMDB";

const DetallesSerie = () => {
  const { id } = useParams();
  const [serie, setSerie]           = useState(null);
  const [similares, setSimilares]   = useState([]);
  const [temporada, setTemporada]   = useState(1);
  const [episodios, setEpisodios]   = useState([]);
  const [epActivo, setEpActivo]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [loadingEps, setLoadingEps] = useState(false);
  const [error, setError]           = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [playing, setPlaying]       = useState(false);

  useEffect(() => {
    setLoading(true); setPlaying(false); setEpActivo(null);
    Promise.all([tmdb.serieDetail(id), tmdb.serieSimilar(id)])
      .then(([det, sim]) => {
        setSerie(det);
        setSimilares(sim.results.slice(0, 8).map(normalizeSerie));
        const trailer = det.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        if (trailer) setTrailerKey(trailer.key);
        setTemporada(1);
      })
      .catch(() => setError("No se pudo cargar la serie."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!serie) return;
    setLoadingEps(true); setEpActivo(null); setPlaying(false);
    tmdb.serieSeason(id, temporada)
      .then(data => setEpisodios(data.episodes || []))
      .finally(() => setLoadingEps(false));
  }, [id, serie, temporada]);

  if (loading) return <SkeletonDetail />;
  if (error)   return <div style={{ padding: 24 }}><ErrorMessage mensaje={error} /></div>;
  if (!serie)  return null;

  const item     = normalizeSerie(serie);
  const genres   = serie.genres?.map(g => g.name).join(" • ") || "";
  const backdrop = backdropUrl(serie.backdrop_path);
  const poster   = posterUrl(serie.poster_path, 'w500');

  return (
    <div>
      <div style={{ position: "relative", height: 300, overflow: "hidden" }}>
        {backdrop && <img src={backdrop} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }} />}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,#0a0a0f 0%,rgba(10,10,15,0.3) 100%)" }} />
      </div>

      <div style={{ padding: "0 24px 40px", marginTop: -120, position: "relative" }}>
        <Link to="/series" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#9898b0", textDecoration: "none", fontSize: 13, marginBottom: 24 }}
          onMouseEnter={e => e.currentTarget.style.color = "#f0f0f5"}
          onMouseLeave={e => e.currentTarget.style.color = "#9898b0"}
        ><ArrowLeft size={14} /> Volver</Link>

        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 32 }}>
          <div style={{ flexShrink: 0 }}>
            {poster
              ? <img src={poster} alt={serie.name} style={{ width: 180, height: 270, objectFit: "cover", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }} />
              : <div style={{ width: 180, height: 270, borderRadius: 12, background: "#1a1a26", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60 }}>📺</div>
            }
          </div>

          <div style={{ flex: 1, minWidth: 260, paddingTop: 80 }}>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, letterSpacing: 1, lineHeight: 1, marginBottom: 12, color: "#fff" }}>{serie.name}</h1>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
              <span style={{ color: "#9898b0", fontSize: 13 }}>{(serie.first_air_date || "").slice(0, 4)}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#ffd166", fontSize: 13, fontWeight: 600 }}>
                <Star size={12} fill="#ffd166" strokeWidth={0} /> {Math.round((serie.vote_average || 0) * 10) / 10}
              </span>
              <span style={{ background: "rgba(255,255,255,0.08)", color: "#9898b0", fontSize: 12, padding: "3px 10px", borderRadius: 10 }}>
                {serie.number_of_seasons} temporada{serie.number_of_seasons > 1 ? "s" : ""}
              </span>
            </div>
            {genres && <p style={{ color: "#5a5a75", fontSize: 12, marginBottom: 14 }}>{genres}</p>}
            <p style={{ color: "#9898b0", fontSize: 14, lineHeight: 1.7, maxWidth: 520, marginBottom: 24 }}>{serie.overview}</p>
            <FavButton item={item} tipo="serie" />
          </div>
        </div>

        {/* Trailer */}
        {trailerKey && !playing && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 1.5, marginBottom: 14, color: "#f0f0f5" }}>
              TRAILER <span style={{ color: "#e63946" }}>OFICIAL</span>
            </h2>
            <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
              <iframe src={`https://www.youtube.com/embed/${trailerKey}?rel=0`} title="Trailer" allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} />
            </div>
          </div>
        )}

        {/* Temporadas */}
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 1.5, marginBottom: 14, color: "#f0f0f5" }}>
          TEMPORADAS <span style={{ color: "#e63946" }}>Y EPISODIOS</span>
        </h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {Array.from({ length: serie.number_of_seasons }, (_, i) => i + 1).map(t => (
            <button key={t} onClick={() => setTemporada(t)} style={{
              background: temporada === t ? "rgba(230,57,70,0.15)" : "#1a1a26",
              border: `1px solid ${temporada === t ? "rgba(230,57,70,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: temporada === t ? "#ff6b6b" : "#9898b0",
              fontFamily: "'Outfit', sans-serif", fontSize: 12, padding: "6px 14px", borderRadius: 20, cursor: "pointer",
            }}>T{t}</button>
          ))}
        </div>

        {loadingEps ? <LoadingSpinner mensaje="Cargando episodios..." /> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {episodios.map(ep => {
              const thumb    = ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : null;
              const isActive = epActivo?.id === ep.id;
              return (
                <div key={ep.id} onClick={() => { setEpActivo(isActive ? null : ep); setPlaying(false); }}
                  style={{
                    background: isActive ? "#252535" : "#1a1a26",
                    border: `1px solid ${isActive ? "rgba(230,57,70,0.3)" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: 8, padding: "12px 14px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 14, transition: "all .2s",
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#252535"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "#1a1a26"; }}
                >
                  {thumb
                    ? <img src={thumb} alt="" style={{ width: 80, height: 45, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
                    : <div style={{ width: 80, height: 45, background: "#252535", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Play size={16} color="#5a5a75" /></div>
                  }
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#f0f0f5" }}>E{ep.episode_number} — {ep.name}</p>
                    {ep.runtime && <p style={{ fontSize: 11, color: "#5a5a75", marginTop: 2 }}>{ep.runtime} min</p>}
                  </div>
                  {isActive && (
                    <button onClick={e => { e.stopPropagation(); setPlaying(v => !v); }}
                      style={{ background: playing ? "#252535" : "#e63946", border: "none", color: "#fff", fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 600, padding: "6px 12px", borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                      {playing ? "⏹ Detener" : "▶ Ver"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* VidSrc player para episodio */}
        {playing && epActivo && (
          <VidSrcPlayer
            tmdbId={id}
            tipo="tv"
            season={temporada}
            episode={epActivo.episode_number}
            titulo={`${serie.name} · T${temporada}E${epActivo.episode_number} — ${epActivo.name}`}
            onClose={() => setPlaying(false)}
          />
        )}

        {/* Similares */}
        {similares.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 1.5, marginBottom: 16, color: "#f0f0f5" }}>
              SERIES <span style={{ color: "#e63946" }}>SIMILARES</span>
            </h2>
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
              {similares.map(s => <MovieCard key={s._id} item={s} tipo="serie" />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetallesSerie;
