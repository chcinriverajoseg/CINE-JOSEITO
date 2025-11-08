// src/components/MovieCard.jsx
import React from "react";

const MovieCard = ({ movie }) => {
  return (
    <div className="w-60 m-4 p-4 bg-white rounded shadow">
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-80 object-cover rounded"
      />
      <h2 className="mt-2 font-bold text-lg">{movie.title}</h2>
      <p className="text-sm">{movie.genre}</p>
    </div>
  );
};


export default MovieCard;
