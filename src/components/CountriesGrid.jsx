
import React from 'react';
import CountryCard from './CountryCard';

const CountriesGrid = ({ countries }) => {
  if (!countries || countries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-xl font-semibold">No countries found</p>
        <p className="text-sm mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn">
      {countries.map((country) => (
        <CountryCard key={country.cca3} country={country} />
      ))}
    </div>
  );
};

export default CountriesGrid;
