import express from 'express';
import Serie from '../models/Serie.js';

const router = express.Router();

// GET /api/series — todas
router.get('/', async (req, res) => {
  try {
    const { genre } = req.query;
    const filtro = genre && genre !== 'Todos' ? { genre } : {};
    const series = await Serie.find(filtro).sort({ createdAt: -1 });
    res.json(series);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las series' });
  }
});

// GET /api/series/:id — una
router.get('/:id', async (req, res) => {
  try {
    const serie = await Serie.findById(req.params.id);
    if (!serie) return res.status(404).json({ error: 'Serie no encontrada' });
    res.json(serie);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener la serie' });
  }
});

export default router;
