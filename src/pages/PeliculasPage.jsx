import React, { useEffect, useState } from 'react';

const PeliculasPage = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/peliculas') // Asegúrate que el puerto sea correcto
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al obtener las películas');
        }
        return res.json();
      })
      .then((data) => {
        setPeliculas(data);
      })
      .catch((err) => {
        console.error('Error al obtener películas:', err);
        setError(err.message);
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Películas</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {peliculas.map((pelicula) => (
          <li key={pelicula._id} className="bg-gray-100 p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{pelicula.titulo}</h2>
            <p>{pelicula.descripcion}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PeliculasPage;
