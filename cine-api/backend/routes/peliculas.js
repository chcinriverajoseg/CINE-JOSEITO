import express from 'express';
import Pelicula from '../models/Pelicula.js';

const router = express.Router();

// Obtener todas las películas
router.get('/', async (req, res) => {
  try {
    const peliculas = await Pelicula.find();
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las películas' });
  }
});

// Obtener una película por ID
router.get('/:id', async (req, res) => {
  try {
    const pelicula = await Pelicula.findById(req.params.id);
    if (pelicula) {
      res.json(pelicula);
    } else {
      res.status(404).json({ error: 'Película no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la película' });
  }
});

export default router;
