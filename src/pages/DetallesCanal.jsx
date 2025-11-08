import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function DetallesCanal() {
  const { id } = useParams();
  const [canal, setCanal] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/canales/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCanal(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al obtener el canal:", error);
        setCargando(false);
      });
  }, [id]);

  if (cargando) return <div className="text-white text-center mt-10">Cargando canal...</div>;
  if (!canal) return <div className="text-red-500 text-center mt-10">Canal no encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white rounded-xl shadow-md">
      {canal.logo && (
        <img
          src={canal.logo}
          alt={canal.nombre}
          className="w-full h-64 object-contain rounded-md mb-6"
        />
      )}
      <h1 className="text-3xl font-bold mb-2">{canal.nombre}</h1>
      <p className="text-sm text-gray-500 mb-4">Categoría: {canal.categoria || "Sin categoría"}</p>
      <p className="text-gray-700 mb-4">{canal.descripcion}</p>

      {canal.url && (
        <video
          src={canal.url}
          controls
          className="w-full rounded-md border border-gray-300"
        />
      )}
    </div>
  );
}

export default DetallesCanal;
