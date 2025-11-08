import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function SeriesPage() {
  const [series, setSeries] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('/api/series')
      .then(response => response.json())
      .then(data => {
        setSeries(data);
        setCargando(false);
      })
      .catch(error => {
        console.error('Error al cargar series:', error);
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <div className="text-center mt-10 text-xl font-bold text-white">Cargando series...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {series.map(serie => (
        <Link 
          to={`/series/${serie._id}`} 
          key={serie._id}
          className="bg-white rounded-lg shadow-md p-4 hover:scale-105 transition-transform"
        >
          <h2 className="text-lg font-semibold mb-2">{serie.titulo}</h2>
          <p className="text-gray-700">{serie.descripcion.slice(0, 60)}...</p>
        </Link>
      ))}
    </div>
  );
}

export default SeriesPage;
