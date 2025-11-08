// seedPeliculas.js
import mongoose from 'mongoose';
import Pelicula from './models/Pelicula.js';


const peliculas = [
  {
    titulo: 'Inception',
    descripcion: 'Un ladrón que roba secretos corporativos mediante el uso de la tecnología de los sueños.',
    imagen: 'https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
    categoria: 'Ciencia Ficción',
    anio: 2010,
    duracion: '2h 28min'
  },
  {
    titulo: 'The Matrix',
    descripcion: 'Un hacker descubre la verdadera naturaleza de su realidad y su papel en la guerra contra sus controladores.',
    imagen: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    categoria: 'Acción',
    anio: 1999,
    duracion: '2h 16min'
  },
  {
    titulo: 'Titanic',
    descripcion: 'Una joven aristócrata se enamora de un artista pobre a bordo del lujoso e infortunado R.M.S. Titanic.',
    imagen: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
    categoria: 'Romance',
    anio: 1997,
    duracion: '3h 14min'
  },
  {
    titulo: 'Avengers: Endgame',
    descripcion: 'Los Vengadores restantes deben luchar para revertir el daño causado por Thanos.',
    imagen: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    categoria: 'Superhéroes',
    anio: 2019,
    duracion: '3h 1min'
  },
  {
    titulo: 'Interstellar',
    descripcion: 'Un grupo de exploradores viajan a través de un agujero de gusano en el espacio.',
    imagen: 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
    categoria: 'Ciencia Ficción',
    anio: 2014,
    duracion: '2h 49min'
  },
  {
    titulo: 'The Dark Knight',
    descripcion: 'Batman se enfrenta al Joker, un criminal despiadado que siembra el caos en Gotham.',
    imagen: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    categoria: 'Acción',
    anio: 2008,
    duracion: '2h 32min'
  },
  {
    titulo: 'Forrest Gump',
    descripcion: 'Un hombre con un bajo coeficiente intelectual vive momentos clave de la historia estadounidense.',
    imagen: 'https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg',
    categoria: 'Drama',
    anio: 1994,
    duracion: '2h 22min'
  },
  {
    titulo: 'Gladiator',
    descripcion: 'Un general romano es traicionado y se convierte en gladiador para vengarse.',
    imagen: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
    categoria: 'Histórica',
    anio: 2000,
    duracion: '2h 35min'
  },
  {
    titulo: 'Avatar',
    descripcion: 'Un ex marine se ve atrapado en medio de un conflicto en un planeta alienígena.',
    imagen: 'https://image.tmdb.org/t/p/w500/kmcqlZGaSh20zpTbuoF0Cdn07dT.jpg',
    categoria: 'Fantasía',
    anio: 2009,
    duracion: '2h 42min'
  },
  {
    titulo: 'Joker',
    descripcion: 'Un hombre con trastornos mentales se convierte en el famoso villano de Gotham.',
    imagen: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
    categoria: 'Thriller',
    anio: 2019,
    duracion: '2h 2min'
  }
];


mongoose.connect('mongodb://localhost:27017/cine_joseito')
  .then(async () => {
    console.log('✅ Conectado a MongoDB para insertar películas');
    await Pelicula.deleteMany({});
    await Pelicula.insertMany(peliculas);
    console.log('✅ Películas insertadas correctamente');
    mongoose.disconnect();
  })
  .catch((err) => console.error('❌ Error:', err));



const MONGO_URI = 'mongodb://localhost:27017/cine_joseito';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('✅ Conectado a MongoDB para insertar películas');

  const peliculas = [
    {
      titulo: "El Padrino",
      descripcion: "Un drama criminal épico sobre una familia mafiosa.",
      url: "https://url-de-ejemplo.com/padrino.mp4"
    },
    {
      titulo: "Interestelar",
      descripcion: "Una aventura espacial que explora agujeros negros y el amor.",
      url: "https://url-de-ejemplo.com/interestelar.mp4"
    },
    {
      titulo: "Matrix",
      descripcion: "Un hacker descubre la verdad detrás de su realidad.",
      url: "https://url-de-ejemplo.com/matrix.mp4"
    }
  ];

  try {
    await Pelicula.deleteMany({});
    await Pelicula.insertMany(peliculas);
    console.log('✅ Películas insertadas correctamente');
  } catch (error) {
    console.error('❌ Error al insertar películas:', error);
  } finally {
    mongoose.disconnect();
  }
}).catch(err => {
  console.error('❌ Error al conectar a MongoDB:', err);
});
