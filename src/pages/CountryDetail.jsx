import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCountryByCode } from "../services/countryApi";
import {
  FaArrowLeft,
  FaGlobe,
  FaFlag,
  FaCity,
  FaUsers,
  FaDownload,
  FaLanguage,
} from "react-icons/fa";

const CountryDetail = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const data = await getCountryByCode(code);
        setCountry(data[0]);
      } catch (error) {
        console.error("Error fetching country:", error);
      }
    };

    fetchCountry();
  }, [code]);

  if (!country) {
    return (
      <p className="text-center text-gray-400 text-lg mt-20">
        Loading country...
      </p>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-[#0f0f0f] text-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 px-6 py-2 bg-[#06C167] text-black font-bold rounded hover:bg-[#04894e] transition duration-200"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-lg shadow-lg p-8 grid md:grid-cols-2 gap-8">
        {/* Flag */}
        <img
          src={country.flags.png}
          alt={`Flag of ${country.name.common}`}
          className="w-full h-64 object-contain border border-[#333] rounded-lg"
        />

        {/* Details */}
        <div className="space-y-5">
          <h2 className="text-4xl font-bold text-[#06C167] flex items-center gap-2">
            <FaFlag className="text-[#06C167]" />
            {country.name.common}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <p className="flex items-center gap-2">
              <FaGlobe className="text-[#06C167]" />
              <span className="text-[#06C167] font-semibold">
                Official:
              </span>{" "}
              {country.name.official}
            </p>

            <p className="flex items-center gap-2">
              <FaCity className="text-[#06C167]" />
              <span className="text-[#06C167] font-semibold">
                Capital:
              </span>{" "}
              {country.capital?.[0] || "N/A"}
            </p>

            <p className="flex items-center gap-2">
              🌍 <span className="text-[#06C167] font-semibold">Region:</span>{" "}
              {country.region}
            </p>

            <p className="flex items-center gap-2">
              🗺️{" "}
              <span className="text-[#06C167] font-semibold">Subregion:</span>{" "}
              {country.subregion || "N/A"}
            </p>

            <p className="flex items-center gap-2">
              <FaUsers className="text-[#06C167]" />
              <span className="text-[#06C167] font-semibold">
                Population:
              </span>{" "}
              {country.population.toLocaleString()}
            </p>

            <p className="flex items-center gap-2 col-span-2">
              <FaLanguage className="text-[#06C167]" />
              <span className="text-[#06C167] font-semibold">
                Languages:
              </span>{" "}
              {country.languages
                ? Object.values(country.languages).join(", ")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default CountryDetail;
