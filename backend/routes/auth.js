import express from 'express';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'cine-joseito-secret-dev';

const signToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, nombre: user.nombre }, JWT_SECRET, { expiresIn: '7d' });

/* ── POST /api/auth/registro ──────────────────────────────────────── */
router.post('/registro', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password)
      return res.status(400).json({ error: 'Todos los campos son requeridos' });

    const existe = await Usuario.findOne({ email });
    if (existe)
      return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });

    const usuario = await Usuario.create({ nombre, email, password });
    res.status(201).json({ token: signToken(usuario), usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, favoritos: [] } });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

/* ── POST /api/auth/login ─────────────────────────────────────────── */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email y contraseña requeridos' });

    const usuario = await Usuario.findOne({ email });
    if (!usuario || !(await usuario.compararPassword(password)))
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });

    res.json({ token: signToken(usuario), usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, favoritos: usuario.favoritos } });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

/* ── GET /api/auth/perfil ─────────────────────────────────────────── */
router.get('/perfil', authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ id: usuario._id, nombre: usuario.nombre, email: usuario.email, favoritos: usuario.favoritos });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

/* ── PUT /api/auth/favoritos ── sincroniza favoritos del usuario ───── */
router.put('/favoritos', authMiddleware, async (req, res) => {
  try {
    const { favoritos } = req.body;
    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario.id,
      { favoritos },
      { new: true }
    ).select('-password');
    res.json({ favoritos: usuario.favoritos });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar favoritos' });
  }
});

export default router;
