import { useState } from "react";
import axios from "axios";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);

  const searchMovies = async () => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=$0d013ac4835659bed52f56a55168dfe0&query=${query}`;

    try {
      const response = await axios.get(url);
      setMovies(response.data.results);
    } catch (error) {
      console.error("Error al buscar películas:", error);
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        className="border p-2 w-full mb-4"
        placeholder="Buscar películas..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={searchMovies}
      >
        Buscar
      </button>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {movies.map((movie) => (
          <div key={movie.id} className="border p-2 rounded shadow">
            <h3 className="font-bold">{movie.title}</h3>
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
