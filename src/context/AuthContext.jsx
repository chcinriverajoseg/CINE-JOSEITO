import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BASE_URL } from '../hooks/useApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario,  setUsuario]  = useState(null);
  const [token,    setToken]    = useState(() => localStorage.getItem('cine-token') || null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!token) { setCargando(false); return; }
    fetch(`${BASE_URL}/auth/perfil`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(u => setUsuario(u))
      .catch(() => { localStorage.removeItem('cine-token'); setToken(null); })
      .finally(() => setCargando(false));
  }, [token]);

  const guardarSesion = (data) => {
    localStorage.setItem('cine-token', data.token);
    setToken(data.token);
    setUsuario(data.usuario);
  };

  const registro = async (nombre, email, password) => {
    const res = await fetch(`${BASE_URL}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    guardarSesion(data);
  };

  const login = async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    guardarSesion(data);
  };

  const logout = () => {
    localStorage.removeItem('cine-token');
    setToken(null);
    setUsuario(null);
  };

  const sincronizarFavoritos = useCallback(async (favoritos) => {
    if (!token) return;
    await fetch(`${BASE_URL}/auth/favoritos`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ favoritos }),
    });
  }, [token]);

  return (
    <AuthContext.Provider value={{ usuario, token, cargando, registro, login, logout, sincronizarFavoritos }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
