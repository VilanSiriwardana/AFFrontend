import React, { useEffect, useState } from "react";
import {
  getAllCountries,
} from "../services/countryApi";
import CountriesGrid from "../components/CountriesGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaSearch, FaGlobeAfrica, FaLanguage } from "react-icons/fa";



const Home = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [language, setLanguage] = useState("");
  const [allLanguages, setAllLanguages] = useState([]);
  const [originalCountries, setOriginalCountries] = useState([]);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const data = await getAllCountries();
      
      // Using Dummy Data
      // const data = DUMMY_COUNTRIES;
      
      if (Array.isArray(data)) {
        setCountries(data);
        setOriginalCountries(data);
        extractLanguages(data);
      } else {
        setCountries([]);
        setOriginalCountries([]);
      }
    } catch (error) {
      console.error("Failed to fetch countries:", error);
      setCountries([]);
    } finally {
      setLoading(false);
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

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    applyFilters(value, region, language);
  };

  const handleRegionChange = (e) => {
    const value = e.target.value;
    setRegion(value);
    applyFilters(search, value, language);
  };

  const handleLanguageChange = (e) => {
    const value = e.target.value;
    setLanguage(value);
    applyFilters(search, region, value);
  };

  const applyFilters = (searchTerm, regionFilter, languageFilter) => {
    let filtered = [...originalCountries];

    if (regionFilter) {
      filtered = filtered.filter((country) => country.region === regionFilter);
    }

    if (languageFilter) {
      filtered = filtered.filter((country) =>
        country.languages
          ? Object.values(country.languages).includes(languageFilter)
          : false
      );
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((country) =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setCountries(filtered);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 py-6 text-white">
      {/* Deployment Verification Banner */}
      <div className="mb-6 p-4 bg-[#06C167]/10 border border-[#06C167] rounded-lg flex items-center gap-3">
        <span className="text-xl">🚀</span>
        <div>
          <h2 className="font-bold text-[#06C167]">Production Environment Live!</h2>
          <p className="text-sm text-gray-400">This <strong>MAIN branch</strong> UPDATE was successfully deployed via Jenkins SFTP to the production server. <span className="bg-[#06C167] text-black text-xs px-2 py-0.5 rounded ml-2 font-bold">VERIFIED</span></p>
        </div>
      </div>

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

      {loading ? <LoadingSpinner /> : <CountriesGrid countries={countries} />}
    </div>
  );
};

export default Home;
