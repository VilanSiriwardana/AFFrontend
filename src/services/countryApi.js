const BASE_URL = process.env.REACT_APP_REST_COUNTRIES_URL;

export const getAllCountries = async () => {
  const res = await fetch(`${BASE_URL}/all?fields=name,cca3,flags,region,capital,population,languages,subregion`);
  return res.json();
};

export const getCountryByName = async (name) => {
  const res = await fetch(`${BASE_URL}/name/${name}`);
  return res.json();
};

export const getCountriesByRegion = async (region) => {
  const res = await fetch(`${BASE_URL}/region/${region}`);
  return res.json();
};

export const getCountryByCode = async (code) => {
  const res = await fetch(`${BASE_URL}/alpha/${code}`);
  return res.json();
};
