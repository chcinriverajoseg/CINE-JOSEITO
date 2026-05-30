// models/Serie.js
import mongoose from 'mongoose';

const SerieSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  imagenUrl: String // nuevo campo
});

export default mongoose.model('Serie', SerieSchema);
