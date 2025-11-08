import React from "react";
import { Link } from "react-router-dom";
import { Film, Tv, SatelliteDish } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="flex justify-center gap-8 text-blue-600 mb-6 bg-gray-200 p-4">

      <Link to="/" className="flex items-center gap-2 hover:underline">
        <Film size={20} /> Películas
      </Link>
      <Link to="/series" className="flex items-center gap-2 hover:underline">
        <Tv size={20} /> Series
      </Link>
      <Link to="/canales" className="flex items-center gap-2 hover:underline">
        <SatelliteDish size={20} /> Canales IPTV
      </Link>
    </nav>
  );
};

export default Navbar;

