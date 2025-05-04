import React from "react";
import { useNavigate } from "react-router-dom";
import { FaGlobe, FaCity, FaUsers, FaFlag } from "react-icons/fa";

const CountryCard = ({ country }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/country/${country.cca3}`)}
      className="cursor-pointer bg-[#1a1a1a] hover:bg-[#222] text-white rounded-lg shadow hover:shadow-xl transition duration-300 overflow-hidden border border-[#2f2f2f]"
    >
      <img
        src={country.flags?.png}
        alt={`Flag of ${country.name.common}`}
        className="w-full h-40 object-cover border-b border-[#333]"
      />
      <div className="p-4 space-y-1">
        <h2 className="text-lg font-semibold text-[#06C167] flex items-center gap-2">
          <FaFlag className="text-[#06C167]" /> {country.name.common}
        </h2>

        <p className="text-sm text-gray-400 flex items-center gap-2">
          <FaGlobe className="text-[#06C167]" />
          <span>
            <strong>Region:</strong> {country.region}
          </span>
        </p>

        <p className="text-sm text-gray-400 flex items-center gap-2">
          <FaCity className="text-[#06C167]" />
          <span>
            <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
          </span>
        </p>

        <p className="text-sm text-gray-400 flex items-center gap-2">
          <FaUsers className="text-[#06C167]" />
          <span>
            <strong>Population:</strong> {country.population.toLocaleString()}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CountryCard;
