// src/pages/LiveTV.jsx
import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const LiveTV = () => {
  const videoRef = useRef(null);
  const streamUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"; // URL de ejemplo

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);
      return () => {
        hls.destroy();
      };
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = streamUrl;
    }
  }, [streamUrl]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📺 Cine JOSEITO - En Vivo</h2>
      <video
        ref={videoRef}
        controls
        className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
      ></video>
    </div>
  );
};

export default LiveTV;
