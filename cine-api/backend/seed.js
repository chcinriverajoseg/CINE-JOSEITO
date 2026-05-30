// seed.js
import mongoose from 'mongoose';
import Pelicula from './models/Pelicula.js';
import Serie from './models/Serie.js';
import Canal from './models/Canal.js';

const MONGODB_URI = 'mongodb://localhost:27017/cine_joseito';

const peliculas = [
  { titulo: 'Avengers: Endgame', descripcion: 'Los Vengadores se enfrentan a Thanos.', url: 'https://example.com/avengers-endgame' },
  { titulo: 'Joker', descripcion: 'Historia de origen del villano Joker.', url: 'https://example.com/joker' },
  { titulo: 'Interstellar', descripcion: 'Un viaje a través del espacio y el tiempo.', url: 'https://example.com/interstellar' },
  { titulo: 'Inception', descripcion: 'Un ladrón que roba secretos a través de sueños.', url: 'https://example.com/inception' },
  { titulo: 'The Batman', descripcion: 'Nueva versión oscura del caballero de la noche.', url: 'https://example.com/the-batman' },
  { titulo: 'Black Panther', descripcion: 'El rey de Wakanda debe defender su nación.', url: 'https://example.com/black-panther' },
  { titulo: 'Toy Story 4', descripcion: 'Nueva aventura de Woody y Buzz.', url: 'https://example.com/toy-story-4' },
  { titulo: 'Frozen II', descripcion: 'Elsa y Anna descubren los orígenes de los poderes.', url: 'https://example.com/frozen-ii' },
  { titulo: 'Top Gun: Maverick', descripcion: 'Regreso de Maverick a los cielos.', url: 'https://example.com/top-gun-maverick' },
  { titulo: 'Avatar: El camino del agua', descripcion: 'Secuela del universo de Pandora.', url: 'https://example.com/avatar2' },
];

const series = [
  { titulo: 'Stranger Things', descripcion: 'Aventuras sobrenaturales en Hawkins.', url: 'https://example.com/stranger-things' },
  { titulo: 'The Witcher', descripcion: 'Un cazador de monstruos en un mundo brutal.', url: 'https://example.com/the-witcher' },
  { titulo: 'The Mandalorian', descripcion: 'Un cazarrecompensas en el universo Star Wars.', url: 'https://example.com/the-mandalorian' },
  { titulo: 'Game of Thrones', descripcion: 'Batallas por el trono de hierro.', url: 'https://example.com/game-of-thrones' },
  { titulo: 'Breaking Bad', descripcion: 'Un profesor de química se convierte en narcotraficante.', url: 'https://example.com/breaking-bad' },
  { titulo: 'Better Call Saul', descripcion: 'Historia previa de Saul Goodman.', url: 'https://example.com/better-call-saul' },
  { titulo: 'Loki', descripcion: 'El dios del engaño viaja por el multiverso.', url: 'https://example.com/loki' },
  { titulo: 'The Boys', descripcion: 'Superhéroes corruptos contra vigilantes.', url: 'https://example.com/the-boys' },
  { titulo: 'The Last of Us', descripcion: 'Basado en el famoso videojuego.', url: 'https://example.com/the-last-of-us' },
  { titulo: 'Peaky Blinders', descripcion: 'Mafiosos en el Birmingham de 1920.', url: 'https://example.com/peaky-blinders' },
];

const canales = [
  { nombre: 'HBO', categoria: 'Películas y series', url: 'https://hbo.com/stream' },
  { nombre: 'ESPN', categoria: 'Deportes', url: 'https://espn.com/stream' },
  { nombre: 'Disney Channel', categoria: 'Infantil', url: 'https://disneychannel.com/stream' },
  { nombre: 'CNN', categoria: 'Noticias', url: 'https://cnn.com/stream' },
  { nombre: 'Cartoon Network', categoria: 'Animación', url: 'https://cartoonnetwork.com/stream' },
  { nombre: 'Discovery Channel', categoria: 'Documentales', url: 'https://discovery.com/stream' },
  { nombre: 'FOX Sports', categoria: 'Deportes', url: 'https://foxsports.com/stream' },
  { nombre: 'National Geographic', categoria: 'Ciencia y naturaleza', url: 'https://natgeo.com/stream' },
  { nombre: 'MTV', categoria: 'Música', url: 'https://mtv.com/stream' },
  { nombre: 'History Channel', categoria: 'Historia', url: 'https://historychannel.com/stream' },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Limpiar datos anteriores
    await Pelicula.deleteMany();
    await Serie.deleteMany();
    await Canal.deleteMany();

    // Insertar nuevos datos
    await Pelicula.insertMany(peliculas);
    await Serie.insertMany(series);
    await Canal.insertMany(canales);

    console.log('✅ Base de datos sembrada con datos de prueba');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sembrar la base de datos:', error);
    process.exit(1);
  }
}

seedDatabase();
