import mongoose from 'mongoose';

const peliculaSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  desc:        { type: String, default: '' },
  emoji:       { type: String, default: '🎬' },
  year:        { type: Number, default: 2024 },
  genre:       { type: String, default: 'Sin género' },
  rating:      { type: Number, default: 0 },
  nuevo:       { type: Boolean, default: false },
  url:         { type: String, required: true },
  posterUrl:   { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Pelicula', peliculaSchema);
