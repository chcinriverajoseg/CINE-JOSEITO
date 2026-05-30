import mongoose from 'mongoose';

const canalSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },
  url: { type: String, required: true }
});

const Canal = mongoose.model('Canal', canalSchema);

export default Canal;
