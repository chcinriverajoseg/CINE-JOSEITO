import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import peliculasRoutes from './routes/peliculas.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/peliculas', peliculasRoutes);

mongoose
  .connect('mongodb://localhost:27017/cine-joseito')
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
  })
  .catch((error) => console.error('Error de conexión a MongoDB:', error));
