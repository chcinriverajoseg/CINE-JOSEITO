import { useEffect, useState } from "react";
import { PlayCircle, Tv, Loader } from "lucide-react";

const Canales = () => {
  const [canales, setCanales] = useState([]);
  const [canalActual, setCanalActual] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/canales")
      .then((res) => res.json())
      .then((data) => setCanales(data));
  }, []);

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <Tv className="text-blue-400" /> Lista de Canales IPTV
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {canales.map((canal) => (
          <div
            key={canal.id}
            className="bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => setCanalActual(canal)}
          >
            <h3 className="text-lg font-bold">{canal.nombre}</h3>
            <p className="text-sm text-gray-400">{canal.categoria}</p>
            <PlayCircle className="mt-2 text-green-400" />
          </div>
        ))}
      </div>

      {canalActual && (
        <div className="mt-6 bg-gray-900 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2 text-white">
            Reproduciendo: {canalActual.nombre}
          </h2>
          <video
            className="w-full rounded-lg border border-gray-700"
            controls
            autoPlay
            src={canalActual.url}
          >
            Tu navegador no soporta la reproducción de video.
          </video>
        </div>
      )}

      {canales.length === 0 && (
        <div className="mt-4 text-center text-gray-400 flex justify-center items-center gap-2">
          <Loader className="animate-spin" /> Cargando canales...
        </div>
      )}
    </div>
  );
};

export default Canales;
