import mongoose from 'mongoose';

const peliculaSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  imagen: String,
  anio: Number,
  genero: String
});

const Pelicula = mongoose.model('Pelicula', peliculaSchema);

export default Pelicula;
