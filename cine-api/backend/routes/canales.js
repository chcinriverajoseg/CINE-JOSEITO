import express from 'express';
import Canal from '../models/Canal.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const canales = await Canal.find();
    res.json(canales);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los canales' });
  }
});

export default router;
