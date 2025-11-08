import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PeliculasPage from "./pages/PeliculasPage";
import SeriesPage from "./pages/SeriesPage";
import CanalesPage from "./pages/Canales";
import DetallesPage from "./pages/DetallesPage";
import DetallesSerie from "./pages/DetallesSerie";
import Navbar from "./components/Navbar";
import DetallesCanal from "./pages/DetallesCanal";

function App() {
  return (
    <Router>
      <div className="p-4">
        <h1 className="text-3xl font-bold text-center mb-4 text-white">Cine JOSEITO</h1>

        {/* Barra de navegación */}
        <Navbar />

        {/* Rutas */}
        <Routes>
          <Route path="/" element={<PeliculasPage />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/canales" element={<CanalesPage />} />
          <Route path="/detalles/:id" element={<DetallesPage />} />
          <Route path="/series/:id" element={<DetallesSerie />} />
          <Route path="/canales/:id" element={<DetallesCanal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
