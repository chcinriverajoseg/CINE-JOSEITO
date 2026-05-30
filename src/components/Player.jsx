import React from "react";

const Player = ({ streamUrl }) => {
  return (
    <div className="w-full md:w-2/3 p-4">
      <h2 className="text-xl font-bold mb-4">Reproductor</h2>
      {streamUrl ? (
        <video controls autoPlay className="w-full h-96 bg-black rounded">
          <source src={streamUrl} type="application/x-mpegURL" />
          Tu navegador no soporta el video.
        </video>
      ) : (
        <p>Selecciona un canal para comenzar a ver.</p>
      )}
    </div>
  );
};

export default Player;
