import React from "react";
import { Link } from "react-router-dom";
import { Star, Heart, ImageOff } from "lucide-react";
import { useFavoritos } from "../context/FavoritosContext";
import { posterUrl } from "../hooks/useTMDB";

const MovieCard = ({ item, tipo }) => {
  const { esFavorito, toggleFavorito } = useFavoritos();
  const id    = item._id || item.id;
  // tipo puede venir como "movie"/"tv" (TMDB) o "pelicula"/"serie" (interno)
  const tipoNorm = tipo === "movie" || tipo === "pelicula" ? "pelicula" : "serie";
  const to    = tipoNorm === "pelicula" ? `/peliculas/${id}` : `/series/${id}`;
  const fav   = esFavorito(id);
  const poster = posterUrl(item.posterPath);

  return (
    <div style={{ position: "relative", flex: "0 0 140px" }}>
      <Link to={to} style={{ borderRadius: 10, overflow: "hidden", cursor: "pointer", transition: "transform .2s", background: "#1a1a26", textDecoration: "none", display: "block" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {/* Poster */}
        <div style={{ width: 140, height: 200, background: "linear-gradient(135deg,#1a1a26,#252535)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {poster
            ? <img src={poster} alt={item.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
            : null
          }
          <div style={{ display: poster ? "none" : "flex", position: "absolute", inset: 0, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 36 }}>{item.emoji || "🎬"}</span>
            <ImageOff size={14} color="#5a5a75" />
          </div>
        </div>

        {/* Rating */}
        {item.rating > 0 && (
          <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.78)", color: "#ffd166", fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 5, backdropFilter: "blur(4px)", display: "flex", alignItems: "center", gap: 3 }}>
            <Star size={8} fill="#ffd166" strokeWidth={0} />{item.rating}
          </div>
        )}
        {item.nuevo && (
          <div style={{ position: "absolute", top: 8, left: 8, background: "#e63946", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 5, textTransform: "uppercase" }}>Nuevo</div>
        )}

        <div style={{ padding: "8px 10px 10px" }}>
          <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#f0f0f5" }}>{item.title}</div>
          <div style={{ fontSize: 11, color: "#5a5a75", marginTop: 2 }}>
            {item.year}{item.genre && typeof item.genre === "string" && !item.genre.match(/^\d+$/) ? ` • ${item.genre}` : ""}
            {item.seasons ? ` • ${item.seasons}T` : ""}
          </div>
        </div>
      </Link>

      {/* Fav button */}
      <button onClick={() => toggleFavorito({ ...item, _id: id }, tipoNorm)}
        title={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
        style={{ position: "absolute", bottom: 38, right: 6, background: fav ? "rgba(230,57,70,0.9)" : "rgba(0,0,0,0.65)", border: fav ? "1px solid #e63946" : "1px solid rgba(255,255,255,0.15)", borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .2s", backdropFilter: "blur(4px)" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        <Heart size={12} fill={fav ? "#fff" : "none"} color={fav ? "#fff" : "#9898b0"} strokeWidth={2} />
      </button>
    </div>
  );
};

export default MovieCard;
