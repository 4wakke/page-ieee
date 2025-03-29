/* eslint-disable react/prop-types */
// src/components/CountriesSelect.jsx
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { SelectReg } from "../components/ui";

const CountriesSelect = ({ register, errors }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Llamada al endpoint REST Countries para obtener la lista de países
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();

        // Filtramos solo los nombres de los países
        const countryNames = data.map((country) => country.name.common);
        countryNames.sort((a, b) => a.localeCompare(b)); // Ordena alfabéticamente
        setCountries(countryNames);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los países:", error);
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className="mb-4">
      <label htmlFor="country">
      </label>
      <SelectReg
        id="country"
        {...register("country", { required: true })}
      >
        <option value="">Selecciona un país</option>
        {loading ? (
          <option>Cargando...</option>
        ) : (
          countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))
        )}
      </SelectReg>
      {errors.country && (
      <p className="text-red-500 font-medium">El país es requerido</p>
      )}
    </div>
  );
};

export default CountriesSelect;