<<<<<<< HEAD
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider }      from "./context/AuthContext";
import { FavoritosProvider } from "./context/FavoritosContext";
import Navbar           from "./components/Navbar";
import PageWrapper      from "./components/PageWrapper";
import HomePage         from "./pages/HomePage";
import PeliculasPage    from "./pages/PeliculasPage";
import SeriesPage       from "./pages/SeriesPage";
import CanalesPage      from "./pages/CanalesPage";
import DetallesPage     from "./pages/DetallesPage";
import DetallesSerie    from "./pages/DetallesSerie";
import DetallesCanal    from "./pages/DetallesCanal";
import BuscarPage       from "./pages/BuscarPage";
import FavoritosPage    from "./pages/FavoritosPage";
import LoginPage        from "./pages/LoginPage";
import RegistroPage     from "./pages/RegistroPage";
import WikiFlixPage     from "./pages/WikiFlixPage";
import DetallesWikiflix from "./pages/DetallesWikiflix";

function App() {
  return (
    <AuthProvider>
      <FavoritosProvider>
        <Router>
          <Navbar />
          <main>
            <PageWrapper>
              <Routes>
                <Route path="/"               element={<HomePage />} />
                <Route path="/peliculas"      element={<PeliculasPage />} />
                <Route path="/peliculas/:id"  element={<DetallesPage />} />
                <Route path="/series"         element={<SeriesPage />} />
                <Route path="/series/:id"     element={<DetallesSerie />} />
                <Route path="/canales"        element={<CanalesPage />} />
                <Route path="/canales/:id"    element={<DetallesCanal />} />
                <Route path="/buscar"         element={<BuscarPage />} />
                <Route path="/favoritos"      element={<FavoritosPage />} />
                <Route path="/login"          element={<LoginPage />} />
                <Route path="/registro"       element={<RegistroPage />} />
                <Route path="/wikiflix"       element={<WikiFlixPage />} />
                <Route path="/wikiflix/:id"   element={<DetallesWikiflix />} />
              </Routes>
            </PageWrapper>
          </main>
        </Router>
      </FavoritosProvider>
    </AuthProvider>
=======
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
>>>>>>> 20bc9f11e13453c9cca995fc40d9c8914477a18e
  );
}

export default App;
