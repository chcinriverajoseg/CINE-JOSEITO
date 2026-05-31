import mongoose from 'mongoose';

const episodioSchema = new mongoose.Schema({
  num:   { type: Number, required: true },
  title: { type: String, required: true },
  dur:   { type: String, default: '45 min' },
  url:   { type: String, required: true },
});

const temporadaSchema = new mongoose.Schema({
  num:       { type: Number, required: true },
  episodios: [episodioSchema],
});

const serieSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  desc:        { type: String, default: '' },
  emoji:       { type: String, default: '📺' },
  year:        { type: Number, default: 2024 },
  genre:       { type: String, default: 'Sin género' },
  rating:      { type: Number, default: 0 },
  seasons:     { type: Number, default: 1 },
  nuevo:       { type: Boolean, default: false },
  url:         { type: String, default: '' },
  posterUrl:   { type: String, default: '' },
  temporadas:  [temporadaSchema],
}, { timestamps: true });

export default mongoose.models.Serie || mongoose.model('Serie', serieSchema);
