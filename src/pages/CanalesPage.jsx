import { useEffect, useState } from 'react';

function CanalesPage() {
  const [canales, setCanales] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/api/canales')
      .then(response => response.json())
      .then(data => {
        setCanales(data);
        setCargando(false);
      })
      .catch(error => {
        console.error('Error al cargar canales:', error);
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <div className="text-center mt-10 text-xl font-bold text-white">Cargando canales...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4">
      {canales.map(canal => (
        <div 
          key={canal._id}
          className="bg-white rounded-lg shadow-md p-4 hover:scale-105 transition-transform"
        >
          <h2 className="text-lg font-semibold mb-2">{canal.nombre}</h2>
          <p className="text-gray-700">{canal.categoria}</p>
          <a 
            href={canal.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 underline mt-2 block"
          >
            Ver Canal
          </a>
        </div>
      ))}
    </div>
  );
}

export default CanalesPage;
