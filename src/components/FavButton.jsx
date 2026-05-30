import React from "react";
import { Heart } from "lucide-react";
import { useFavoritos } from "../context/FavoritosContext";

/**
 * Botón grande de favorito para usar en páginas de detalles.
 * Props: item (objeto), tipo ("pelicula" | "serie")
 */
const FavButton = ({ item, tipo }) => {
  const { esFavorito, toggleFavorito } = useFavoritos();
  const id  = item._id || item.id;
  const fav = esFavorito(id);

  return (
    <button
      onClick={() => toggleFavorito({ ...item, _id: id }, tipo)}
      style={{
        background: fav ? "rgba(230,57,70,0.15)" : "rgba(255,255,255,0.08)",
        border: `1px solid ${fav ? "rgba(230,57,70,0.4)" : "rgba(255,255,255,0.15)"}`,
        color: fav ? "#ff6b6b" : "#9898b0",
        padding: "10px 20px", borderRadius: 8,
        fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500,
        cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
        transition: "all .2s",
      }}
      onMouseEnter={e => e.currentTarget.style.background = fav ? "rgba(230,57,70,0.25)" : "rgba(255,255,255,0.14)"}
      onMouseLeave={e => e.currentTarget.style.background = fav ? "rgba(230,57,70,0.15)" : "rgba(255,255,255,0.08)"}
    >
      <Heart size={14} fill={fav ? "#ff6b6b" : "none"} strokeWidth={2} />
      {fav ? "En favoritos" : "Agregar a favoritos"}
    </button>
  );
};

export default FavButton;
