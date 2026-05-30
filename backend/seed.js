import mongoose from 'mongoose';
import Canal from './models/Canal.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cine-joseito';

// youtubeChannelId = ID del canal de YouTube (UCxxxx...)
// youtubeVideoId   = ID de un video/stream específico embebible
const canales = [
  // Noticias — Channel IDs verificados
  { name: 'DW Español',        categoria: 'Noticias',        emoji: '🌍', live: true,  youtubeChannelId: 'UCp5LGzZNNOgqtfqy2bDGssg', youtubeVideoId: 'SarLSQMvVxQ' },
  { name: 'France 24 Español', categoria: 'Noticias',        emoji: '📺', live: true,  youtubeChannelId: 'UCO6K8dBMWx8mYaEfFPGJToA', youtubeVideoId: '1MNd0dl2LA8' },
  { name: 'Euronews Español',  categoria: 'Noticias',        emoji: '🗞️', live: true,  youtubeChannelId: 'UCBmgnmMtDHGMPn7GFYdBt_g', youtubeVideoId: 'HWJMpoazOhA' },
  { name: 'NTN24',             categoria: 'Noticias',        emoji: '📡', live: true,  youtubeChannelId: 'UCef1bMTlB5u7HxJ6cNE5Xpg', youtubeVideoId: 'xqzCLvuZnFk' },
  // Ciencia / Naturaleza
  { name: 'NASA TV',           categoria: 'Ciencia',         emoji: '🚀', live: true,  youtubeChannelId: 'UCLA_DiR1FfKNvjuUpBHmylQ', youtubeVideoId: '21X5lGlDOfg' },
  { name: 'Nature Relax',      categoria: 'Naturaleza',      emoji: '🌿', live: true,  youtubeChannelId: 'UCLXo7UDZvByw2ixzpQCufnA', youtubeVideoId: 'BHACKCNDMW8' },
  { name: 'Space & Universe',  categoria: 'Ciencia',         emoji: '🌌', live: true,  youtubeChannelId: 'UCpRnX5qFEMqUKKarGzg3ADQ', youtubeVideoId: 'nA9UZF-SZoQ' },
  // Música
  { name: 'Lofi Hip Hop',      categoria: 'Música',          emoji: '🎧', live: true,  youtubeChannelId: 'UCSJ4gkVC6NrvII8umztf0Ow', youtubeVideoId: 'jfKfPfyJRdk' },
  { name: 'Lofi Girl Study',   categoria: 'Música',          emoji: '🎵', live: true,  youtubeChannelId: 'UCSJ4gkVC6NrvII8umztf0Ow', youtubeVideoId: '5qap5aO4i9A' },
  // Entretenimiento
  { name: 'Red Bull TV',       categoria: 'Deportes',        emoji: '🏆', live: true,  youtubeChannelId: 'UCblfuW_4rakIf2h6aqANefA', youtubeVideoId: 'HQfkfwEjKf4' },
  { name: 'Earthcam NYC',      categoria: 'Entretenimiento', emoji: '🌏', live: true,  youtubeChannelId: 'UCG-MbCGmZQfOiUqiOk5XQUA', youtubeVideoId: 'DOe-HFE99R4' },
  { name: 'Ambient Worlds',    categoria: 'Entretenimiento', emoji: '✨', live: true,  youtubeChannelId: 'UCxNSTuSCHt-iGSO0FCST2hw', youtubeVideoId: 'Ee7-yTFEzgQ' },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB conectado');
  await Canal.deleteMany({});
  await Canal.insertMany(canales);
  console.log(`📡 ${canales.length} canales insertados`);
  await mongoose.disconnect();
  console.log('✅ Listo');
}

seed().catch(err => { console.error(err); process.exit(1); });
