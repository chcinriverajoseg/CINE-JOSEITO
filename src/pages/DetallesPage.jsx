import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Play, Clock } from "lucide-react";
import VidSrcPlayer from "../components/VidSrcPlayer";
import FavButton from "../components/FavButton";
import MovieCard from "../components/MovieCard";
import { SkeletonDetail, ErrorMessage } from "../components/Feedback";
import { tmdb, normalizeMovie, posterUrl, backdropUrl } from "../hooks/useTMDB";

const DetallesPage = () => {
  const { id } = useParams();
  const [pelicula, setPelicula]   = useState(null);
  const [similares, setSimilares] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [playing, setPlaying]     = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    setLoading(true); setPlaying(false);
    Promise.all([tmdb.movieDetail(id), tmdb.movieSimilar(id)])
      .then(([det, sim]) => {
        setPelicula(det);
        setSimilares(sim.results.slice(0, 8).map(normalizeMovie));
        const trailer = det.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        if (trailer) setTrailerKey(trailer.key);
      })
      .catch(() => setError("No se pudo cargar la película."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <SkeletonDetail />;
  if (error)   return <div style={{ padding: 24 }}><ErrorMessage mensaje={error} /></div>;
  if (!pelicula) return null;

  const item     = normalizeMovie(pelicula);
  const genres   = pelicula.genres?.map(g => g.name).join(" • ") || "";
  const runtime  = pelicula.runtime ? `${Math.floor(pelicula.runtime / 60)}h ${pelicula.runtime % 60}m` : "";
  const backdrop = backdropUrl(pelicula.backdrop_path);
  const poster   = posterUrl(pelicula.poster_path, 'w500');

  return (
    <div>
      {/* Backdrop */}
      <div style={{ position: "relative", height: 300, overflow: "hidden" }}>
        {backdrop && <img src={backdrop} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }} />}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,#0a0a0f 0%,rgba(10,10,15,0.3) 100%)" }} />
      </div>

      <div style={{ padding: "0 24px 40px", marginTop: -120, position: "relative" }}>
        <Link to="/peliculas" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#9898b0", textDecoration: "none", fontSize: 13, marginBottom: 24 }}
          onMouseEnter={e => e.currentTarget.style.color = "#f0f0f5"}
          onMouseLeave={e => e.currentTarget.style.color = "#9898b0"}
        ><ArrowLeft size={14} /> Volver</Link>

        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 32 }}>
          {/* Poster */}
          <div style={{ flexShrink: 0 }}>
            {poster
              ? <img src={poster} alt={pelicula.title} style={{ width: 180, height: 270, objectFit: "cover", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }} />
              : <div style={{ width: 180, height: 270, borderRadius: 12, background: "#1a1a26", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60 }}>🎬</div>
            }
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 260, paddingTop: 80 }}>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, letterSpacing: 1, lineHeight: 1, marginBottom: 12, color: "#fff" }}>{pelicula.title}</h1>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
              <span style={{ color: "#9898b0", fontSize: 13 }}>{(pelicula.release_date || "").slice(0, 4)}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#ffd166", fontSize: 13, fontWeight: 600 }}>
                <Star size={12} fill="#ffd166" strokeWidth={0} /> {Math.round((pelicula.vote_average || 0) * 10) / 10}
              </span>
              {runtime && <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#9898b0", fontSize: 13 }}><Clock size={12} /> {runtime}</span>}
            </div>

            {genres && <p style={{ color: "#5a5a75", fontSize: 12, marginBottom: 14 }}>{genres}</p>}
            <p style={{ color: "#9898b0", fontSize: 14, lineHeight: 1.7, maxWidth: 520, marginBottom: 24 }}>{pelicula.overview}</p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => setPlaying(v => !v)} style={{
                background: playing ? "#252535" : "#e63946", color: "#fff", border: "none",
                padding: "11px 24px", borderRadius: 8, fontFamily: "'Outfit', sans-serif",
                fontSize: 14, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8, transition: "all .2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <Play size={14} fill="#fff" strokeWidth={0} />
                {playing ? "Cerrar player" : "Reproducir ahora"}
              </button>
              <FavButton item={item} tipo="pelicula" />
            </div>
          </div>
        </div>

        {/* VidSrc Player */}
        {playing && (
          <VidSrcPlayer
            tmdbId={id}
            tipo="movie"
            titulo={pelicula.title}
            onClose={() => setPlaying(false)}
          />
        )}

        {/* Trailer YouTube */}
        {trailerKey && !playing && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 1.5, marginBottom: 14, color: "#f0f0f5" }}>
              TRAILER <span style={{ color: "#e63946" }}>OFICIAL</span>
            </h2>
            <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?rel=0`}
                title="Trailer" allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              />
            </div>
          </div>
        )}

        {/* Similares */}
        {similares.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 1.5, marginBottom: 16, color: "#f0f0f5" }}>
              TAMBIÉN TE PUEDE <span style={{ color: "#e63946" }}>GUSTAR</span>
            </h2>
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
              {similares.map(p => <MovieCard key={p._id} item={p} tipo="pelicula" />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetallesPage;
