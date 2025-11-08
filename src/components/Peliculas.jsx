import { useEffect, useState } from 'react';

function Peliculas() {
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/api/peliculas')
      .then(response => response.json())
      .then(data => {
        setPeliculas(data);
        setCargando(false);
      })
      .catch(error => {
        console.error('Error al cargar películas:', error);
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <div className="text-center mt-10 text-xl font-bold">Cargando películas...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
      {peliculas.map(pelicula => (
        <div key={pelicula._id} className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-2">{pelicula.titulo}</h2>
          <p className="text-gray-600">{pelicula.descripcion}</p>
          <a href={pelicula.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-2 block">
            Ver trailer
          </a>
        </div>
      ))}
    </div>
  );
}

export default Peliculas;
