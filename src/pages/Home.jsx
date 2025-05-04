import React, { useEffect, useState } from "react";
import {
  getAllCountries,
  getCountriesByRegion,
  getCountryByName,
} from "../services/countryApi";
import CountryCard from "../components/CountryCard";
import { FaSearch, FaGlobeAfrica, FaLanguage } from "react-icons/fa";

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [language, setLanguage] = useState("");
  const [allLanguages, setAllLanguages] = useState([]);
  const [originalCountries, setOriginalCountries] = useState([]);

  const fetchCountries = async () => {
    const data = await getAllCountries();
    if (Array.isArray(data)) {
      setCountries(data);
      setOriginalCountries(data);
      extractLanguages(data);
    } else {
      setCountries([]);
      setOriginalCountries([]);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const extractLanguages = (countryList) => {
    const langs = new Set();
    countryList.forEach((country) => {
      if (country.languages) {
        Object.values(country.languages).forEach((lang) => langs.add(lang));
      }
    });
    setAllLanguages(Array.from(langs).sort());
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);
    setLanguage(""); // reset language filter

    if (value.trim() === "") {
      fetchCountries();
    } else {
      try {
        const data = await getCountryByName(value);
        setCountries(Array.isArray(data) ? data : []);
      } catch {
        setCountries([]);
      }
    }
  };

  const handleRegionChange = async (e) => {
    const selectedRegion = e.target.value;
    setRegion(selectedRegion);
    setLanguage(""); // reset language filter

    if (selectedRegion === "") {
      fetchCountries();
    } else {
      try {
        const data = await getCountriesByRegion(selectedRegion);
        setCountries(Array.isArray(data) ? data : []);
      } catch {
        setCountries([]);
      }
    }
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);

    if (selectedLanguage === "") {
      setCountries(originalCountries);
    } else {
      const filtered = originalCountries.filter((country) =>
        country.languages
          ? Object.values(country.languages).includes(selectedLanguage)
          : false
      );
      setCountries(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 py-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="relative w-full sm:w-1/2">
          <FaSearch className="absolute left-3 top-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a country..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 rounded-md bg-[#1a1a1a] text-white border border-[#333] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#06C167]"
          />
        </div>

        <div className="relative w-full sm:w-1/4">
          <FaGlobeAfrica className="absolute left-3 top-4 text-gray-400" />
          <select
            value={region}
            onChange={handleRegionChange}
            className="w-full pl-10 pr-4 py-3 rounded-md bg-[#1a1a1a] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#06C167]"
          >
            <option value="">Filter by Region</option>
            <option value="Africa">Africa</option>
            <option value="Americas">Americas</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="Oceania">Oceania</option>
          </select>
        </div>

        <div className="relative w-full sm:w-1/4">
          <FaLanguage className="absolute left-3 top-4 text-gray-400" />
          <select
            value={language}
            onChange={handleLanguageChange}
            className="w-full pl-10 pr-4 py-3 rounded-md bg-[#1a1a1a] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#06C167]"
          >
            <option value="">Filter by Language</option>
            {allLanguages.map((lang, idx) => (
              <option key={idx} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {countries.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">No countries found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {countries.map((country) => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
