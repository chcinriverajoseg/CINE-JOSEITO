<<<<<<< HEAD
import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import { motion } from "framer-motion";

const VideoPlayer = ({ titulo, url }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!url || !videoRef.current) return;

    const video = videoRef.current;

    if (Hls.isSupported() && url.includes(".m3u8")) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      return () => hls.destroy();
    } else {
      video.src = url;
    }
  }, [url]);

=======
import { motion } from "framer-motion";

const VideoPlayer = ({ titulo, url }) => {
>>>>>>> 20bc9f11e13453c9cca995fc40d9c8914477a18e
  if (!url) return null;

  return (
    <motion.div
<<<<<<< HEAD
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ marginTop: 24 }}
    >
      {titulo && (
        <p style={{ fontSize: 14, color: "#9898b0", marginBottom: 10 }}>
          🎬 Reproduciendo: <strong style={{ color: "#f0f0f5" }}>{titulo}</strong>
        </p>
      )}
      <video
        ref={videoRef}
        controls
        autoPlay
        style={{
          width: "100%", borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "#000", aspectRatio: "16/9",
        }}
=======
      className="mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-2">🎬 Reproduciendo: {titulo}</h2>
      <video
        className="w-full rounded-2xl border border-gray-700 shadow-lg"
        controls
        autoPlay
        src={url}
>>>>>>> 20bc9f11e13453c9cca995fc40d9c8914477a18e
      >
        Tu navegador no soporta la reproducción de video.
      </video>
    </motion.div>
  );
};

export default VideoPlayer;
