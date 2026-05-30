/**
 * useArchive — Consume la API pública de Archive.org
 * Sin registro, sin API key, dominio público total.
 */
import { useState, useEffect } from 'react';

const BASE_SEARCH = 'https://archive.org/advancedsearch.php';
const BASE_STREAM = 'https://archive.org/download';
const BASE_META   = 'https://archive.org/metadata';

export const archiveThumb  = (id) => `https://archive.org/services/img/${id}`;
export const archiveStream = (id, file) =>
  file ? `${BASE_STREAM}/${id}/${file}` : `${BASE_STREAM}/${id}/${id}.mp4`;

/* ── Búsqueda en Archive.org ──────────────────────────────────────── */
async function doSearch(q, page = 1, rows = 24, sort = 'downloads+desc') {
  const fields = 'identifier,title,year,subject,description,creator,runtime';
  const url = `${BASE_SEARCH}?q=${encodeURIComponent(q)}&fl[]=${fields}&sort=${sort}&rows=${rows}&page=${page}&output=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Archive ${res.status}`);
  const json = await res.json();
  return json.response;
}

/* ── Queries predefinidas ─────────────────────────────────────────── */
const BASE_Q = `mediatype:movies AND year:[1888 TO 1929]`;

export const archive = {
  popular:     (page = 1)           => doSearch(`${BASE_Q} AND subject:"feature film"`, page, 24, 'downloads+desc'),
  byGenre:     (genre, page = 1)    => doSearch(`${BASE_Q} AND subject:"${genre}"`, page, 24, 'downloads+desc'),
  searchTitle: (title, page = 1)    => doSearch(`${BASE_Q} AND title:(${title})`, page, 24, 'downloads+desc'),
  byDecade:    (from, to, page = 1) => doSearch(`mediatype:movies AND year:[${from} TO ${to}]`, page, 24, 'downloads+desc'),

  detail: async (identifier) => {
    const res  = await fetch(`${BASE_META}/${identifier}`);
    if (!res.ok) throw new Error(`Archive meta ${res.status}`);
    const meta = await res.json();
    // Buscar el mejor archivo de video
    const pref  = ['.mp4', '.ogv', '.mpeg', '.mov'];
    const files = meta.files || [];
    let videoFile = null;
    for (const ext of pref) {
      const f = files.find(f =>
        f.name?.toLowerCase().endsWith(ext) &&
        !f.name.includes('512kb') &&
        !f.name.includes('_thumb') &&
        !f.name.includes('Sample')
      );
      if (f) { videoFile = f.name; break; }
    }
    return { ...meta, videoFile, streamUrl: archiveStream(identifier, videoFile) };
  },
};

/* ── Normalizar item ──────────────────────────────────────────────── */
const GENRE_MAP = {
  comedy: 'Comedia', horror: 'Terror', western: 'Western',
  documentary: 'Documental', drama: 'Drama', adventure: 'Aventura',
  romance: 'Romance', crime: 'Crimen', animation: 'Animación',
  'science fiction': 'Ciencia Ficción', mystery: 'Misterio',
};

export function normalizeArchive(item) {
  const subjects = Array.isArray(item.subject)
    ? item.subject
    : typeof item.subject === 'string' ? item.subject.split(';') : [];

  const genre = subjects.reduce((found, s) => {
    if (found) return found;
    const key = Object.keys(GENRE_MAP).find(k => s.toLowerCase().includes(k));
    return key ? GENRE_MAP[key] : null;
  }, null) || 'Clásico';

  return {
    _id:        item.identifier,
    title:      item.title || item.identifier,
    desc:       typeof item.description === 'string'
                  ? item.description.slice(0, 300)
                  : 'Película clásica de dominio público disponible en Archive.org.',
    year:       String(item.year || ''),
    genre,
    creator:    item.creator || '',
    runtime:    item.runtime || '',
    rating:     null,
    thumbUrl:   archiveThumb(item.identifier),
    identifier: item.identifier,
    isWikiflix: true,
    emoji:      '🎬',
  };
}

/* ── Hook React ───────────────────────────────────────────────────── */
export function useArchiveSearch({ genre = '', decade = null, page = 1, query = '' } = {}) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    let promise;
    if (query)        promise = archive.searchTitle(query, page);
    else if (genre)   promise = archive.byGenre(genre, page);
    else if (decade)  promise = archive.byDecade(decade.from, decade.to, page);
    else              promise = archive.popular(page);

    promise
      .then(r  => setData(r))
      .catch(e => setError(e.message))
      .finally(()=> setLoading(false));
  }, [genre, decade, page, query]);

  return { data, loading, error };
}
