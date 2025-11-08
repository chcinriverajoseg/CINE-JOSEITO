import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard'; // Si tienes un componente para mostrar las películas

const HomePage = () => {
  const [movies, setMovies] = useState([]); // El estado para guardar las películas

  useEffect(() => {
    fetch("http://localhost:5000/api/peliculas")  // Cambié 3001 a 5000
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
      })
      .catch((error) => console.error("Error al cargar las películas:", error));
  }, []);
  
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bienvenido a Cine JOSEITO 🎥</h1>
      <p className="mb-6">Explora las películas más populares.</p>

      <div className="flex flex-wrap justify-center">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} /> // Aquí usas tu componente MovieCard para mostrar las películas
        ))}
      </div>
    </div>
  );
};

export default HomePage;