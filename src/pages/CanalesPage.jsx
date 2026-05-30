<<<<<<< HEAD
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlayCircle, Radio } from "lucide-react";
import YouTubeLivePlayer from "../components/YouTubeLivePlayer";
import { LoadingSpinner, ErrorMessage } from "../components/Feedback";
import { useApi } from "../hooks/useApi";

const FilterBtn = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    background: active ? "rgba(230,57,70,0.15)" : "#1a1a26",
    border: `1px solid ${active ? "rgba(230,57,70,0.4)" : "rgba(255,255,255,0.08)"}`,
    color: active ? "#ff6b6b" : "#9898b0",
    fontFamily: "'Outfit', sans-serif", fontSize: 12,
    padding: "6px 14px", borderRadius: 20, cursor: "pointer", transition: "all .2s",
  }}>{label}</button>
);

const CanalesPage = () => {
  const [filtro, setFiltro]         = useState("Todos");
  const [canalActivo, setCanalActivo] = useState(null);
  const { data: canales, loading, error } = useApi('/canales');

  const categorias = canales ? ["Todos", ...new Set(canales.map(c => c.categoria))] : ["Todos"];
  const lista = !canales ? [] : filtro === "Todos" ? canales : canales.filter(c => c.categoria === filtro);

  const handleCanal = (canal) => {
    setCanalActivo(prev => prev?._id === canal._id ? null : canal);
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 1.5, marginBottom: 20, color: "#f0f0f5" }}>
        CANALES <span style={{ color: "#e63946" }}>EN VIVO</span>
      </h1>

      {loading && <LoadingSpinner mensaje="Cargando canales..." />}
      {error   && <ErrorMessage  mensaje="No se pudo conectar al servidor." />}

      {canales && (
        <>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {categorias.map(c => <FilterBtn key={c} label={c} active={filtro === c} onClick={() => { setFiltro(c); setCanalActivo(null); }} />)}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10, marginBottom: 24 }}>
            {lista.map((canal, i) => {
              const isActive = canalActivo?._id === canal._id;
              return (
                <div key={canal._id} onClick={() => handleCanal(canal)}
                  style={{
                    background: isActive ? "#252535" : "#1a1a26",
                    borderRadius: 10, padding: 14, cursor: "pointer",
                    transition: "all .2s", position: "relative",
                    border: `1px solid ${isActive ? "rgba(230,57,70,0.4)" : "transparent"}`,
                    animation: `fadeIn 0.3s ease both`,
                    animationDelay: `${i * 0.04}s`,
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "#252535"; e.currentTarget.style.borderColor = "rgba(230,57,70,0.2)"; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "#1a1a26"; e.currentTarget.style.borderColor = "transparent"; } }}
                >
                  {canal.live && (
                    <span style={{ position: "absolute", top: 10, right: 10, background: "#e63946", color: "#fff", fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 4, letterSpacing: ".5px", display: "flex", alignItems: "center", gap: 3 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", display: "inline-block" }} />
                      EN VIVO
                    </span>
                  )}
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: isActive ? "rgba(230,57,70,0.15)" : "#252535", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, fontSize: 20, transition: "background .2s" }}>
                    {canal.emoji}
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#f0f0f5", marginBottom: 3 }}>{canal.name}</p>
                  <p style={{ fontSize: 11, color: "#5a5a75", marginBottom: 8 }}>{canal.categoria}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <PlayCircle size={16} color={isActive ? "#e63946" : "#5a5a75"} />
                    <span style={{ fontSize: 10, color: isActive ? "#e63946" : "#5a5a75", fontFamily: "'Outfit', sans-serif" }}>
                      {isActive ? "Reproduciendo" : "Ver canal"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* YouTube Live Player */}
          {canalActivo && (
            <YouTubeLivePlayer
              youtubeVideoId={canalActivo.youtubeVideoId}
              youtubeChannelId={canalActivo.youtubeChannelId}
              nombre={canalActivo.name}
              onClose={() => setCanalActivo(null)}
            />
          )}
        </>
      )}
    </div>
  );
};
=======
import { useEffect, useState } from 'react';

function CanalesPage() {
  const [canales, setCanales] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/api/canales')
      .then(response => response.json())
      .then(data => {
        setCanales(data);
        setCargando(false);
      })
      .catch(error => {
        console.error('Error al cargar canales:', error);
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <div className="text-center mt-10 text-xl font-bold text-white">Cargando canales...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4">
      {canales.map(canal => (
        <div 
          key={canal._id}
          className="bg-white rounded-lg shadow-md p-4 hover:scale-105 transition-transform"
        >
          <h2 className="text-lg font-semibold mb-2">{canal.nombre}</h2>
          <p className="text-gray-700">{canal.categoria}</p>
          <a 
            href={canal.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 underline mt-2 block"
          >
            Ver Canal
          </a>
        </div>
      ))}
    </div>
  );
}
>>>>>>> 20bc9f11e13453c9cca995fc40d9c8914477a18e

export default CanalesPage;
