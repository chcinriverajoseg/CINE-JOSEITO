import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function DetallesPage() {
  const { id } = useParams();
  const [pelicula, setPelicula] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/peliculas/${id}`)
      .then(response => response.json())
      .then(data => {
        setPelicula(data);
        setCargando(false);
      })
      .catch(error => {
        console.error('Error al obtener película:', error);
        setCargando(false);
      });
  }, [id]);

  if (cargando) return <div className="text-center text-white mt-10">Cargando detalles...</div>;
  if (!pelicula) return <div className="text-center text-red-500 mt-10">Película no encontrada</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white rounded-xl shadow-md">
      {pelicula.imagen && (
        <img
          src={pelicula.imagen}
          alt={pelicula.titulo}
          className="w-full h-96 object-cover rounded-md mb-6"
        />
      )}
      <h1 className="text-3xl font-bold mb-2">{pelicula.titulo}</h1>
      <p className="text-sm text-gray-500 mb-4">Categoría: {pelicula.categoria || 'Sin categoría'}</p>
      <p className="text-gray-700">{pelicula.descripcion}</p>
    </div>
  );
}

export default DetallesPage;
