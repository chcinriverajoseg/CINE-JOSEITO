import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import MovieCard from "../components/MovieCard";
import { useFavoritos } from "../context/FavoritosContext";

const TABS = ["Todos", "Películas", "Series"];

const FavoritosPage = () => {
  const { favoritos, toggleFavorito } = useFavoritos();
  const [tab, setTab] = useState("Todos");

  const lista = favoritos.filter(f => {
    if (tab === "Películas") return f._tipo === "pelicula";
    if (tab === "Series")    return f._tipo === "serie";
    return true;
  });

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 1.5, color: "#f0f0f5" }}>
          MIS <span style={{ color: "#e63946" }}>FAVORITOS</span>
        </h1>
        {favoritos.length > 0 && (
          <span style={{ color: "#5a5a75", fontSize: 13 }}>
            {favoritos.length} {favoritos.length === 1 ? "elemento" : "elementos"}
          </span>
        )}
      </div>

      {/* Tabs */}
      {favoritos.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t ? "rgba(230,57,70,0.15)" : "#1a1a26",
              border: `1px solid ${tab === t ? "rgba(230,57,70,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: tab === t ? "#ff6b6b" : "#9898b0",
              fontFamily: "'Outfit', sans-serif", fontSize: 12,
              padding: "6px 14px", borderRadius: 20, cursor: "pointer", transition: "all .2s",
            }}>{t}</button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {favoritos.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "#5a5a75" }}>
          <Heart size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
          <p style={{ fontSize: 16, marginBottom: 8, color: "#9898b0" }}>Aún no tienes favoritos</p>
          <p style={{ fontSize: 13, marginBottom: 24 }}>Presiona el ❤ en cualquier película o serie para guardarla aquí.</p>
          <Link to="/" style={{
            background: "#e63946", color: "#fff", textDecoration: "none",
            padding: "10px 22px", borderRadius: 8,
            fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600,
          }}>
            Explorar catálogo
          </Link>
        </div>
      )}

      {/* Lista filtrada vacía */}
      {favoritos.length > 0 && lista.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#5a5a75" }}>
          <p style={{ fontSize: 14 }}>No tienes favoritos en esta categoría.</p>
        </div>
      )}

      {/* Grid */}
      {lista.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
          gap: 14,
        }}>
          {lista.map(item => (
            <MovieCard key={item._id} item={item} tipo={item._tipo} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritosPage;
