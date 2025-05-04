export function isEmail(value) {
  const emailPattern = /^[\w-.]+@[a-zA-Z\d-]+(\.[a-zA-Z\d-]+)*\.[a-zA-Z]{2,}$/;
  return emailPattern.test(value);
}

export function isNotEmpty(value) {
  if (typeof value === "string") {
    return value.trim() !== "";
  }

  // Handle other cases (e.g., numbers, objects, etc.)
  return value !== null && value !== undefined;
}

export function isNotRequired(value) {
  return value;
}

export function hasMinLength(value, minLength) {
  return value.length >= minLength;
}

export function isEqualsToOtherValue(value, otherValue) {
  return value === otherValue;
}

export function isAlphabetsAndSpacesOnly(value) {
  const alphabetPattern = /^[a-zA-Z\s]+$/;
  return alphabetPattern.test(value);
}

export function isNumber(value) {
  return /^[0-9]+$/.test(value);
}

export function isPasswordStrong(value) {
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
  return passwordPattern.test(value);
}

export function isValidNumber(value) {
  if (!value) return false;

  const valueString = value.toString().trim();

  // First remove all separators and check the pure digit length
  const digitsOnly = valueString.replace(/\D/g, "");
  const isValidLength = digitsOnly.length >= 8 && digitsOnly.length <= 13;

  const numberRegex = /^[\d\s().-]+$/;

  // Additional check to ensure we have at least some digits
  const hasValidChars = numberRegex.test(valueString);

  return isValidLength && hasValidChars;
}

export function isValidInteger(value) {
  const valueString = value.toString().trim();

  const integerRegex = /^[+-]?\d+$/;

  return integerRegex.test(valueString);
}

// Check if gender is valid
export function isGenderValid(value) {
  return ["Male", "Female", "Other"].includes(value);
}

// Check if the country is valid based on a predefined list of countries
export function isCountryValid(value, countries) {
  return countries.includes(value);
}

// Check if the state is valid within a selected country
export function isStateValid(value, country, countryData) {
  // Find the country using its name, iso2, or iso3 code
  const specificCountryData = countryData.find(
    (v) => v.name === country || v.iso2 === country || v.iso3 === country
  );

  // Return false if no country is found
  if (!specificCountryData) return false;

  // Safely check if the states property exists and is an array
  if (
    Array.isArray(specificCountryData.states) &&
    specificCountryData.states.length > 0
  ) {
    const states = specificCountryData.states.map((v) => v.name);
    return states.includes(value); // Return true if the state is valid
  }

  // If there are no states for the country, return false
  return false;
}

// Check if passwords match
export function isPasswordsMatch(password, confirmPassword) {
  if (isNotEmpty) {
    return password === confirmPassword;
  }
}

// Check if the URL is valid
export function isValidURL(value) {
  const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/[^\s]*)?$/;
  return urlPattern.test(value);
}
