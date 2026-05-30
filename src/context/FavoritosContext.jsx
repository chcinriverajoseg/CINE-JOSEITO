import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavoritosContext = createContext();

export const FavoritosProvider = ({ children }) => {
  const { usuario, sincronizarFavoritos } = useAuth();

  const [favoritos, setFavoritos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cine-favoritos')) || []; }
    catch { return []; }
  });

  // Cuando el usuario inicia sesión, cargar sus favoritos desde la BD
  useEffect(() => {
    if (usuario?.favoritos) {
      setFavoritos(usuario.favoritos);
    }
  }, [usuario]);

  // Persistir en localStorage y sincronizar con BD
  useEffect(() => {
    localStorage.setItem('cine-favoritos', JSON.stringify(favoritos));
    sincronizarFavoritos?.(favoritos);
  }, [favoritos]);

  const esFavorito = (id) => favoritos.some(f => f._id === id);

  const toggleFavorito = (item, tipo) => {
    setFavoritos(prev =>
      esFavorito(item._id)
        ? prev.filter(f => f._id !== item._id)
        : [...prev, { ...item, _tipo: tipo }]
    );
  };

  return (
    <FavoritosContext.Provider value={{ favoritos, esFavorito, toggleFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
};

export const useFavoritos = () => useContext(FavoritosContext);
