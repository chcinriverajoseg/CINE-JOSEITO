import express from 'express';
import Pelicula from '../models/Pelicula.js';

const router = express.Router();

// GET /api/peliculas — todas
router.get('/', async (req, res) => {
  try {
    const { genre } = req.query;
    const filtro = genre && genre !== 'Todos' ? { genre } : {};
    const peliculas = await Pelicula.find(filtro).sort({ createdAt: -1 });
    res.json(peliculas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las películas' });
  }
});

// GET /api/peliculas/:id — una
router.get('/:id', async (req, res) => {
  try {
    const pelicula = await Pelicula.findById(req.params.id);
    if (!pelicula) return res.status(404).json({ error: 'Película no encontrada' });
    res.json(pelicula);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener la película' });
  }
});

export default router;
