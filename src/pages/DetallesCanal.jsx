<<<<<<< HEAD
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Radio, ExternalLink } from "lucide-react";
import YouTubeLivePlayer from "../components/YouTubeLivePlayer";
import { LoadingSpinner, ErrorMessage } from "../components/Feedback";
import { useApi } from "../hooks/useApi";

const DetallesCanal = () => {
  const { id } = useParams();
  const [playing, setPlaying] = useState(false);
  const { data: canal, loading, error } = useApi(`/canales/${id}`);

  // Canales de la misma categoría
  const { data: todos } = useApi('/canales');
  const mismaCategoria = todos ? todos.filter(c => c._id !== id && c.categoria === canal?.categoria) : [];

  if (loading) return <div style={{ padding: 24 }}><LoadingSpinner mensaje="Cargando canal..." /></div>;
  if (error || !canal) return <div style={{ padding: 24 }}><ErrorMessage mensaje="Canal no encontrado." /></div>;

  return (
    <div style={{ padding: "24px" }}>
      <Link to="/canales" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#9898b0", textDecoration: "none", fontSize: 13, marginBottom: 28 }}
        onMouseEnter={e => e.currentTarget.style.color = "#f0f0f5"}
        onMouseLeave={e => e.currentTarget.style.color = "#9898b0"}
      ><ArrowLeft size={14} /> Volver a Canales</Link>

      {/* Header del canal */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 32 }}>
        <div style={{
          width: 90, height: 90, borderRadius: 18, flexShrink: 0,
          background: "linear-gradient(135deg,#1a1a26,#252535)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 44, border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}>
          {canal.emoji}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 1, color: "#fff" }}>
              {canal.name}
            </h1>
            {canal.live && (
              <span style={{ background: "#e63946", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: ".5px", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block", animation: "pulse 1.5s infinite" }} />
                EN VIVO
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Radio size={14} color="#9898b0" />
            <span style={{ color: "#9898b0", fontSize: 13 }}>{canal.categoria}</span>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {canal.youtubeId ? (
              <button onClick={() => setPlaying(v => !v)} style={{
                background: playing ? "#252535" : "#e63946",
                color: "#fff", border: "none", padding: "11px 24px", borderRadius: 8,
                fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                transition: "all .2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <Radio size={14} />
                {playing ? "Detener" : "Ver en vivo"}
              </button>
            ) : (
              <a href={canal.url} target="_blank" rel="noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#e63946", color: "#fff", textDecoration: "none",
                padding: "11px 24px", borderRadius: 8,
                fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600,
              }}>
                <ExternalLink size={14} /> Abrir canal
              </a>
            )}
          </div>
        </div>
      </div>

      {/* YouTube Live Player */}
      {playing && canal.youtubeId && (
        <YouTubeLivePlayer
          youtubeVideoId={canal.youtubeVideoId}
              youtubeChannelId={canal.youtubeChannelId}
          nombre={canal.name}
          onClose={() => setPlaying(false)}
        />
      )}

      {/* Canales relacionados */}
      {mismaCategoria.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 1.5, marginBottom: 16, color: "#f0f0f5" }}>
            MÁS CANALES DE <span style={{ color: "#e63946" }}>{canal.categoria.toUpperCase()}</span>
          </h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {mismaCategoria.map(c => (
              <Link key={c._id} to={`/canales/${c._id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "#1a1a26", borderRadius: 10, padding: "12px 16px",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                  border: "1px solid rgba(255,255,255,0.06)", transition: "all .2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#252535"; e.currentTarget.style.borderColor = "rgba(230,57,70,0.25)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#1a1a26"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                >
                  <span style={{ fontSize: 22 }}>{c.emoji}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#f0f0f5" }}>{c.name}</p>
                    {c.live && <p style={{ fontSize: 10, color: "#e63946", fontWeight: 600, marginTop: 2 }}>EN VIVO</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
=======
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function DetallesCanal() {
  const { id } = useParams();
  const [canal, setCanal] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/canales/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCanal(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al obtener el canal:", error);
        setCargando(false);
      });
  }, [id]);

  if (cargando) return <div className="text-white text-center mt-10">Cargando canal...</div>;
  if (!canal) return <div className="text-red-500 text-center mt-10">Canal no encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white rounded-xl shadow-md">
      {canal.logo && (
        <img
          src={canal.logo}
          alt={canal.nombre}
          className="w-full h-64 object-contain rounded-md mb-6"
        />
      )}
      <h1 className="text-3xl font-bold mb-2">{canal.nombre}</h1>
      <p className="text-sm text-gray-500 mb-4">Categoría: {canal.categoria || "Sin categoría"}</p>
      <p className="text-gray-700 mb-4">{canal.descripcion}</p>

      {canal.url && (
        <video
          src={canal.url}
          controls
          className="w-full rounded-md border border-gray-300"
        />
      )}
    </div>
  );
}
>>>>>>> 20bc9f11e13453c9cca995fc40d9c8914477a18e

export default DetallesCanal;
