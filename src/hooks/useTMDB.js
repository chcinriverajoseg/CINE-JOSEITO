const TOKEN = import.meta.env.VITE_TMDB_TOKEN || '';
const BASE  = 'https://api.themoviedb.org/3';
const IMG   = 'https://image.tmdb.org/t/p';

export const posterUrl   = (path, size = 'w342')  => path ? `${IMG}/${size}${path}` : null;
export const backdropUrl = (path, size = 'w1280') => path ? `${IMG}/${size}${path}` : null;

const headers = { 'Authorization': `Bearer ${TOKEN}`, 'accept': 'application/json' };

async function get(path, params = {}) {
  const query = new URLSearchParams({ language: 'es-MX', ...params }).toString();
  const res   = await fetch(`${BASE}${path}?${query}`, { headers });
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}

export const GENEROS_PELICULAS = [
  { id: '',    nombre: 'Todos' },
  { id: '28',  nombre: 'Acción' },
  { id: '35',  nombre: 'Comedia' },
  { id: '18',  nombre: 'Drama' },
  { id: '27',  nombre: 'Terror' },
  { id: '878', nombre: 'Ciencia Ficción' },
  { id: '53',  nombre: 'Thriller' },
  { id: '10749', nombre: 'Romance' },
  { id: '12',  nombre: 'Aventura' },
  { id: '16',  nombre: 'Animación' },
  { id: '80',  nombre: 'Crimen' },
  { id: '99',  nombre: 'Documental' },
  { id: '14',  nombre: 'Fantasía' },
  { id: '36',  nombre: 'Historia' },
  { id: '10752', nombre: 'Guerra' },
  { id: '37',  nombre: 'Western' },
];

export const GENEROS_SERIES = [
  { id: '',    nombre: 'Todos' },
  { id: '10759', nombre: 'Acción' },
  { id: '35',  nombre: 'Comedia' },
  { id: '18',  nombre: 'Drama' },
  { id: '9648', nombre: 'Misterio' },
  { id: '878', nombre: 'Ciencia Ficción' },
  { id: '10765', nombre: 'Fantasía' },
  { id: '80',  nombre: 'Crimen' },
  { id: '99',  nombre: 'Documental' },
  { id: '16',  nombre: 'Animación' },
  { id: '10751', nombre: 'Familia' },
  { id: '10762', nombre: 'Infantil' },
  { id: '10768', nombre: 'Guerra' },
];

export const tmdb = {
  // Películas con filtros reales
  discover: (page = 1, genreId = '', sortBy = 'popularity.desc', year = '') =>
    get('/discover/movie', {
      page,
      with_genres: genreId,
      sort_by: sortBy,
      ...(year ? { primary_release_year: year } : {}),
    }),

  trending:        ()           => get('/trending/movie/week'),
  popular:         (page = 1)   => get('/movie/popular',   { page }),
  topRated:        (page = 1)   => get('/movie/top_rated', { page }),
  upcoming:        (page = 1)   => get('/movie/upcoming',  { page }),
  movieDetail:     (id)         => get(`/movie/${id}`,     { append_to_response: 'videos,credits' }),
  movieSimilar:    (id)         => get(`/movie/${id}/similar`),

  // Series con filtros reales
  discoverTV: (page = 1, genreId = '', sortBy = 'popularity.desc') =>
    get('/discover/tv', { page, with_genres: genreId, sort_by: sortBy }),

  popularSeries:   (page = 1)   => get('/tv/popular',     { page }),
  topRatedSeries:  (page = 1)   => get('/tv/top_rated',   { page }),
  serieDetail:     (id)         => get(`/tv/${id}`,        { append_to_response: 'videos,credits' }),
  serieSeason:     (id, n)      => get(`/tv/${id}/season/${n}`),
  serieSimilar:    (id)         => get(`/tv/${id}/similar`),

  search: (q, page = 1) => get('/search/multi', { query: q, page }),
};

export function normalizeMovie(m) {
  return {
    _id:          String(m.id),
    title:        m.title || m.name,
    desc:         m.overview,
    year:         (m.release_date || m.first_air_date || '').slice(0, 4),
    rating:       Math.round((m.vote_average || 0) * 10) / 10,
    posterPath:   m.poster_path,
    backdropPath: m.backdrop_path,
    genreIds:     m.genre_ids || [],
    genre:        '',
    nuevo:        false,
    emoji:        '🎬',
  };
}

export function normalizeSerie(s) {
  return {
    _id:          String(s.id),
    title:        s.name || s.title,
    desc:         s.overview,
    year:         (s.first_air_date || '').slice(0, 4),
    rating:       Math.round((s.vote_average || 0) * 10) / 10,
    seasons:      s.number_of_seasons || 1,
    posterPath:   s.poster_path,
    backdropPath: s.backdrop_path,
    genreIds:     s.genre_ids || [],
    genre:        '',
    nuevo:        false,
    emoji:        '📺',
  };
}
