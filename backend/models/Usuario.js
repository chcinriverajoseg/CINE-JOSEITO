import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
  nombre:    { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true, minlength: 6 },
  favoritos: [
    {
      _id:   { type: String, required: true },
      title: String,
      emoji: String,
      year:  Number,
      genre: String,
      rating: Number,
      nuevo:  Boolean,
      _tipo:  { type: String, enum: ['pelicula', 'serie'] },
    }
  ],
}, { timestamps: true });

// Hash password antes de guardar
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Comparar password
usuarioSchema.methods.compararPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema);;
