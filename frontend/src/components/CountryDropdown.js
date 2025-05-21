import React, { useState, useEffect } from 'react';

const CountryDropdown = ({ value, onChange, countries, label }) => {
  const [sortedCountries, setSortedCountries] = useState([]);

  useEffect(() => {
    if (countries) {
      const sorted = [...countries].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setSortedCountries(sorted);
    }
  }, [countries]);

  return (
    <div>
      <label htmlFor="country">{label}</label>
      <select
        id="country"
        name="country"
        value={value}
        onChange={onChange}
        required // Added the required attribute
      >
        <option value="">Select Country</option>
        {sortedCountries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountryDropdown;
