

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function DetallesSerie() {
  const { id } = useParams();
  const [serie, setSerie] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/series/${id}`)
      .then(response => response.json())
      .then(data => {
        setSerie(data);
        setCargando(false);
      })
      .catch(error => {
        console.error('Error al obtener serie:', error);
        setCargando(false);
      });
  }, [id]);

  if (cargando) return <div className="text-center text-white mt-10">Cargando detalles...</div>;
  if (!serie) return <div className="text-center text-red-500 mt-10">Serie no encontrada</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white rounded-xl shadow-md">
      {serie.imagen && (
        <img
          src={serie.imagen}
          alt={serie.titulo}
          className="w-full h-96 object-cover rounded-md mb-6"
        />
      )}
      <h1 className="text-3xl font-bold mb-2">{serie.titulo}</h1>
      <p className="text-sm text-gray-500 mb-4">Categoría: {serie.categoria || 'Sin categoría'}</p>
      <p className="text-gray-700">{serie.descripcion}</p>
    </div>
  );
}

export default DetallesSerie;
