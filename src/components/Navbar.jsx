import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Film, Tv, SatelliteDish, Search, Heart, User, LogOut, Clapperboard, Menu, X, Home } from "lucide-react";
import { useFavoritos } from "../context/FavoritosContext";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { to: "/",          label: "Inicio",       icon: Home },
  { to: "/peliculas", label: "Películas",    icon: Film },
  { to: "/series",    label: "Series",       icon: Tv },
  { to: "/canales",   label: "Canales",      icon: SatelliteDish },
  { to: "/wikiflix",  label: "WikiFlix",     icon: Clapperboard },
];

// ── Bottom nav para móvil (5 items principales) ─────────────────────
export const BottomNav = () => {
  const { pathname } = useLocation();
  const { favoritos } = useFavoritos();

  const items = [
    { to: "/",          label: "Inicio",    icon: Home },
    { to: "/peliculas", label: "Películas", icon: Film },
    { to: "/series",    label: "Series",    icon: Tv },
    { to: "/favoritos", label: "Favoritos", icon: Heart, badge: favoritos.length },
    { to: "/buscar",    label: "Buscar",    icon: Search },
  ];

  return (
    <nav className="show-mobile" style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
      background: "rgba(10,10,15,0.97)", backdropFilter: "blur(16px)",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      height: "var(--bottom-nav-h)",
      display: "none", // show-mobile override lo activa
      alignItems: "center", justifyContent: "space-around",
      padding: "0 4px",
    }}>
      {items.map(({ to, label, icon: Icon, badge }) => {
        const active = pathname === to;
        return (
          <Link key={to} to={to} style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 12px", borderRadius: 10, position: "relative", flex: 1, transition: "all .2s" }}>
            <div style={{ position: "relative" }}>
              <Icon size={22} color={active ? "#e63946" : "#5a5a75"} strokeWidth={active ? 2.5 : 1.5} />
              {badge > 0 && (
                <span style={{ position: "absolute", top: -4, right: -6, background: "#e63946", color: "#fff", fontSize: 8, fontWeight: 700, borderRadius: "50%", width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </div>
            <span style={{ fontSize: 9, color: active ? "#e63946" : "#5a5a75", fontFamily: "'Outfit', sans-serif", fontWeight: active ? 600 : 400, letterSpacing: ".3px" }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

// ── Navbar principal ────────────────────────────────────────────────
const Navbar = () => {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const { favoritos } = useFavoritos();
  const { usuario, logout } = useAuth();
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [userMenuOpen, setUserMenu]   = useState(false);
  const [scrolled,    setScrolled]    = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Cerrar menú al navegar
  useEffect(() => { setMenuOpen(false); setUserMenu(false); }, [pathname]);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <>
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", height: "var(--navbar-h)",
        background: scrolled
          ? "rgba(10,10,15,0.98)"
          : "linear-gradient(180deg,rgba(10,10,15,0.95) 0%,rgba(10,10,15,0.7) 100%)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
        position: "sticky", top: 0, zIndex: 100,
        backdropFilter: "blur(12px)",
        transition: "background .3s, border .3s",
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 2,
            background: "linear-gradient(90deg,#e63946,#ffd166)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>CINE<span style={{ WebkitTextFillColor: "#ffd166" }}>JOSEITO</span></span>
        </Link>

        {/* Links desktop */}
        <div className="hide-mobile" style={{ display: "flex", gap: 2 }}>
          {NAV_LINKS.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link key={to} to={to} style={{ textDecoration: "none" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: 8,
                  fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500,
                  cursor: "pointer", transition: "all .2s",
                  color: active ? "#f0f0f5" : "#9898b0",
                  background: active ? "rgba(230,57,70,0.15)" : "transparent",
                  border: active ? "1px solid rgba(230,57,70,0.25)" : "1px solid transparent",
                }}>
                  <Icon size={13} />{label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Derecha desktop */}
        <div className="hide-mobile" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link to="/favoritos" style={{ textDecoration: "none" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6, position: "relative",
              background: pathname === "/favoritos" ? "rgba(230,57,70,0.15)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${pathname === "/favoritos" ? "rgba(230,57,70,0.3)" : "rgba(255,255,255,0.1)"}`,
              color: pathname === "/favoritos" ? "#ff6b6b" : "#9898b0",
              fontSize: 12, padding: "6px 12px", borderRadius: 20,
              cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            }}>
              <Heart size={12} fill={pathname === "/favoritos" ? "#ff6b6b" : "none"} strokeWidth={2} />
              Favoritos
              {favoritos.length > 0 && (
                <span style={{ background: "#e63946", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {favoritos.length > 9 ? "9+" : favoritos.length}
                </span>
              )}
            </span>
          </Link>

          <Link to="/buscar" style={{ textDecoration: "none" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9898b0", fontSize: 12, padding: "6px 12px", borderRadius: 20, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
              <Search size={12} /> Buscar
            </span>
          </Link>

          {usuario ? (
            <div style={{ position: "relative" }}>
              <button onClick={() => setUserMenu(v => !v)} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#f0f0f5", fontSize: 12, padding: "5px 10px 5px 5px", borderRadius: 20,
                cursor: "pointer", fontFamily: "'Outfit', sans-serif",
              }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#e63946,#9b59b6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                  {usuario.nombre?.[0]?.toUpperCase()}
                </div>
                <span className="hide-mobile">{usuario.nombre}</span>
              </button>
              {userMenuOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#1a1a26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 6, minWidth: 180, zIndex: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", animation: "slideDown .2s ease" }}>
                  <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#f0f0f5" }}>{usuario.nombre}</p>
                    <p style={{ fontSize: 11, color: "#5a5a75", marginTop: 2 }}>{usuario.email}</p>
                  </div>
                  <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#ff6b6b", fontFamily: "'Outfit', sans-serif", fontSize: 13, padding: "8px 12px", borderRadius: 6, cursor: "pointer", transition: "background .2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(230,57,70,0.1)"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    <LogOut size={14} /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" style={{ textDecoration: "none" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#e63946", border: "1px solid #e63946", color: "#fff", fontSize: 12, padding: "6px 16px", borderRadius: 20, cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>
                <User size={12} /> Ingresar
              </span>
            </Link>
          )}
        </div>

        {/* Hamburger móvil */}
        <div className="show-mobile" style={{ display: "none", alignItems: "center", gap: 10 }}>
          <Link to="/buscar" style={{ color: "#9898b0" }}><Search size={20} /></Link>
          <button onClick={() => setMenuOpen(v => !v)} style={{ background: "none", border: "none", color: "#f0f0f5", cursor: "pointer", padding: 4 }}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="show-mobile" style={{
          display: "none", // show-mobile lo activa
          position: "fixed", top: "var(--navbar-h)", left: 0, right: 0, bottom: 0,
          background: "rgba(10,10,15,0.98)", backdropFilter: "blur(16px)",
          zIndex: 99, flexDirection: "column",
          padding: "20px", overflowY: "auto",
          animation: "slideDown .2s ease",
        }}>
          {/* Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 24 }}>
            {NAV_LINKS.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link key={to} to={to} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 16px", borderRadius: 10,
                    background: active ? "rgba(230,57,70,0.12)" : "transparent",
                    border: `1px solid ${active ? "rgba(230,57,70,0.25)" : "transparent"}`,
                    color: active ? "#ff6b6b" : "#f0f0f5",
                    fontSize: 16, fontFamily: "'Outfit', sans-serif", fontWeight: 500,
                  }}>
                    <Icon size={20} color={active ? "#e63946" : "#9898b0"} />
                    {label}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 20 }} />

          {/* Usuario */}
          {usuario ? (
            <div style={{ background: "#1a1a26", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#e63946,#9b59b6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff" }}>
                  {usuario.nombre?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#f0f0f5" }}>{usuario.nombre}</p>
                  <p style={{ fontSize: 12, color: "#5a5a75" }}>{usuario.email}</p>
                </div>
              </div>
              <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(230,57,70,0.12)", border: "1px solid rgba(230,57,70,0.25)", color: "#ff6b6b", fontFamily: "'Outfit', sans-serif", fontSize: 14, padding: "10px", borderRadius: 8, cursor: "pointer" }}>
                <LogOut size={15} /> Cerrar sesión
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <div style={{ background: "#e63946", color: "#fff", borderRadius: 10, padding: "13px", textAlign: "center", fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600 }}>
                  Iniciar sesión
                </div>
              </Link>
              <Link to="/registro" style={{ textDecoration: "none" }}>
                <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0f0f5", borderRadius: 10, padding: "13px", textAlign: "center", fontFamily: "'Outfit', sans-serif", fontSize: 15 }}>
                  Crear cuenta
                </div>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Bottom nav móvil */}
      <BottomNav />
    </>
  );
};

export default Navbar;
