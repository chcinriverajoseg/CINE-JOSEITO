import { motion } from "framer-motion";

const VideoPlayer = ({ titulo, url }) => {
  if (!url) return null;

  return (
    <motion.div
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
      >
        Tu navegador no soporta la reproducción de video.
      </video>
    </motion.div>
  );
};

export default VideoPlayer;
