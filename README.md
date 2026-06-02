# 🎬 CINE-JOSEITO

App fullstack de streaming tipo Netflix — películas, series, canales IPTV y clásicos de Archive.org. Construida con React + Node.js + Express + MongoDB.

🌐 **[Demo en vivo](https://cine-joseito.vercel.app)**

---

## 🧪 Credenciales de prueba
Email:    demo@test.com
Password: 123456

---

## ✨ Funcionalidades

- 🔐 **Registro e inicio de sesión** con JWT
- 🎥 **Películas** — Catálogo con paginación infinita y filtros
- 📺 **Series** — Catálogo con episodios
- 📡 **Canales IPTV** — Canales en vivo
- 🎞️ **WikiFlix** — Clásicos de Archive.org con reproductor real
- 🔍 **Búsqueda avanzada** con filtros
- ❤️ **Favoritos** — Sincronizados con el backend
- 🔒 **Rutas protegidas** por autenticación

---

## 🛠️ Stack tecnológico

### Frontend
| Tecnología | Uso |
|---|---|
| React + Vite | Interfaz de usuario |
| React Router v6 | Navegación y rutas protegidas |
| TMDB API | Datos de películas y series |
| Archive.org API | Contenido clásico |
| Context API | Sesión y favoritos globales |

### Backend
| Tecnología | Uso |
|---|---|
| Node.js + Express | Servidor y API REST |
| MongoDB + Mongoose | Base de datos |
| JWT | Autenticación con tokens |
| bcrypt | Encriptación de contraseñas |

---

## 🔌 API Endpoints

### Autenticación
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/registro` | Crear cuenta |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/perfil` | Obtener perfil |
| PUT | `/api/auth/favoritos` | Sincronizar favoritos |

### Contenido
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/peliculas` | Listar películas |
| GET | `/api/series` | Listar series |
| GET | `/api/canales` | Listar canales |
| GET | `/api/health` | Health check |

---

## 🚀 Instalación local

```bash
git clone https://github.com/chcinriverajoseg/CINE-JOSEITO.git

# Backend
cd backend
npm install
# Configura .env con MONGO_URI, JWT_SECRET y FRONTEND_URL
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

---

## 🌐 Variables de entorno

### Frontend `.env`

VITE_TMDB_TOKEN=    # Bearer token de TMDB
VITE_API_URL=       # URL del backend

### Backend `.env`

PORT=
MONGO_URI=
JWT_SECRET=
FRONTEND_URL=

---

## 👨‍💻 Autor

**Jose Gregorio Chacin**
- GitHub: [@chcinriverajoseg](https://github.com/chcinriverajoseg)

---

## 📄 Licencia

MIT License
