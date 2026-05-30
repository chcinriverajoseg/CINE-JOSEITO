import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import peliculasRoutes from './routes/peliculas.js';
import seriesRoutes    from './routes/series.js';
import canalesRoutes   from './routes/canales.js';
import authRoutes      from './routes/auth.js';

const app        = express();
const PORT       = process.env.PORT     || 5000;
const MONGO_URI  = process.env.MONGO_URI || 'mongodb://localhost:27017/cine-joseito';
const FRONTEND   = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS — permite el frontend en desarrollo y producción
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    FRONTEND,
    /\.vercel\.app$/,      // cualquier subdominio de vercel
  ],
  credentials: true,
}));

app.use(express.json());

// Rutas
app.use('/api/peliculas', peliculasRoutes);
app.use('/api/series',    seriesRoutes);
app.use('/api/canales',   canalesRoutes);
app.use('/api/auth',      authRoutes);

// Health check para Railway
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// 404
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
    app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Error MongoDB:', err.message);
    process.exit(1);
  });
