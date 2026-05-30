import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import peliculasRoutes from './routes/peliculas.js'; // asegúrate de tener la ruta correcta

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 👇 Esta línea es la que registra la ruta '/peliculas'
app.use('/peliculas', peliculasRoutes);

// Conexión a MongoDB y arranque del servidor
mongoose.connect('mongodb://localhost:27017/cine', {
  // useNewUrlParser y useUnifiedTopology ya no son necesarios en versiones recientes
})
.then(() => {
  console.log('✅ Conectado a MongoDB');
  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  });
})
.catch((error) => {
  console.error('❌ Error al conectar a MongoDB:', error);
});
