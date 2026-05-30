import express from 'express';
import Serie from '../models/Serie.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const series = await Serie.find();
    res.json(series);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las series' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const serie = await Serie.findById(req.params.id);
    if (serie) {
      res.json(serie);
    } else {
      res.status(404).json({ error: 'Serie no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la serie' });
  }
});

export default router;
