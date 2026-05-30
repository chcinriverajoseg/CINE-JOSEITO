import React, { useState } from "react";
import ReactPlayer from "react-player";

const channels = [
  {
    name: "DW Español",
    url: "https://dwamdstream104.akamaized.net/hls/live/2015525/dwstream104/stream05.m3u8",
  },
  {
    name: "Canal 22 México",
    url: "https://livestreamcdn.net:444/hls/Canal22.m3u8",
  },
  {
    name: "NASA TV",
    url: "https://nasa-i.akamaihd.net/hls/live/253565/NASA-NTV/master.m3u8",
  },
  {
    name: "Red Bull TV",
    url: "https://rbmn-live.akamaized.net/hls/live/590964/Live_1/index.m3u8",
  },
  { 
    //...
    name: "Pluto TV",
    url: "https://plutotv.com/live/channel-url-here",
  },
  {
    name: "Tubi TV",
    url: "https://tubitv.com/live/channel-url-here",
  },
    //...
  
];

// Canales Calientes (contenido "picante")
const hotChannels = [
  {
    name: "Canal 69",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  },
  {
    name: "Chili TV",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  },
];

const LivePage = () => {
  const [currentChannel, setCurrentChannel] = useState(channels[0].url); // Canal por defecto
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5); // Volumen inicial

  const handleChannelChange = (url) => {
    setCurrentChannel(url); // Cambiar el canal
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying); // Alternar entre Play y Pause
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value); // Cambiar el volumen
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Selecciona un Canal</h1>

      {/* Lista de canales */}
      <div className="flex space-x-4 mb-6">
        {channels.map((channel, index) => (
          <button
            key={index}
            onClick={() => handleChannelChange(channel.url)} // Cambiar canal al hacer click
            className="p-2 bg-blue-500 text-white rounded"
          >
            {channel.name}
          </button>
        ))}
      </div>

      {/* Canales Calientes (extra) */}
      <h2 className="text-xl font-bold mb-4">🔥 Canales Calientes 🔥</h2>
      <div className="flex space-x-4 mb-6">
        {hotChannels.map((channel, index) => (
          <button
            key={index}
            onClick={() => handleChannelChange(channel.url)} // Cambiar canal caliente al hacer click
            className="p-2 bg-red-500 text-white rounded"
          >
            {channel.name}
          </button>
        ))}
      </div>

      {/* Reproductor de video */}
      <div className="relative">
        <ReactPlayer
          url={currentChannel}
          playing={isPlaying}
          volume={volume}
          controls={false} // Ocultar controles predeterminados
          width="100%"
          height="auto"
        />

        {/* Controles debajo del reproductor */}
        <div className="absolute bottom-2 left-2 w-full bg-black bg-opacity-50 text-white p-2 rounded flex justify-between items-center">
          {/* Botón de Play/Pause */}
          <button
            onClick={handlePlayPause}
            className="p-2 bg-blue-500 rounded"
          >
            {isPlaying ? "Pausa" : "Reproducir"}
          </button>

          {/* Control de Volumen */}
          <div className="flex items-center space-x-2">
            <span>Volumen</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24"
            />
            <span>{Math.round(volume * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePage;
