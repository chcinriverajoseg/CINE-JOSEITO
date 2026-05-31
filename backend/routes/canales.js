import express from 'express';
import Canal from '../models/Canal.js';

const router = express.Router();

// GET /api/canales — todos
router.get('/', async (req, res) => {
  try {
    const { categoria } = req.query;
    const filtro = categoria && categoria !== 'Todos' ? { categoria } : {};
    const canales = await Canal.find(filtro).sort({ name: 1 });
    res.json(canales);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los canales' });
  }
});

// GET /api/canales/:id — uno
router.get('/:id', async (req, res) => {
  try {
    const canal = await Canal.findById(req.params.id);
    if (!canal) return res.status(404).json({ error: 'Canal no encontrado' });
    res.json(canal);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el canal' });
  }
});

export default router;
